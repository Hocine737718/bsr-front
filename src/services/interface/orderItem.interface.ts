import type { Size } from "@/shared/utils";
export interface OrderItemInterface {
    id: string;
    order_id: string;
    product_id: string;
    quantity: number;
    price: number
    observation?: string;
    item_total: number;
    size: Size;
}
