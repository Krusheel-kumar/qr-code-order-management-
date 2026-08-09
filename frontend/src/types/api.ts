export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string;
  story?: string;
  flavorNotes?: string[];
  mood?: string;
  rating?: number;
  calories?: number;
  flavorProfile?: string;
  pairings?: string[];
}

export interface UserProfile {
  id: string;
  username: string;
  email: string | '';
  phoneNumber: string;
  loyaltyPoints: number;
  role?: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: "PERCENTAGE" | "FLAT";
  value?: number;
  discountValue?: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  active: boolean;
}

export interface StoreSettings {
  storeActive: boolean;
  taxRate: number;
  deliveryFee: number;
  packingCharge: number;
  prepTime?: number;
}

export interface OrderItemPayload {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  subtotal: number;
  customizations?: string;
  customizationsList?: any[];
}

export interface OrderPayload {
  userId?: string;
  customerName?: string;
  customerPhone?: string;
  tableNumber?: string | null;
  storeId: string | null;
  orderType: "PICKUP" | "DINE_IN" | "DELIVERY";
  paymentReference: string;
  paymentStatus: string;
  pointsUsed: number;
  couponCode: string | null;
  items: OrderItemPayload[];
}
