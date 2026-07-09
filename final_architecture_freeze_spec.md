# Final Architecture Freeze & Development Specification
**Document Version**: 3.0.0 (FROZEN)  
**Project**: Pop O'Bob Production Platform  
**Target Action**: Single-Source of Truth for Implementation Teams  
**Date**: July 7, 2026

---

## 1. Final Architecture (Version 3.0 — Frozen)

The Pop O'Bob Production Platform utilizes a monolithic Spring Boot backend integrated with a PostgreSQL database, communicating with React-based Customer and Admin web apps. All stubs, mock data caches, and hardcoded customization options are eliminated in favor of a dynamic database-driven model.

```
       [ React Customer App ]              [ React Admin App ]
          (Local Storage)                    (Zustand Store)
                 │                                  │
                 ▼                                  ▼
         Customer API (/api/v2)              Admin API (/api/v2)
                 │                                  │
                 └──────────────────┬───────────────┘
                                    │  (HTTPS / Secure Websockets)
                                    ▼
                     [ SPRING BOOT MONOLITHIC SYSTEM ]
                       - JWT Authentication Filter
                       - Razorpay Webhook Verifier
                       - Optimistic Locking Version Manager
                       - Transactional Order Coordinator
                       - WebSocket KDS Broadcaster
                                    │
                                    ▼
                          [ POSTGRES DATABASE ]
```

---

## 2. Final Database Schema

The Version 3.0 database schema incorporates the availability blacklist optimization, dynamic quantities support, unique payment indices, and the future combo schema placeholder.

```
                   ┌────────────────────────┐
                   │        stores          │
                   └───────────┬────────────┘
                               │
         ┌─────────────────────┴─────────────────────┐
         │ 1                                         │ 1
         ▼ N                                         ▼ N
┌────────────────────────┐                 ┌────────────────────────┐
│store_product_blacklists│                 │ store_option_blacklists│
└────────────────────────┘                 └────────────────────────┘

┌────────────────────────┐                 ┌────────────────────────┐
│ customization_groups   │                 │ customization_options  │
└──────────┬─────────────┘                 └───────────┬────────────┘
           │ 1                                         │ 1
           ▼ N                                         ▼ N
┌────────────────────────┐                 ┌────────────────────────┐
│menu_item_customizations│                 │order_item_customizations│
└────────────────────────┘                 └────────────────────────┘

┌────────────────────────┐
│    combo_structure     │
│ (Combo Placeholder PK) │
└────────────────────────┘
```

### 2.1 Table Definitions (DDL)

```sql
-- 1. Store Locations
CREATE TABLE stores (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    version INT NOT NULL DEFAULT 0, -- Optimistic Locking
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Customization Option Groups
CREATE TABLE customization_groups (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    min_selections INT DEFAULT 0 CHECK (min_selections >= 0),
    max_selections INT DEFAULT 1 CHECK (max_selections >= 0),
    free_selections_limit INT DEFAULT 0 CHECK (free_selections_limit >= 0),
    is_required BOOLEAN DEFAULT FALSE,
    version INT NOT NULL DEFAULT 0
);

-- 3. Individual Topping/Option Items
CREATE TABLE customization_options (
    id VARCHAR(50) PRIMARY KEY,
    group_id VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    default_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00 CHECK (default_price >= 0.00),
    is_available BOOLEAN DEFAULT TRUE,
    version INT NOT NULL DEFAULT 0,
    CONSTRAINT fk_customization_group FOREIGN KEY (group_id) REFERENCES customization_groups(id) ON DELETE CASCADE
);

-- 4. Catalog Products (With Version Control)
ALTER TABLE products ADD COLUMN IF NOT EXISTS version INT NOT NULL DEFAULT 0;

-- 5. Product-to-Group Customizer Mapping Join Table
CREATE TABLE menu_item_customizations (
    menu_item_id VARCHAR(50) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    customization_group_id VARCHAR(50) NOT NULL REFERENCES customization_groups(id) ON DELETE CASCADE,
    display_order INT DEFAULT 0,
    PRIMARY KEY (menu_item_id, customization_group_id)
);

-- 6. Store-Specific Blacklist Tables (Exclusions only - default is Available)
CREATE TABLE store_product_blacklists (
    store_id VARCHAR(50) NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    product_id VARCHAR(50) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    PRIMARY KEY (store_id, product_id)
);

CREATE TABLE store_option_blacklists (
    store_id VARCHAR(50) NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    option_id VARCHAR(50) NOT NULL REFERENCES customization_options(id) ON DELETE CASCADE,
    PRIMARY KEY (store_id, option_id)
);

-- 7. Unique Constraint & Draft Status on Orders
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_reference VARCHAR(100);
ALTER TABLE orders ADD CONSTRAINT uq_payment_reference UNIQUE (payment_reference);

-- 8. Structured Order Customizations (With Quantity Support)
CREATE TABLE order_item_customizations (
    order_item_id UUID NOT NULL REFERENCES order_items(id) ON DELETE CASCADE,
    option_id VARCHAR(50) NOT NULL REFERENCES customization_options(id),
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0.00),
    quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
    PRIMARY KEY (order_item_id, option_id)
);

-- 9. Combo Structures Join Table Placeholder
CREATE TABLE combo_structure (
    parent_product_id VARCHAR(50) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    child_product_id VARCHAR(50) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    display_order INT DEFAULT 0,
    PRIMARY KEY (parent_product_id, child_product_id)
);
```

