import type { CustomerInterface } from "./customer.interface";
import type { OrderItemInterface } from "./orderItem.interface";
export interface OrderInterface {
    id: string;
    customerId: string;
    total: number;
    customer?: CustomerInterface;
    observation?: string; // Optional field
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null; // Nullable field for soft deletion
    items?: OrderItemInterface[];
}
export interface CreateOrderInterface {
    customerId: string;
    total: number;
    observation?: string;
}
export interface UpdateOrderInterface {
    customerId?: string;
    total?: number;
    observation?: string;
}
export interface CreateOrderItemsInterface {
    order_id: string;
    product_id: string;
    quantity: number;
    price: number;
    observation?: string;
}
