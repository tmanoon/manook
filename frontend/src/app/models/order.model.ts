import { ClothingItem } from "./clothingitem.model"

export interface Order {
    selectedItems: ClothingItem[],
    sum: number,
    orderNumber?: string,
    _id: string
}