### 2.2 Index Strategy
```sql
CREATE INDEX idx_store_prod_blacklist ON store_product_blacklists(store_id);
CREATE INDEX idx_store_opt_blacklist ON store_option_blacklists(store_id);
CREATE INDEX idx_order_item_cust ON order_item_customizations(order_item_id);
```

---

## 3. Final API Contract

All endpoints are versioned under `/api/v2/`.

### 3.1 Customizer Endpoints (Client Menu)
* **GET `/api/v2/products/{id}/customizer`**
  * *Request Headers*: `X-Store-ID: store-gachibowli`
  * *Response (200 OK)*:
    ```json
    {
      "productId": "p-taro-milk-tea",
      "customizationGroups": [
        {
          "id": "cg-sweetness",
          "name": "Sweetness Level",
          "minSelections": 1,
          "maxSelections": 1,
          "freeSelectionsLimit": 0,
          "isRequired": true,
          "options": [
            { "id": "co-sugar-100", "name": "100% Sugar", "price": 0.00 },
            { "id": "co-sugar-50", "name": "50% Sugar", "price": 0.00 }
          ]
        },
        {
          "id": "cg-toppings",
          "name": "Add-ons",
          "minSelections": 0,
          "maxSelections": 5,
          "freeSelectionsLimit": 1,
          "isRequired": false,
          "options": [
            { "id": "co-boba-pearls", "name": "Boba Pearls", "price": 40.00 },
            { "id": "co-coconut-jelly", "name": "Coconut Jelly", "price": 30.00 }
          ]
        }
      ]
    }
    ```

### 3.2 Order Endpoints
* **POST `/api/v2/orders`**
  * *Request Body*:
    ```json
    {
      "customerName": "John Doe",
      "customerPhone": "9876543210",
      "orderType": "DINE_IN",
      "tableNumber": "5",
      "paymentReference": "pay_xyz12345",
      "items": [
        {
          "productId": "p-taro-milk-tea",
          "quantity": 1,
          "customizations": [
            { "optionId": "co-sugar-100", "quantity": 1 },
            { "optionId": "co-boba-pearls", "quantity": 2 }
          ]
        }
      ]
    }
    ```
  * *Response (201 Created)*:
    ```json
    { "orderId": "550e8400-e29b-41d4-a716-446655440000", "status": "DRAFT", "totalAmount": 229.00 }
    ```
  * *Errors*:
    * `400 Bad Request` (Validation errors, price tampering detected, or blacklisted toppings selected).

### 3.3 Razorpay Callback Webhook Verification
* **POST `/api/v2/payments/callback`**
  * *Request Headers*: `x-razorpay-signature: hash_value`
  * *Request Body*: Raw webhook payload containing order details.
  * *Response (200 OK)*: Callback processed successfully.
  * *Security*: Verifies webhook signature against application properties secret key before updating the database order status.

