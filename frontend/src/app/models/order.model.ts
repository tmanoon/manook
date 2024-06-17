import { ClothingItem } from "./clothingitem.model"
import { User } from "./user.model"

export interface Order {
    selectedItems: ClothingItem[],
    sum: number,
    buyer: User,
}