export interface UserInterface {
    id: string
    name: string
    createdAt: string
    updatedAt: string
    deletedAt?: string // Nullable field for soft deletion
}