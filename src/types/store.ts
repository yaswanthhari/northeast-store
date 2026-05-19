export interface Product {
  id: string;
  name: string;
  price: number;
  discountPrice?: number | null;
  state: string;
  image: string;
  description?: string | null;
  categoryId?: string;
  isNew?: boolean;
  isBestseller?: boolean;
  isPopular?: boolean;
  isMostViewed?: boolean;
  stock?: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export type AddToCartProduct = Pick<Product, 'id' | 'name' | 'price' | 'image'>;

export interface OrderItem {
  id: string;
  orderId?: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  role: string;
  lastActive?: Date | string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface Order {
  id: string;
  userId: string;
  user?: Pick<User, 'id' | 'email' | 'name' | 'role'>;
  total: number;
  status: string;
  shippingAddress: string | null;
  city: string | null;
  postalCode: string | null;
  createdAt: Date | string;
  updatedAt?: Date | string;
  items: OrderItem[];
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface CategoryWithProductCount extends Category {
  _count: {
    products: number;
  };
}
