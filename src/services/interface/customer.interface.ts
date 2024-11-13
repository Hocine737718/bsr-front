import type { OrderInterface } from "./order.interface";

export interface CustomerInterface {
    id: string;
    name: string;
    phone: string;
    address?: any;
    orders?: OrderInterface[];
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
}

export interface CreateCustomerInterface {
    name: string;
    phone: string;
    address?: any;
}

export interface UpdateCustomerInterface {
    name?: string;
    phone?: string;
    address?: any;
}