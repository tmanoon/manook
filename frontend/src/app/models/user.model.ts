import { ClothingItem } from "./clothingitem.model"
import { Style } from "./style.model"

export interface User {
    fullName: string,
    _id: string,
    wishlist: ClothingItem[],
    email: string,
    isSubscribed: boolean,
    favoriteStyles?: []
}
