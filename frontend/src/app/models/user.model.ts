import { ClothingItem } from "./clothingitem.model"

export interface User {
    fullName: string,
    _id: string,
    wishlist: ClothingItem[],
    email: string,
    isSubscribed: boolean,
    favoriteStyles?: []
}
