import type { OrderItemInterface } from "./orderItem.interface"

export interface ProductInterface {
    id: string
    name: string
    description?: string
    price: number
    image?: string
    createdAt: Date
    updatedAt: Date
    deletedAt?: Date // Nullable field for soft deletion
    OrderItem?: OrderItemInterface[]
}

export interface CreateProductInterface {
    name: string
    description?: string
    price: number
    image?: string
}

export interface UpdateProductInterface {
    id?: string
    name?: string
    description?: string
    price?: number
    image?: string
}