---

## 4. Final Domain Model

The core domain model consists of these entities:

1. **`Store`**: Represents a physical location.
2. **`Product`**: Base menu item. Combos are a structural type containing links to multiple `Products` through the `combo_structure` table.
3. **`CustomizationGroup`**: Option rules (min/max/free parameters).
4. **`CustomizationOption`**: Choices (boba, sugar level, etc.) associated with groups.
5. **`Order`**: Tracks state (`DRAFT`, `CONFIRMED`, `PREPARING`, `READY`, `COMPLETED`), delivery type, unique payment references, and loyalty transactions.
6. **`OrderItem`**: Specific line item in an order.
7. **`OrderItemCustomization`**: Tracks selections with **explicit price and quantity** values recorded at the time of checkout.

---

## 5. Final Frontend Contract

### 5.1 Customizer Sheet (`CustomizerSheet.tsx`)
* **API Dependency**: `GET /api/v2/products/{id}/customizer`
* **Zustand State**: Stores selections in `useCartStore` under the item payload.
* **Validation**: Checks `minSelections` and `maxSelections` configuration criteria before enabling the "Add to Cart" button.

### 5.2 Cart & Checkout (`Cart.tsx`)
* **API Dependency**: `POST /api/v2/orders`
* **Flow**: Send complete structured toppings payload to `/api/v2/orders` on submit. Displays loading animations during Razorpay payload verification.

---

## 6. Final Development Roadmap

```
[Milestone 1: Database Migration] ➔ [Milestone 2: Monolith Order recs & Validation] ➔ [Milestone 3: Webhook Signatures Verification] ➔ [Milestone 4: Admin Customizer CRUD] ➔ [Milestone 5: Customer App Customizer UI integration]
```

### 6.1 Milestone 1: Database Schema Release
* **Prerequisites**: Access to the database environment.
* **Rollback Plan**: Run the SQL schema rollback script.
* **Acceptance Criteria**: All tables, keys, blacklist configurations, and unique constraints are created successfully.

### 6.2 Milestone 2: Order Price Recalculation & Validation
* **Prerequisites**: Milestone 1 complete.
* **Acceptance Criteria**: Backend validates submitted checkout payloads, recalculates totals against database records, and blocks price manipulations with a `400 Bad Request` error.

---

## 7. Final Coding Standards

* **Package Structure**: Standard Spring Boot layout:
  ```
  com.popobob
  ├── config        (SecurityConfig, DataSourceConfig)
  ├── controller    (AiController, OrderController)
  ├── dto           (OrderRequestDtoV2)
  ├── model         (Product, Store, CustomizationGroup)
  ├── repository    (ProductRepository, StoreRepository)
  └── service       (OrderService, AIContextService)
  ```
* **Transaction Bounds**: Write-heavy operations (e.g. order creation, callbacks) must be annotated with `@Transactional(isolation = IsolationLevel.READ_COMMITTED)`.
* **Optimistic Locking**: Every edit operation on `Product`, `Store`, or `CustomizationGroup` must verify and increment `@Version` parameters to prevent write collision.

---

## 8. Final Testing Strategy

* **Unit Testing**: Validate subtotal calculations with 0, 1, and multiple toppings in `OrderServiceTest.java`.
* **Integration Testing**: Post dummy payloads to `/api/v2/orders` (verify that price discrepancies return `400 Bad Request` and valid payloads return `201 Created`).
* **Security Testing**: Verify that webhook payloads with modified signature headers return `401 Unauthorized`.

---

## 9. Final Deployment & Rollback Strategy

* **Deployment Strategy**: Rolling Update. Deploy backend server updates first while keeping old endpoints active to support active sessions.
* **Rollback Plan**:
  1. Revert backend server image to the previous container version.
  2. Run the SQL schema rollback script if database modifications must be undone.

---

This architecture is now frozen and approved for implementation. Future changes should be treated as change requests rather than architecture revisions.
