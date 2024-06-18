import { Injectable } from '@angular/core';
import { ClothingItem } from '../models/clothingitem.model';
import { BehaviorSubject } from 'rxjs';
import { utilService } from './util.service';

const CLOTHES_DB = 'clothes_db'

@Injectable({
  providedIn: 'root'
})
export class ClothingItemService {

  private _clothesList$ = new BehaviorSubject<ClothingItem[] | null>(null)
  public clothesList$ = this._clothesList$.asObservable()

  constructor() {
    const storedClothesList = utilService.loadFromStorage(CLOTHES_DB) as ClothingItem[] || null
    if (!storedClothesList || storedClothesList.length === 0) {
      utilService.setToStorage(CLOTHES_DB, this._createClothesList())
    }
  }

  private _createClothesList() : ClothingItem[] {
    const clothingList: ClothingItem[] = [
      {
        name: 'Classic Cotton T-Shirt',
        gender: 'male',
        price: 19.99,
        imgUrl: 'https://example.com/images/clothing/t-shirt-white.jpg',
        quantity: 10,
        style: ['casual', 'basics'],
        type: 'top',
        desc: 'A comfortable and versatile white cotton t-shirt, perfect for everyday wear.'
      },
      {
        name: 'Flowy Floral Dress',
        gender: 'female',
        price: 49.99,
        imgUrl: ['https://example.com/images/clothing/dress-floral-blue.jpg', 'https://example.com/images/clothing/dress-floral-red.jpg'],
        quantity: 5,
        style: ['romantic', 'summer'],
        type: 'dress',
        desc: 'A lightweight and airy dress featuring a beautiful floral print, ideal for warm weather.'
      },
      {
        name: 'Ripped Denim Jeans',
        gender: 'unisex',
        price: 39.99,
        imgUrl: 'https://example.com/images/clothing/jeans-ripped-blue.jpg',
        quantity: 15,
        style: ['casual', 'streetwear'],
        type: 'bottoms',
        desc: 'Stylish and edgy ripped denim jeans for a relaxed and trendy look.'
      },
      {
        name: 'Warm Winter Jacket',
        gender: 'male',
        price: 99.99,
        imgUrl: 'https://example.com/images/clothing/jacket-winter-black.jpg',
        quantity: 8,
        style: ['winter', 'outerwear'],
        type: 'jacket',
        desc: 'A warm and insulated winter jacket perfect for cold weather conditions.'
      },
      {
        name: 'Elegant Silk Blouse',
        gender: 'female',
        price: 79.99,
        imgUrl: 'https://example.com/images/clothing/blouse-silk-white.jpg',
        quantity: 3,
        style: ['formal', 'workwear'],
        type: 'top',
        desc: 'A luxurious and sophisticated silk blouse for a polished and professional look.'
      },
      {
        name: 'Sporty Tracksuit',
        gender: 'unisex',
        price: 54.99,
        imgUrl: ['https://example.com/images/clothing/tracksuit-grey.jpg', 'https://example.com/images/clothing/tracksuit-black.jpg'],
        quantity: 12,
        style: ['athleisure', 'sporty'],
        type: 'set',
        desc: 'A comfortable and stylish tracksuit for workouts or casual wear.'
      },
      {
        name: 'Cozy Cashmere Sweater',
        gender: 'female',
        price: 149.99,
        imgUrl: 'https://example.com/images/clothing/sweater-cashmere-beige.jpg',
        quantity: 2,
        style: ['winter', 'luxury'],
        type: 'sweater',
        desc: 'A soft and luxurious cashmere sweater for warmth and comfort in cooler weather.'
      },
      {
        name: 'Lightweight Linen Shirt',
        gender: 'male',
        price: 24.99,
        imgUrl: 'https://example.com/images/clothing/shirt-linen-white.jpg',
        quantity: 7,
        style: ['summer', 'casual'],
        type: 'top',
        desc: 'A breathable and airy linen shirt for a comfortable and relaxed feel in hot weather.'
      },
      {
        name: 'Functional Cargo Pants',
        gender: 'male',
        price: 45.99,
        imgUrl: 'https://example.com/images/clothing/pants-cargo-khaki.jpg',
        quantity: 10,
        style: ['casual', 'utility'],
        type: 'bottoms',
        desc: 'Practical and stylish cargo pants with multiple pockets for everyday wear.'
      },
      {
        name: 'Hooded Sweatshirt',
        gender: 'unisex',
        price: 34.99,
        imgUrl: ['https://example.com/images/clothing/sweatshirt-hoodie-grey.jpg', 'https://example.com/images/clothing/sweatshirt-hoodie-red.jpg'],
        quantity: 18,
        style: ['casual', 'streetwear'],
        type: 'top',
        desc: 'A comfortable and versatile hooded sweatshirt for layering or wearing on its own.'
      },
      {
        name: 'Elegant Cocktail Dress',
        gender: 'female',
        price: 89.99,
        imgUrl: 'https://example.com/images/clothing/dress-cocktail-black.jpg',
        quantity: 4,
        style: ['formal', 'eveningwear'],
        type: 'dress',
        desc: 'A stunning and sophisticated cocktail dress for a special occasion.'
      },
      {
        name: 'Performance Running Tights',
        gender: 'unisex',
        price: 49.99,
        imgUrl: 'https://example.com/images/clothing/tights-running-black.jpg',
        quantity: 6,
        style: ['athletic', 'activewear'],
        type: 'bottoms',
        desc: 'Supportive and breathable running tights for optimal performance during workouts.'
      },
      {
        name: 'Classic Leather Boots',
        gender: 'male',
        price: 179.99,
        imgUrl: 'https://example.com/images/clothing/boots-leather-brown.jpg',
        quantity: 5,
        style: ['formal', 'winter'],
        type: 'shoes',
        desc: 'Durable and stylish leather boots for a timeless and elevated look.'
      },
      {
        name: 'Trendy Denim Jacket',
        gender: 'female',
        price: 59.99,
        imgUrl: 'https://example.com/images/clothing/jacket-denim-lightwash.jpg',
        quantity: 9,
        style: ['casual', 'streetwear'],
        type: 'jacket',
        desc: 'A cool and versatile denim jacket for a relaxed and trendy look.'
      },
      {
        name: 'Comfortable Pajamas',
        gender: 'unisex',
        price: 29.99,
        imgUrl: ['https://example.com/images/clothing/pajamas-striped-blue.jpg', 'https://example.com/images/clothing/pajamas-floral-pink.jpg'],
        quantity: 15,
        style: ['sleepwear', 'loungewear'],
        type: 'set',
        desc: 'A soft and cozy pajama set for ultimate comfort and relaxation.'
      },
      {
        name: 'Functional Hiking Boots',
        gender: 'unisex',
        price: 84.99,
        imgUrl: 'https://example.com/images/clothing/boots-hiking-brown.jpg',
        quantity: 7,
        style: ['outdoor', 'activewear'],
        type: 'shoes',
        desc: 'Durable and supportive hiking boots for outdoor adventures.'
      },
      {
        name: 'Warm Puffer Jacket',
        gender: 'male',
        price: 69.99,
        imgUrl: 'https://example.com/images/clothing/jacket-puffer-black.jpg',
        quantity: 11,
        style: ['winter', 'outerwear'],
        type: 'jacket',
        desc: 'A lightweight and warm puffer jacket for cold weather conditions.'
      },
      {
        name: 'Flowy Maxi Dress',
        gender: 'female',
        price: 64.99,
        imgUrl: 'https://example.com/images/clothing/dress-maxi-floral.jpg',
        quantity: 3,
        style: ['summer', 'bohemian'],
        type: 'dress',
        desc: 'A beautiful and flowy maxi dress for a relaxed and elegant look in warm weather.'
      }]
      
      return clothingList
  }
  
}


