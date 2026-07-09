# Final CTO Design Review: Version 2.1 (Pop O'Bob Production Edition)
**Prepared by**: Chief Technology Officer & Principal Systems Architect  
**Review Status**: ⚠️ APPROVED WITH REQUIRED CHANGES  
**Target Action**: Address identified architectural flaws prior to development start.  
**Date**: July 7, 2026

---

## 1. Architecture Validation (DevOps, QA & Lead Architect Assessment)

Following a deep design review of the Version 2.1 blueprint, the overall architecture is verified as **conceptually sound** for a single-brand, multi-branch deployment. Operating on a monolithic Spring Boot backend and PostgreSQL database provides low operational complexity while allowing easy horizontal scaling.

However, several hidden flaws, coupling risks, and logical bottlenecks must be addressed:

### 1.1 Structural Mismatch on Multiple Quantities (Critical Database Flaw)
* **The Flaw**: The proposed table `order_item_customizations` uses a composite primary key: `(order_item_id, option_id)`.
* **The Impact**: If a customer selects **multiple quantities** of a single option (e.g., "Double Boba Topping" or "Double Oreo Crumbs"), the relational schema cannot represent this because the key combination `(order_item_id, option_id)` must be unique. Attempting to insert two units of the same option will result in a **Duplicate Key Constraint Violation** and crash the transaction.
* **Resolution**: Add a `quantity` integer column to `order_item_customizations`, and remove the expectation of inserting multiple rows for the same option.

### 1.2 Price Tampering Validation Race Conditions (High Coupling Risk)
* **The Flaw**: Order total validations dynamically load product and customization records during checkout.
* **The Impact**: If an admin updates a product price or disables a topping in the database *exactly* between the time the customer initiates Razorpay checkout and the time the payment callback is verified, the server-side price recalculation will fail, causing the order to be rejected even though the customer paid the correct amount.
* **Resolution**: Capture and lock the computed order total at the time of **order initialization** (draft status), and validate against that snapshot during payment verification rather than querying active catalog prices dynamically on callback.

---

## 2. Database Review

### 2.1 Normalization and Constraints Analysis

| Table | Normalization Status | Cascade Rules | Missing Constraints | Index Requirements | Recommendation |
| :--- | :---: | :--- | :--- | :--- | :--- |
| **`stores`** | 3NF | RESTRICT (on orders) | None | Index on `is_active` | **Approved** |
| **`customization_groups`** | 3NF | CASCADE | `CHECK (min_selections >= 0)` | None | **Approved** |
| **`customization_options`** | 3NF | CASCADE | `CHECK (default_price >= 0)` | Index on `group_id` | **Approved** |
| **`menu_item_customizations`** | BCNF | CASCADE | None | Composite PK index | **Approved** |
| **`store_products`** | BCNF | CASCADE | None | Index on `store_id` | **Optimizable (See 2.2)** |
| **`store_customization_options`**| BCNF | CASCADE | None | Index on `store_id` | **Optimizable (See 2.2)** |
| **`order_item_customizations`** | **UNSOUND** | CASCADE | Missing `quantity` and price constraints | Index on `order_item_id` | ❌ **REJECTED (Requires quantity columns)** |

### 2.2 Optimization for Store-Level Overrides (Availability Bloat)
* **The Flaw**: The tables `store_products` and `store_customization_options` require inserting a row for every single menu item and topping for *every* new branch added. This creates $N \times M$ rows of redundant data (e.g. 50 stores $\times$ 100 products = 5,000 rows just to say "available").
* **Resolution**: Invert the logic. Assume items are **available by default** across all stores. These tables should act as **blacklist tables** (`store_product_blacklists`), where a row is only written if a specific product or customization is explicitly disabled at a branch location.

---

## 3. Business Rules Review

