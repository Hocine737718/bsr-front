import { api } from "./api";
import type { CreateProductInterface, ProductInterface, UpdateProductInterface } from "./interface/product.interface";

export async function createProduct(productData: CreateProductInterface): Promise<ProductInterface> {
    const response = await api.post<ProductInterface>("/products/", productData);
    return response as any;
}

export async function uploadProductImage(id: string, file: File) {
    let formData = new FormData();
    // @ts-ignore
    formData.append('file', file);
    await api.post(`/products/${id}/upload-image`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

// Function to get all non-deleted products
export async function getAllProducts(): Promise<ProductInterface[]> {
    const response = await api.get<ProductInterface[]>("/products/");
    return response as any;
}

// Function to get a specific product by ID, with optional inclusion of items
export async function getProductById(id: string): Promise<ProductInterface | null> {
    const response = await api.get<ProductInterface | null>("/products/" + id);
    return response as any;
}

// Function to update an product by ID
export async function updateProduct(id: string, productData: UpdateProductInterface): Promise<ProductInterface> {
    const response = await api.patch<ProductInterface>("/products/" + id, productData);
    return response as any;
}

// Function to soft-delete an product by ID
export async function deleteProduct(id: string): Promise<Boolean> {
    const response = await api.delete<Boolean>("/products/" + id);
    return response as any;
}
