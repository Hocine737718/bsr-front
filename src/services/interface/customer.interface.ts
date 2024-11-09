import type { OrderInterface } from "./order.interface";

export interface CustomerInterface {
    id: string;
    name: string;
    phone: string;
    address?: string;
    orders?: OrderInterface[];
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
}

export interface CreateCustomerInterface {
    name: string;
    phone: string;
    address?: string;
}

export interface UpdateCustomerInterface {
    name?: string;
    phone?: string;
    address?: string;
}