import { api } from "./api";
import type { CreateOrderInterface, CreateOrderItemsInterface, OrderInterface, UpdateOrderInterface } from "./interface/order.interface";

export async function createOrder(orderData: CreateOrderInterface): Promise<OrderInterface> {
    const response = await api.post<OrderInterface>("/orders/", orderData);
    return response as any;
}

export async function createOrderItems(id: string, itemsData: CreateOrderItemsInterface[]): Promise<OrderInterface> {
    const response = await api.post<OrderInterface>("/orders/" + id + "/items", itemsData);
    return response as any;
}

// Function to get all non-deleted orders
export async function getAllOrders(): Promise<OrderInterface[]> {
    const response = await api.get<OrderInterface[]>("/orders/");
    return response as any;
}

// Function to get a specific order by ID, with optional inclusion of items
export async function getOrderById(id: string): Promise<OrderInterface | null> {
    const response = await api.get<OrderInterface | null>("/orders/" + id);
    return response as any;
}

// Function to update an order by ID
export async function updateOrder(id: string, orderData: UpdateOrderInterface): Promise<OrderInterface> {
    const response = await api.patch<OrderInterface>("/orders/" + id, orderData);
    return response as any;
}

// Function to soft-delete an order by ID
export async function deleteOrder(id: string): Promise<Boolean> {
    const response = await api.delete<Boolean>("/orders/" + id);
    return response as any;
}
