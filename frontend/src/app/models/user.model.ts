import { ClothingItem } from "./clothingitem.model"

export interface User {
    fullName: string,
    sex: string,
    password: string,
    _id: string,
    coins: number,
    wishlist: ClothingItem[],
    email: string,
    isSubscribed: boolean,
    favoriteStyles?: []
}
