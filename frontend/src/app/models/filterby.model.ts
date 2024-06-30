export interface FilterBy {
    gender: string,
    style: string[],
    type: string,
    name: string,
    priceRange: { min: number, max: number }
}
