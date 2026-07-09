package com.popobob.service;

import com.popobob.model.Order;
import com.popobob.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {
    private final OrderRepository orderRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Transactional
    public void verifyAndConfirmPayment(String paymentReference, BigDecimal paidAmount, String currency) {
        // 1. Retrieve order by unique payment reference
        Order order = orderRepository.findByPaymentReference(paymentReference)
                .orElseThrow(() -> new IllegalArgumentException("Unknown order for paymentReference: " + paymentReference));

        // 2. Idempotency Check: if order is already paid, return early (no-op)
        if ("PAID".equals(order.getPaymentStatus())) {
            log.info("Duplicate webhook: Order {} is already marked as PAID", order.getId());
            return;
        }

        // 3. Amount Validation: verify paid amount matches order total amount
        if (order.getTotalAmount().compareTo(paidAmount) != 0) {
            log.error("Amount mismatch for order {}: expected {} but received {}", order.getId(), order.getTotalAmount(), paidAmount);
            throw new IllegalArgumentException("Payment amount mismatch for order: " + order.getId());
        }

        // 4. Currency Validation
        if (!"INR".equalsIgnoreCase(currency)) {
            log.error("Invalid currency for order {}: expected INR but received {}", order.getId(), currency);
            throw new IllegalArgumentException("Invalid payment currency: " + currency);
        }

        // 5. State Machine Validation
        // Allowed initial statuses for payment verification: DRAFT, PLACED, PENDING
        if (!"PLACED".equals(order.getStatus()) && !"DRAFT".equals(order.getStatus()) && !"PENDING".equals(order.getStatus())) {
            log.error("Invalid state transition: Order {} is in state {}", order.getId(), order.getStatus());
            throw new IllegalStateException("Order is in an invalid state for payment confirmation: " + order.getStatus());
        }

        // 6. Transition State
        order.setPaymentStatus("PAID");
        order.setStatus("PLACED"); // Marks as placed so KDS can pick it up

        Order savedOrder = orderRepository.save(order);
        log.info("Payment confirmed successfully for order {}. Ref: {}", savedOrder.getId(), paymentReference);

        // 7. Notify KDS via WebSocket
        messagingTemplate.convertAndSend("/topic/orders", savedOrder);
    }
}
