
export interface ClothingItem {
    name: string,
    gender: string,
    price: number,
    imgUrl: string | string[],
    stock: number,
    style: string[],
    type: string,
    desc: string,
    _id: string,
    quantity?: number
}
