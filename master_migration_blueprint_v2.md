# Enterprise Architecture Blueprint (Version 2.0)
## Multi-Tenant, Multi-Brand SaaS Restaurant Customization Platform
**Prepared by**: Chief Technology Officer & Principal Systems Architect  
**Status**: Architecture Freeze (Planning Phase - No Code Modified)  
**Target Scale**: 500+ Franchise Locations, Multi-Brand Portfolio (Drinks, Food, Combos), Native Mobile Apps (iOS/Android), and Web Apps  
**Date**: July 7, 2026

---

## 1. CTO Critical Evaluation of Version 1.0 (Technical Debt & Bottlenecks)

While the Version 1.0 blueprint resolved the immediate hardcoded limitations of the bubble tea toppings system, it possesses several scalability bottlenecks, missing abstractions, and design limitations that prevent it from scaling to an enterprise-grade SaaS platform:

### 1.1 Lack of Tenant and Brand Isolation (The Monolithic Catalog)
* **The Issue**: Version 1.0 assumes a single unified product catalog. If we deploy this for multiple distinct food brands (e.g., a bubble tea brand, a pizza brand, and a burger brand), their product databases, user logins, and settings are co-mingled.
* **CTO Assessment**: A multi-tenant architecture is mandatory. The database must isolate brands and tenants, preventing one franchise's database queries from leaking into another's.

### 1.2 Flat Pricing and Global Store Assumptions
* **The Issue**: A single global price is configured on products and addons.
* **CTO Assessment**: Franchisees operate on localized pricing. An "Authentic Milk Tea" at an airport terminal location is priced higher than one at a suburban mall. The system must support **Store-Level Pricing and Availability Overrides** for menu items, customizations, and taxes.

### 1.3 Restricted Customizer Logic (The Bubble Tea Toppings Bias)
* **The Issue**: The Customizer schema is optimized only for tea toppings. It cannot represent complex customization flows for food items (e.g., building a hamburger with customizable patties, sauces, cheese options, and extra toppings; or configuring a half-and-half pizza).
* **CTO Assessment**: We need a generic **Customization Rule Engine** that defines selection types (Single, Multi, Quantity Increment), free options limits (e.g., first 3 sauces are free, extra sauces are ₹15), and conditional/nested option groups (e.g., only show "Patty Temperature" options if a beef patty is selected).

