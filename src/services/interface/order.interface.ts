import type { Size } from "@/shared/utils";
import type { CustomerInterface } from "./customer.interface";
import type { OrderItemInterface } from "./orderItem.interface";
export interface OrderInterface {
    id: string;
    customerId: string;
    total: number;
    delivery_cost?: number;
    is_to_office?: boolean;
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
    delivery_cost?: number;
    is_to_office?: boolean;
    items?: CreateOrderItemsInterface[]
}
export interface UpdateOrderInterface {
    customerId?: string;
    total?: number;
    observation?: string;
    delivery_cost?: number;
    is_to_office?: boolean;
    items?: CreateOrderItemsInterface[];
}
export interface CreateOrderItemsInterface {
    order_id: string;
    product_id: string;
    quantity: number;
    price: number;
    observation?: string;
    size: Size;
}
