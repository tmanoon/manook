import { ClothingItem } from "./clothingitem.model"

export interface Order {
    selectedItems: ClothingItem[],
    sum: number,
    orderNumber?: string,
    orderDetails?: {
        buyer: {
            fullName: string,
            email: string,
            address: string,
            phone: string,
        }
    }
    _id: string,
}
