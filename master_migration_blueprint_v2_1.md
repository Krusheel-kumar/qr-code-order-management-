# Refined Production Architecture & Migration Blueprint (Version 2.1)
## Pop O'Bob Production Edition
**Prepared by**: Chief Technology Officer & Principal Systems Architect  
**Status**: Architecture Refinement & Planning Freeze (No Code Modified)  
**Context**: Single Business (Pop O'Bob) with Multiple Local Branches  
**Date**: July 7, 2026

---

## 1. Categorized Component Classification

To deliver high business value immediately without over-engineering the system, we classify every architectural component from Version 2.0 into one of three categories:
* **Category A — Implement Now**: Critical for the current multi-branch deployment of Pop O'Bob.
* **Category B — Future Ready**: Designed in the database schema or REST API contract but stubbed or deferred in implementation.
* **Category C — Enterprise Only**: Isolated for future SaaS expansion or multi-brand scaling.

| Architectural Component | Category | Business Value | Development Effort | Rationale |
| :--- | :---: | :---: | :---: | :--- |
| **Database Schema** | **Category A** | High | Medium | Must support store registries and dynamic options to eliminate hardcoded stubs. |
| **Customization Engine** | **Category A** | High | High | Core value for drinks customizer (sweetness, ice, toppings). |
| **Product Configuration** | **Category A** | High | Low | Links products to their customization options. |
| **Branch Management** | **Category A** | High | Low | Required to route QR orders to specific tables and kitchen terminals. |
| **Order Payload** | **Category A** | High | Medium | Eliminates flat customization strings in favor of structured topping IDs. |
| **KDS Integration** | **Category A** | High | Medium | Renders dynamic customization parameters clearly for the kitchen. |
| **Invoice Model** | **Category A** | High | Low | Renders customer receipt breakdown with selected toppings and pricing. |
| **Loyalty Engine** | **Category A** | High | Low | In-monolith loyalty tracking already exists; no need for external rules engines. |
| **pgvector** | **Category A** | High | Low | Already integrated for AI semantic vector embeddings in the backend. |
| **Store-Level Pricing** | **Category B** | Medium | Medium | Database supports override tables, but frontend falls back to brand defaults. |
| **Cart Architecture** | **Category B** | Low | Low | React local storage is sufficient; server-persisted carts are deferred. |
| **Coupon System** | **Category B** | Medium | Medium | Backend entity and validate API exist; UI input block is integrated. |
| **AI Recommender** | **Category B** | Medium | Medium | Context API fetches actual DB orders/products, but context details are simplified. |
| **Analytics & Reports** | **Category B** | Low | Medium | Basic dashboard queries from live orders. Complex charts are deferred. |
| **Feature Flags** | **Category B** | Low | Low | Webpack/Vite client `.env` flags are sufficient. |
| **API Versioning** | **Category B** | Low | Low | Standard `/api/v2/` routing prefix for breaking changes. |
| **Redis Caching** | **Category B** | Low | Medium | Deferred; PostgreSQL index optimization is sufficient for single-brand traffic. |
| **Multi-Tenancy** | **Category C** | None (Now) | High | Pop O'Bob is a single brand. Multi-tenancy structures are deferred. |
| **API Gateway** | **Category C** | None (Now) | High | Spring Boot Monolith handles client requests directly. |
| **Kafka / RabbitMQ** | **Category C** | None (Now) | High | Asynchronous tasks use Java `@Async` thread executors. |
| **LaunchDarkly** | **Category C** | None (Now) | Low | Standard environment variables are sufficient. |
| **Server-Synced Carts** | **Category C** | None (Now) | High | Local browser caching is adequate. |
| **Load Balancing** | **Category C** | None (Now) | Medium | Deployment platform (e.g. Railway/Render) handles native scaling. |
| **Microservices** | **Category C** | None (Now) | High | The system will remain a unified, maintainable Spring Boot monolith. |

---

## 2. Simplified Production Architecture (Version 2.1)

Version 2.1 is optimized for a single business (Pop O'Bob), multiple branches, a single PostgreSQL database, and a monolithic Spring Boot backend.

```
       [ React Customer App ]              [ React Admin App ]
          (Local Storage)                    (Zustand Store)
                 │                                  │
                 ▼                                  ▼
         Customer API (/api/v2)              Admin API (/api/v2)
                 │                                  │
                 └──────────────────┬───────────────┘
                                    │
                                    ▼
                     [ SPRING BOOT MONOLITHIC BEAT ]
                       - Spring Security & JWT Auth
                       - Customizer & Coupon Services
                       - Order Recalculation Service
                       - WebSocket KDS Dispatcher
                       - AI context provider (Gemini pgvector)
                                    │
                                    ▼
                          [ POSTGRES DATABASE ]
```

### 2.2 Refined Database Schema DDL (Pop O'Bob Edition)
The schema removes SaaS metadata (`tenants`, `brands`) and focuses on branch overrides and structured customization groups.

```sql
-- 1. Store Registry (Pop O'Bob Branches)
CREATE TABLE stores (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Customization Groups
CREATE TABLE customization_groups (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    min_selections INT DEFAULT 0,
    max_selections INT DEFAULT 1,
    free_selections_limit INT DEFAULT 0,
    is_required BOOLEAN DEFAULT FALSE
);

CREATE TABLE customization_options (
    id VARCHAR(50) PRIMARY KEY,
    group_id VARCHAR(50) NOT NULL REFERENCES customization_groups(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    default_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    is_available BOOLEAN DEFAULT TRUE
);

-- 3. Link Menu Items to Customization Groups
CREATE TABLE menu_item_customizations (
    menu_item_id VARCHAR(50) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    customization_group_id VARCHAR(50) NOT NULL REFERENCES customization_groups(id) ON DELETE CASCADE,
    display_order INT DEFAULT 0,
    PRIMARY KEY (menu_item_id, customization_group_id)
);

-- 4. Store-Level Availability Overrides (Branch Inventory)
CREATE TABLE store_products (
    store_id VARCHAR(50) NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    product_id VARCHAR(50) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    is_available BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (store_id, product_id)
);

CREATE TABLE store_customization_options (
    store_id VARCHAR(50) NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    option_id VARCHAR(50) NOT NULL REFERENCES customization_options(id) ON DELETE CASCADE,
    is_available BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (store_id, option_id)
);

-- 5. Structured Order Item Customizations (Replacing legacy flat string)
CREATE TABLE order_item_customizations (
    order_item_id UUID NOT NULL REFERENCES order_items(id) ON DELETE CASCADE,
    option_id VARCHAR(50) NOT NULL REFERENCES customization_options(id),
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (order_item_id, option_id)
);
```

### 2.3 Operational Flows

#### Customizing & Adding to Cart
1. **Client Request**: Customer selects a drink. Customer App calls `GET /api/v2/products/{id}/customizer`.
2. **Database Lookup**: Backend queries the customization groups and options associated with the product ID. It checks the `store_customization_options` table to verify if any topping is marked unavailable at the scanned store location.
3. **Cart Assembly**: The selected options are stored in the local `useCartStore` cart as structured objects containing `optionId`, `name`, and `price`.

#### Structured Order Checkout
1. **Order Submission**: Customer submits order payload to `POST /api/v2/orders` containing structured item options.
2. **Server-side Validation**: [OrderService.java](file:///C:/Users/KRISH/OneDrive/Desktop/QR%20Based%20Order%20Management/backend/src/main/java/com/popobob/service/OrderService.java) runs a price calculation loop:
   $$\text{Subtotal} = \text{Product Price} + \sum (\text{Option Price})$$
   It compares this result with the submitted subtotal. If the prices do not match, the order is blocked with a `400 Bad Request` error to prevent payment tampering.
3. **Razorpay validation**: Once payment is verified, the order is saved, writing option items into the `order_item_customizations` table.
4. **WebSocket Dispatch**: The order details are dispatched via WebSocket `/topic/orders` to the KDS.

#### KDS Render
* [KDS.tsx](file:///C:/Users/KRISH/OneDrive/Desktop/QR%20Based%20Order%20Management/frontend/src/pages/admin/KDS.tsx) maps the structured customizations array to display toppings grouped by their customization categories:
  ```typescript
  // Group toppings by category on KDS card
  {item.customizations && (
    <ul className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
      {item.customizations.map(c => (
        <li key={c.optionId}>• {c.name} (+₹{c.price})</li>
      ))}
    </ul>
  )}
  ```

---

## 3. Future Evolution (SaaS Readiness Plan)

Version 2.1 is designed so that the transition to Version 3.0 (Enterprise SaaS) can be executed without rebuilding core modules.

```
                  [ VERSION 2.1 (Monolith Multi-Branch) ]
                                     │
                                     ▼ (Phase 1)
                  [ Add Brand / Tenant Tables (Optional FKs) ]
                                     │
                                     ▼ (Phase 2)
                  [ API Gateway / JWT Routing Scopes ]
                                     │
                                     ▼ (Phase 3)
                  [ Redis Cache / pgvector Scaling ]
```

### Evolution Strategy

#### Phase 1: Database Migration to Multi-Tenant (Non-Breaking)
* Add `tenants` and `brands` tables to the database.
* Add `tenant_id` and `brand_id` columns as **nullable foreign keys** to `stores`, `menu_items`, and `customization_groups`.
* Update legacy records to point to a default tenant ID (`Pop O'Bob`).
* Set these columns to `NOT NULL` once database records are updated. Existing SQL queries continue working because they default to the global brand.

#### Phase 2: Add API Gateway & Request Filters
* Place an API Gateway (Spring Cloud Gateway) in front of the monolith.
* The Gateway intercepts requests, extracts headers (`X-Tenant-ID`, `X-Brand-ID`), and injects them into the HTTP headers.
* The Spring Boot monolith uses Hibernate filters (`@FilterDef`) to automatically filter database operations by tenant ID, isolating database queries without rewriting queries.

#### Phase 3: Transition to Server Carts
* Create a `/api/v3/carts` endpoint in the backend.
* Update the client cart store [useCartStore.ts](file:///C:/Users/KRISH/OneDrive/Desktop/QR%20Based%20Order%20Management/frontend/src/store/useCartStore.ts) to push state changes to the cart API.