### 1.4 Rigid, Monolithic Loyalty Engine
* **The Issue**: Loyalty calculations are hardcoded directly into the monolithic [OrderService.java](file:///C:/Users/KRISH/OneDrive/Desktop/QR%20Based%20Order%20Management/backend/src/main/java/com/popobob/service/OrderService.java#L96-L111) with fixed multipliers.
* **CTO Assessment**: Different brands and stores require custom loyalty logic. Loyalty must be extracted into a database-driven Rules Engine (`loyalty_rules`), allowing brands to configure reward parameters dynamically.

### 1.5 Client-side State Persistence Bottlenecks
* **The Issue**: The cart uses browser `localStorage` persistent state ([useCartStore.ts](file:///C:/Users/KRISH/OneDrive/Desktop/QR%20Based%20Order%20Management/frontend/src/store/useCartStore.ts)).
* **CTO Assessment**: Browser persistence does not work for native mobile apps (React Native/iOS/Android) or cross-device user sessions (adding items on web, checkout on mobile app). We must transition to a **Server-Persisted Cart API** with tokenized syncing.

---

## 2. Version 2.0 Database Schema Design (Multi-Tenant SaaS Model)

To support 500+ locations, multiple brands, and variable pricing, the PostgreSQL database schema will be updated to implement multi-tenancy and store overrides.

```
                  ┌──────────────┐
                  │   tenants    │
                  └──────┬───────┘
                         │ 1
                         │
                         ▼ N
                  ┌──────────────┐
                  │    brands    │
                  └──────┬───────┘
                         │ 1
                         │
         ┌───────────────┴───────────────┐
         │ 1                             │ 1
         ▼ N                             ▼ N
  ┌──────────────┐                ┌──────────────┐
  │    stores    │                │  menu_items  │
  └──────┬───────┘                └──────┬───────┘
         │ 1                             │ 1
         │                               │
         └───────────────┬───────────────┘
                         │
                         ▼ N
             ┌────────────────────────┐
             │   store_menu_items     │
             │   (Local Overrides)    │
             └────────────────────────┘
```

### 2.1 Schema Definition (DDL)
```sql
-- 1. Tenant and Brand Isolation
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE brands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    logo_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Store Registry (Franchise Level)
CREATE TABLE stores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    timezone VARCHAR(50) DEFAULT 'UTC',
    address TEXT NOT NULL,
    latitude DECIMAL(9, 6),
    longitude DECIMAL(9, 6),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Dynamic Customization Rule Engine (Abstract Customizer Groups)
CREATE TABLE customization_groups (
    id VARCHAR(50) PRIMARY KEY,
    brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    min_selections INT DEFAULT 0,
    max_selections INT DEFAULT 1,
    free_selections_limit INT DEFAULT 0,
    allow_multiples BOOLEAN DEFAULT FALSE, -- e.g. "Double Cheese", "Triple Cheese"
    is_required BOOLEAN DEFAULT FALSE
);

CREATE TABLE customization_options (
    id VARCHAR(50) PRIMARY KEY,
    group_id VARCHAR(50) NOT NULL REFERENCES customization_groups(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    default_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    is_available BOOLEAN DEFAULT TRUE
);

-- 4. Menu Items Catalog (Global Brand Catalog)
CREATE TABLE menu_items (
    id VARCHAR(50) PRIMARY KEY,
    brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    default_price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(255),
    is_available BOOLEAN DEFAULT TRUE
);

-- 5. Link Menu Items to Customization Groups
CREATE TABLE menu_item_customizations (
    menu_item_id VARCHAR(50) NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
    customization_group_id VARCHAR(50) NOT NULL REFERENCES customization_groups(id) ON DELETE CASCADE,
    display_order INT DEFAULT 0,
    PRIMARY KEY (menu_item_id, customization_group_id)
);

-- 6. Store-Level Price and Availability Overrides (Airport vs Suburban Mall)
CREATE TABLE store_menu_items (
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    menu_item_id VARCHAR(50) NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
    price_override DECIMAL(10, 2), -- Null inherits brand default
    is_available BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (store_id, menu_item_id)
);

CREATE TABLE store_customization_options (
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    option_id VARCHAR(50) NOT NULL REFERENCES customization_options(id) ON DELETE CASCADE,
    price_override DECIMAL(10, 2), -- Null inherits default
    is_available BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (store_id, option_id)
);
```

---

## 3. Customization Rule Engine Specifications

Customization is represented dynamically using a JSON validation schema on the backend. This enables checking complex selection parameters (e.g. quantity limits, multiple selection charges) for any food brand.

```
       [ Customizer JSON Configuration ]
                      │
                      ├─► Selection Type: "quantity_increment" (e.g., 2x Cheese)
                      ├─► Free Choices Limit: 3 (4th choice onwards = charge)
                      ├─► Required Selection: true
                      └─► Selection Bounds: Min 1, Max 5
```

### JSON Schema Validation Example for Order Items
When an order is submitted to `/api/v2/orders`, the backend validates each item customizations map using the following JSON Schema structure:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "MenuItemCustomization",
  "type": "object",
  "properties": {
    "selections": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "optionId": { "type": "string" },
          "quantity": { "type": "integer", "minimum": 1, "maximum": 5 },
          "calculatedPrice": { "type": "number" }
        },
        "required": ["optionId", "quantity", "calculatedPrice"]
      }
    }
  },
  "required": ["selections"]
}
```

### Backend Recalculation Engine Logic
The [OrderService.java](file:///C:/Users/KRISH/OneDrive/Desktop/QR%20Based%20Order%20Management/backend/src/main/java/com/popobob/service/OrderService.java) is rewritten to implement this loop during validation:

$$\text{Final Item Price} = \text{Base Price}_{\text{override}} + \sum \max\left(0, \text{Quantity} - \text{Free Limit}\right) \times \text{Option Price}_{\text{override}}$$

---

## 4. API Gateway, Versioning & Cross-Tenant Routing

To support multiple mobile apps and thousands of concurrent transactions, an API Gateway (such as Spring Cloud Gateway or AWS API Gateway) is placed in front of the backend microservices.

### 4.1 Route Versioning
* All legacy clients route to `/api/v1/**` (falling back to legacy flat toppings mapping).
* Dynamic, multi-tenant clients route to `/api/v2/**`.

### 4.2 Headers for Tenant and Store Scoping
Clients must submit scoping details via headers for every request:
* `X-Tenant-ID`: Scopes database queries to the tenant schema (SaaS isolation).
* `X-Brand-ID`: Determines styling parameters and customizer engines.
* `X-Store-ID`: Fetches localized store pricing overrides.

### 4.3 Structured Checkout Order Payload (v2 JSON)
```json
{
  "tenantId": "e2ba34dc-58a5-4bfb-bd5e-49b80327f3c1",
  "brandId": "f9ad282a-a9d5-451d-b8e7-ff45b98a34bc",
  "storeId": "a1f9d8a3-c9a5-481d-bf22-f98b251ad983",
  "customerName": "Alice Smith",
  "customerPhone": "9876543210",
  "orderType": "DINE_IN",
  "tableNumber": "12",
  "paymentReference": "pay_9a7d3b2",
  "items": [
    {
      "productId": "p-burger-double",
      "quantity": 1,
      "customizations": [
        {
          "groupId": "cg-burger-patty",
          "selections": [
            { "optionId": "co-patty-well-done", "quantity": 1 }
          ]
        },
        {
          "groupId": "cg-extra-sauces",
          "selections": [
            { "optionId": "co-sauce-mayo", "quantity": 2 },
            { "optionId": "co-sauce-bbq", "quantity": 2 } 
          ]
        }
      ]
    }
  ]
}
```

---

## 5. Multi-Tenant Zustand Store Architecture

The local state is structured to prevent brand and tenant data corruption on the client-side. The cart structure is scoped to a specific store context.

### 5.1 Store Cart Isolation
The Zustand Cart Store ([useCartStore.ts](file:///C:/Users/KRISH/OneDrive/Desktop/QR%20Based%20Order%20Management/frontend/src/store/useCartStore.ts)) resets if a user scans a QR code belonging to a different store or brand, preventing menu leaks:

```typescript
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      storeId: null,
      brandId: null,
      
      setStoreContext: (newStoreId: string, newBrandId: string) => {
        const currentStore = get().storeId;
        if (currentStore && currentStore !== newStoreId) {
          // Force reset cart if transitioning across store locations
          set({ items: [], storeId: newStoreId, brandId: newBrandId });
        } else {
          set({ storeId: newStoreId, brandId: newBrandId });
        }
      }
    }),
    { name: 'popobob-multi-tenant-cart' }
  )
);
```

### 5.2 Server-Synced Carts for Mobile App Support
To support native apps and prevent loss of shopping items, when `VITE_USER_AUTHENTICATED=true`, Zustand synchronizes the cart store to the backend database `/api/v2/carts/sync` using debounce timers:

```typescript
const debounceSyncCart = debounce(async (cartItems) => {
  await axios.post(`${API_URL}/carts/sync`, { items: cartItems });
}, 1000);
```

---

## 6. Phased Rollout & Feature Flags for 500 Stores

Migrating 500 locations simultaneously poses high operational risks. We will deploy the updates in geographical cohorts.

### 6.1 Canary Release Cohorts
* **Cohort A (Pilot)**: 5 company-owned locations. Used for testing edge cases.
* **Cohort B (Regional Expansion)**: 50 franchise locations in a single city.
* **Cohort C (General Availability)**: Rest of the 500 locations.

### 6.2 Tenant Feature Flag Configuration
We will use LaunchDarkly or an internal feature flag service to evaluate features by store ID or tenant ID:
* `USE_DYNAMIC_ADDONS`: Enabled per `store_id`.
* `ENFORCE_RESTRICTED_CUSTOMIZATION`: Enables min/max quantity limits for burger/pizza brands.

---

## 7. Performance & High-Availability Scaling Strategy

Scaling to 500 locations translates to over **15,000 active concurrent connections** during peak lunch hours. The monolithic architecture will face severe database connection pooling and CPU bottlenecks.

### 7.1 Redis Caching Architecture
* **Menu Cache**: Store menu catalogs, product details, and store overrides in Redis. Cache invalidation is triggered only when the admin publishes menu changes.
* **Caching Strategy**: **Cache-Aside**. The customer app reads the menu from Redis. Query load on the database drops by **90%**.
* **Key Structure**: `brand:{brandId}:store:{storeId}:menu`

### 7.2 Asynchronous AI Embeddings & Vector Storage
* **The Issue**: Building Gemini AI context embedding vectors during database seeding blocks transaction threads.
* **CTO Resolution**: 
  * Extract embedding generations to an asynchronous background worker using a message broker (RabbitMQ or Kafka).
  * Use **pgvector** index structures (HNSW - Hierarchical Navigable Small World) to enable sub-millisecond similarity searches:
    ```sql
    CREATE INDEX ON knowledge_base USING hnsw (embedding vector_cosine_ops);
    ```

---

## 8. Regression Testing & Enterprise Load-Testing Plan

### 8.1 Automated Load Testing Scenario (using k6)
A load testing script simulates peak order volume:
```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 5000 },  // Ramp up to 5000 concurrent users
    { duration: '5m', target: 5000 },  // Maintain peak load
    { duration: '2m', target: 0 },     // Cool down
  ],
};

export default function () {
  const headers = { 'Content-Type': 'application/json', 'X-Store-ID': 'store-123' };
  const res = http.post('http://localhost:8080/api/v2/orders', JSON.stringify({ /* payload */ }), { headers });
  check(res, { 'status is 200': (r) => r.status === 200 });
  sleep(1);
}
```

### 8.2 Testing Checklist
* [ ] **Multibrand Isolation Test**: Query `/api/v2/menu/products` using Brand A's key (verify Brand B's products are not leaked).
* [ ] **Airport Pricing Override Test**: Place an order for Store A (Airport) and Store B (Mall) for the same product (verify that total pricing calculates using store-specific overrides).
* [ ] **Out of Stock Topping Test**: Set "Cheese Foam" availability to false in Store A (verify Store B continues to allow selecting it).

---

## 9. Final Migration Roadmap

```
[Phase 0: Architecture Freeze]
       │
       ▼
[Phase 1: DB Migration (Multi-Tenant Schema)]
       │
       ▼
[Phase 2: Backend REST v2 Versioned API Endpoints]
       │
       ▼
[Phase 3: Redis Menu Cache & Asynchronous pgvector Indexing]
       │
       ▼
[Phase 4: Admin Panel Migration (Addon/Coupon APIs Connected)]
       │
       ▼
[Phase 5: Customer App Customizer UI Refactoring]
       │
       ▼
[Phase 6: Pilot Release - Cohort A (5 Stores)]
       │
       ▼
[Phase 7: Regional Expansion - Cohort B (50 Stores)]
       │
       ▼
[Phase 8: General Availability - Cohort C (500 Stores)]
```

### Rollback Strategy
If order processing latency spikes by more than **200ms** at any point during rollout:
1. Revert the DNS route or API gateway routing back to `/api/v1/`.
2. Disable the feature flags (`USE_DYNAMIC_ADDONS=false`).
3. Order processing will immediately fall back to the legacy flat toppings configuration.
