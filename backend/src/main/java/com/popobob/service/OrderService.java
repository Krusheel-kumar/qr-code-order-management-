package com.popobob.service;

import com.popobob.dto.OrderItemDto;
import com.popobob.dto.OrderRequestDto;
import com.popobob.model.*;
import com.popobob.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final OrderSequenceRepository sequenceRepository;
    private final SimpMessagingTemplate messagingTemplate;
    
    private final StoreRepository storeRepository;
    private final CustomizationOptionRepository optionRepository;
    private final LoyaltyService loyaltyService;

    @Transactional
    public Order createOrder(OrderRequestDto request) {
        Order order = new Order();
        
        // Generate Order Number
        OrderSequence seq = sequenceRepository.findAndLockById().orElseGet(() -> {
            OrderSequence newSeq = new OrderSequence();
            return sequenceRepository.save(newSeq);
        });
        order.setOrderNumber("POB-" + seq.getNextVal());
        seq.setNextVal(seq.getNextVal() + 1);
        sequenceRepository.save(seq);

        order.setStatus("PLACED");
        order.setCustomerName(request.getCustomerName());
        order.setCustomerPhone(request.getCustomerPhone());
        order.setTableNumber(request.getTableNumber());
        order.setOrderType(request.getOrderType());
        order.setStoreId(request.getStoreId());
        order.setPaymentReference(request.getPaymentReference());
        order.setPaymentStatus(request.getPaymentReference() != null ? "PAID" : "PENDING");
        
        if (request.getUserId() != null) {
            userRepository.findById(request.getUserId()).ifPresent(order::setUser);
        }
        
        List<OrderItem> items = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;

        // Load store overrides if storeId is provided
        Store store = null;
        if (request.getStoreId() != null) {
            store = storeRepository.findById(request.getStoreId()).orElse(null);
        }

        for (OrderItemDto itemDto : request.getItems()) {
            Product product = productRepository.findById(itemDto.getProductId())
                    .orElseThrow(() -> new IllegalArgumentException("Product not found: " + itemDto.getProductId()));

            // Verify product availability
            if (!product.getIsAvailable()) {
                throw new IllegalArgumentException("Product is currently unavailable: " + product.getName());
            }
            if (store != null && store.getBlacklistedProductIds().contains(product.getId())) {
                throw new IllegalArgumentException("Product is not available at this branch: " + product.getName());
            }

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProductId(itemDto.getProductId());
            item.setProductName(product.getName());
            item.setQuantity(itemDto.getQuantity());
            item.setSpecialInstructions(itemDto.getSpecialInstructions());

            BigDecimal expectedItemPrice = product.getPrice();
            if (itemDto.getCustomizations() != null && itemDto.getCustomizations().contains("Size: Large")) {
                BigDecimal addOn = product.getLargePriceAddOn() != null ? product.getLargePriceAddOn() : new BigDecimal("30");
                expectedItemPrice = expectedItemPrice.add(addOn);
            }
            List<OrderItemCustomization> customizationsList = new ArrayList<>();

            // Structured Customizations & Price Recalculation
            if (itemDto.getCustomizationsList() != null && !itemDto.getCustomizationsList().isEmpty()) {
                java.util.Map<CustomizationGroup, List<OrderItemCustomization>> groupSelections = new java.util.HashMap<>();
                
                for (com.popobob.dto.CustomizationSelectionDto selection : itemDto.getCustomizationsList()) {
                    CustomizationOption option = optionRepository.findById(selection.getOptionId())
                            .orElseThrow(() -> new IllegalArgumentException("Customization option not found: " + selection.getOptionId()));
                    
                    // Verify option is available and not blacklisted
                    if (!option.getIsAvailable()) {
                        throw new IllegalArgumentException("Customization option is unavailable: " + option.getName());
                    }
                    if (store != null && store.getBlacklistedOptionIds().contains(option.getId())) {
                        throw new IllegalArgumentException("Customization option is unavailable at this branch: " + option.getName());
                    }

                    CustomizationGroup group = option.getGroup();
                    OrderItemCustomization oic = new OrderItemCustomization();
                    oic.setOptionId(option.getId());
                    oic.setName(option.getName());
                    oic.setPrice(option.getDefaultPrice());
                    oic.setQuantity(selection.getQuantity());
                    
                    groupSelections.computeIfAbsent(group, k -> new ArrayList<>()).add(oic);
                    customizationsList.add(oic);
                }

                // Calculate customization pricing with group free limits
                BigDecimal customizationsPrice = BigDecimal.ZERO;
                for (java.util.Map.Entry<CustomizationGroup, List<OrderItemCustomization>> entry : groupSelections.entrySet()) {
                    CustomizationGroup group = entry.getKey();
                    List<OrderItemCustomization> selections = entry.getValue();

                    int totalQty = selections.stream().mapToInt(OrderItemCustomization::getQuantity).sum();
                    int freeLimit = group.getFreeSelectionsLimit() != null ? group.getFreeSelectionsLimit() : 0;
                    
                    // Sort options by price ascending so the cheapest options are discounted first
                    selections.sort(java.util.Comparator.comparing(OrderItemCustomization::getPrice));

                    int remainingFree = freeLimit;
                    for (OrderItemCustomization selection : selections) {
                        int qty = selection.getQuantity();
                        int freeApplied = Math.min(qty, remainingFree);
                        remainingFree -= freeApplied;
                        
                        int billableQty = qty - freeApplied;
                        customizationsPrice = customizationsPrice.add(
                            selection.getPrice().multiply(new BigDecimal(billableQty))
                        );
                    }
                }

                // Set structured elements
                item.setCustomizationsList(customizationsList);

                // Set legacy customizations flat string (Dual-Write strategy)
                List<String> flatList = new ArrayList<>();
                for (OrderItemCustomization oic : customizationsList) {
                    flatList.add(oic.getName() + (oic.getQuantity() > 1 ? " (x" + oic.getQuantity() + ")" : ""));
                }
                item.setCustomizations(String.join(" • ", flatList));

                BigDecimal expectedSubtotal = expectedItemPrice.add(customizationsPrice).multiply(new BigDecimal(itemDto.getQuantity()));
                
                // Price tampering security check
                if (itemDto.getSubtotal() != null && itemDto.getSubtotal().subtract(expectedSubtotal).abs().doubleValue() > 0.01) {
                    throw new IllegalArgumentException("Price tampering detected: expected item subtotal is " + expectedSubtotal + " but received " + itemDto.getSubtotal());
                }
                
                item.setSubtotal(expectedSubtotal);
                totalAmount = totalAmount.add(expectedSubtotal);
            } else {
                // =========================================================================
                // TEMPORARY COMPATIBILITY LAYER - LEGACY CHECKOUT FALLBACK
                // =========================================================================
                // TODO: Remove this entire fallback branch immediately after the Customer App
                // migration to V2 structured checkouts is complete.
                //
                // Risk: This path accepts client-calculated subtotals without server-side recalculation,
                // making it vulnerable to client-side price tampering.
                //
                // Keep active until: Customer App V2 client is fully deployed.
                // =========================================================================
                item.setCustomizations(itemDto.getCustomizations());
                BigDecimal subtotal = itemDto.getSubtotal() != null ? itemDto.getSubtotal() : product.getPrice().multiply(new BigDecimal(itemDto.getQuantity()));
                item.setSubtotal(subtotal);
                totalAmount = totalAmount.add(subtotal);
            }

            items.add(item);
        }

        order.setItems(items);
        // Apply Wallet Discount if points used
        if (request.getPointsUsed() != null && request.getPointsUsed() > 0 && order.getUser() != null) {
            User user = order.getUser();
            int currentPoints = user.getLoyaltyPoints() == null ? 0 : user.getLoyaltyPoints();
            if (currentPoints >= request.getPointsUsed()) {
                user.setLoyaltyPoints(currentPoints - request.getPointsUsed());
                // 10 points = 1 currency unit
                BigDecimal discount = new BigDecimal(request.getPointsUsed()).divide(new BigDecimal("10"));
                totalAmount = totalAmount.subtract(discount);
                if (totalAmount.compareTo(BigDecimal.ZERO) < 0) {
                    totalAmount = BigDecimal.ZERO;
                }
            }
        }
        
        order.setTotalAmount(totalAmount);
        
        Order savedOrder = orderRepository.save(order);
        
        // Calculate and add loyalty points via Loyalty Module (requires saved order ID)
        loyaltyService.processOrderLoyalty(savedOrder);
        
        // Notify Staff KDS via WebSocket
        messagingTemplate.convertAndSend("/topic/orders", savedOrder);
        
        return savedOrder;
    }

    @Transactional
    public Order updateOrderStatus(UUID orderId, String newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(newStatus);
        Order savedOrder = orderRepository.save(order);
        
        // Notify Staff and Customer
        messagingTemplate.convertAndSend("/topic/orders", savedOrder);
        messagingTemplate.convertAndSend("/topic/orders/" + orderId, savedOrder);
        
        return savedOrder;
    }

    public List<Order> getActiveOrders() {
        return orderRepository.findByStatusInOrderByCreatedAtDesc(List.of("PLACED", "PREPARING", "READY"));
    }

    public Order getOrderById(UUID id) {
        return orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));
    }

    public List<Order> getAllOrdersHistory() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }
}