* **Dynamic Quantities**: ⚠️ **Fails**. Lacks database quantity records for toppings in order histories.
* **Store Availability Overrides**: ✅ **Supported**. Resolved through override/blacklist tables.
* **Conditional / Option Groups**: ✅ **Supported**. Handled by `min_selections` and `max_selections` logic.
* **Future Combo Meals**: ⚠️ **Fails**. Version 2.1 treats products as flat. It cannot represent nested child items (e.g. choosing custom beverages inside a "Boba + Croissant Combo").
  * *Required Abstraction*: Introduce a `combo_items` join table linking a parent product to child products, enabling the customizer sheet to query sub-item customizers recursively.

---

## 4. Backend Review (DTOs, Security, Transactions)

### 4.1 Price Calculations & Idempotency
* **Manipulation Rejection**: The backend safely rejects price manipulation by validating subtotals against the database. However, this check is vulnerable to database read locks.
* **Concurrency**: Order writing must execute inside a `Transactional(isolation = IsolationLevel.READ_COMMITTED)` context.
* **Optimistic Locking**: To prevent concurrent admin edits from corrupting catalogs, a `@Version` field must be added to [Product.java](file:///C:/Users/KRISH/OneDrive/Desktop/QR%20Based%20Order%20Management/backend/src/main/java/com/popobob/model/Product.java).

---

## 5. Frontend Review (Customer UI, Admin & KDS)

* **Customizer Sheet**: The React customizer integrates cleanly by mapping dynamic groups. However, the UI must handle **zero-selection groups** gracefully without blocking user progression.
* **KDS Rendering**: Using structured arrays resolves rendering issues. The KDS card component must display quantity multipliers (e.g. `2x Pearls`) next to toppings.

---

## 6. Migration Review (Zero-Downtime Rollout)

To ensure zero downtime when deploying the new dynamic toppings tables on top of the live database:
1. **Column Additions**: Columns like `category_id` in `addons` must be added as nullable fields first.
2. **Data Backfilling**: Run a migration script to map existing addons to a default customization group (e.g., "Standard Toppings").
3. **Constraint Activation**: Once all records are backfilled, apply the `NOT NULL` and foreign key constraints.

---

## 7. Security Review

* **Razorpay Callback Validation**: ⚠️ Webhook callbacks must validate the signature using the `x-razorpay-signature` header against the system's webhook secret to prevent order spoofing.
* **Replay Attacks**: `paymentReference` must be configured with a `UNIQUE` index constraint in the `orders` table to block duplicate order submissions.

---

## 8. Performance Review (Database Indexes)

The following database indexes must be added to prevent performance degradation under peak ordering load:
```sql
CREATE INDEX idx_products_available ON products(is_available);
CREATE INDEX idx_addons_category ON addons(category_id);
CREATE INDEX idx_order_item_cust_order ON order_item_customizations(order_item_id);
```

---

## 9. Long-Term Maintainability

* **Separation of Concerns**: Good. The Order validation logic is decoupled from the Payment gateway integration.
* **Technical Debt Risk**: If combo configurations are deferred without placing a database schema placeholder, refactoring order processing in Year 2 will require rewriting the checkout APIs.

---

## 10. Final CTO Verdict

### ⚠️ APPROVED WITH REQUIRED CHANGES

The development team is cleared to begin the implementation phase **only after** addressing the following prioritized changes:

### Priority 1: Critical Changes (Must resolve before schema generation)
1. **Fix `order_item_customizations` Quantity Support**:
   * Add a `quantity` integer column to the `order_item_customizations` table.
   * Update the primary key constraint to cover `(order_item_id, option_id)` while allowing quantities to increment.
2. **Razorpay Webhook Validation**:
   * Implement signature hash verification using the payment secret in the callback controller.

### Priority 2: High Changes (Performance & Extensibility)
1. **Availability Blacklist Optimization**:
   * Rename `store_products` and `store_customization_options` to `store_product_blacklists` and `store_option_blacklists`.
   * Treat items as available by default; write rows only when an item is disabled at a store.
2. **Idempotency Check**:
   * Add a `UNIQUE` database constraint to `orders.payment_reference`.

### Priority 3: Medium Changes (Combo Support)
1. **Combo Schema Abstraction**:
   * Create a `combo_structure` table `(parent_product_id, child_product_id)` to allow linking products inside combos for future release.
