export interface Product {
  id: string;
  brand: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  images: string[];
  colors: { name: string; hex: string }[];
  sizes: string[];
  sizeAdvice?: string;
  fitRecommendation?: string;
  description: string;
  rating: number;
  reviewCount: number;
  deliveryEstimate: string;
  isNew?: boolean;
  isMostKept?: boolean;
  isRarelyReturned?: boolean;
  tag?: string;
}

export interface CartItem {
  product: Product;
  selectedSize: string;
  selectedColor: { name: string; hex: string };
  quantity: number;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  fitFeedback?: 'Runs Small' | 'True to Size' | 'Runs Large';
  verifiedPurchase?: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  avatarInitials: string;
  activeOrder?: {
    orderId: string;
    itemCount: number;
    deliveryDate: string;
    status: string;
  };
  address: {
    label: string;
    street: string;
    postalCode: string;
  };
  paymentMethod: {
    brand: string;
    last4: string;
  };
}

