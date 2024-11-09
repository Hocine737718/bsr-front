import { api } from "./api";
import type { CreateCustomerInterface, CustomerInterface, UpdateCustomerInterface } from "./interface/customer.interface";

export async function createCustomer(customerData: CreateCustomerInterface): Promise<CustomerInterface> {
    const response = await api.post<CustomerInterface>("/customers/", customerData);
    return response as any;
}

// Function to get all non-deleted customers
export async function getAllCustomers(): Promise<CustomerInterface[]> {
    const response = await api.get<CustomerInterface[]>("/customers/");
    return response as any;
}

// Function to get a specific customer by ID, with optional inclusion of items
export async function getCustomerById(id: string): Promise<CustomerInterface | null> {
    const response = await api.get<CustomerInterface | null>("/customers/" + id);
    return response as any;
}

// Function to update an customer by ID
export async function updateCustomer(id: string, customerData: UpdateCustomerInterface): Promise<CustomerInterface> {
    const response = await api.patch<CustomerInterface>("/customers/" + id, customerData);
    return response as any;
}

// Function to soft-delete an customer by ID
export async function deleteCustomer(id: string): Promise<Boolean> {
    const response = await api.delete<Boolean>("/customers/" + id);
    return response as any;
}
