export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Cart {
  userId: string;
  items: CartItem[];
  subtotal: number;
  updatedAt: Date;
}

export interface AddItemDto {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}
