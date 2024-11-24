import { Items } from "./models/Item";

export interface CartItem {
    item: Items;
    quantity: number;
}

export interface Cart {
    [key: string] : CartItem;
}

export interface ItemFormData {
    name: string,
    category: string,
    price: number,
    image: File | null,
}

export interface OrderData {
    code: number;
    status: number;
    total: number;

    cart: Cart;

    mercadoPagoId?: string;
    qrCode64?: string;
    qrCodeLink?: string;
}