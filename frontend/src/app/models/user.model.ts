import { ClothingItem } from "./clothingitem.model"
import { Order } from "./order.model"

export interface User {
    fullName: string,
    username: string,
    gender: string,
    isAdmin: boolean,
    password: string,
    _id: string,
    coins: number,
    wishlist: ClothingItem[],
    email: string,
    isSubscribed: boolean,
    favoriteStyles?: string[]
    orders: Order[]
    recentOrder?: Order
}
