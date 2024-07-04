import { Injectable, inject } from '@angular/core';
import { ClothingItem } from '../models/clothingitem.model';
import { BehaviorSubject, Observable, catchError, filter, from, map, retry, tap, throwError } from 'rxjs';
import { UtilService } from './util.service';
import { storageService } from './local.storage.service';
import { FilterBy } from '../models/filterby.model';
import { User } from '../models/user.model';
import { HttpErrorResponse } from '@angular/common/http';

const CLOTHES_DB = 'clothes_db'

@Injectable({
  providedIn: 'root'
})
export class ClothingItemService {

  private utilService = inject(UtilService)
  private _clothes$ = new BehaviorSubject<ClothingItem[]>([])
  public clothes$ = this._clothes$.asObservable()
  private _filterBy$ = new BehaviorSubject<FilterBy>({
    gender: '',
    style: [],
    type: '',
    name: '',
    maxPrice: 180
  })
  public filterBy$ = this._filterBy$.asObservable()

  constructor() {
    const storedClothes = this.utilService.loadFromStorage(CLOTHES_DB) as ClothingItem[] || null
    if (!storedClothes || storedClothes.length === 0) {
      this.utilService.setToStorage(CLOTHES_DB, this._createClothes())
    }
  }

  public loadClothes(): Observable<ClothingItem[]> {
    return from(storageService.query<ClothingItem>(CLOTHES_DB))
      .pipe(
        tap(clothes => {
          const filterBy = this._filterBy$.value
          console.log(filterBy)
          if (filterBy &&
            ((filterBy.gender && filterBy.gender !== 'unisex') ||
              filterBy.style.length ||
              filterBy.type.length ||
              filterBy.name ||
              filterBy.maxPrice < Infinity)) clothes = this._filter(clothes, filterBy)
          this._clothes$.next(this._sort(clothes))
        }),
        retry(1),
        catchError(this._handleError)
      )
  }

  public getClothingItemById(id: string): Observable<ClothingItem> {
    return from(storageService.get<ClothingItem>(CLOTHES_DB, id))
      .pipe(catchError(err => throwError(() => `Clothing item's id ${id} not found!`)))
  }

  public deleteClothingItem(id: string) {
    return from(storageService.remove(CLOTHES_DB, id))
      .pipe(
        tap(() => {
          let clothes = this._clothes$.value as ClothingItem[]
          clothes = clothes.filter(clothingItem => clothingItem._id !== id)
          this._clothes$.next(clothes)
        }),
        retry(1),
        catchError(this._handleError)
      )
  }

  public saveClothingItem(clothingItem: ClothingItem) {
    return clothingItem._id ? this._updateClothingItem(clothingItem) : this._addClothingItem(clothingItem)
  }

  public setFilter(filterBy: FilterBy) {
    this._filterBy$.next(filterBy)
    this.loadClothes().pipe(retry(1)).subscribe()
  }

  private _updateClothingItem(clothingItem: ClothingItem) {
    return from(storageService.put<ClothingItem>(CLOTHES_DB, clothingItem))
      .pipe(
        tap(updatedClothingItem => {
          const clothes = this._clothes$.value as ClothingItem[]
          this._clothes$.next(clothes.map(item => item._id === clothingItem._id ? updatedClothingItem : item))
        }),
        retry(1),
        catchError(this._handleError)
      )
  }

  private _addClothingItem(clothingItem: ClothingItem) {
    return from(storageService.post(CLOTHES_DB, clothingItem))
      .pipe(
        tap(newClothingItem => {
          const clothes = this._clothes$.value as ClothingItem[]
          this._clothes$.next([...clothes, newClothingItem])
        }),
        retry(1),
        catchError(this._handleError)
      )
  }

  private _sort(clothes: ClothingItem[]): ClothingItem[] {
    return clothes.sort((a, b) => {
      if (a.name.toLocaleLowerCase() < b.name.toLocaleLowerCase()) {
        return -1;
      }
      if (a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase()) {
        return 1;
      }
      return 0;
    })
  }

  private _filter(clothes: ClothingItem[], filterBy: FilterBy): ClothingItem[] {
    if (filterBy.name) filterBy.name = filterBy.name.toLocaleLowerCase()
    const filteredClothes = clothes.filter(clothingItem => {
      return clothingItem.name.toLocaleLowerCase().includes(filterBy.name) &&
        (!filterBy.gender || clothingItem.gender === filterBy.gender) &&
        (!filterBy.style.length || clothingItem.style.some(style => filterBy.style.includes(style))) &&
        (!filterBy.type|| filterBy.type === clothingItem.type) &&
        (filterBy.maxPrice === 180 || clothingItem.price <= filterBy.maxPrice)
    })
    return filteredClothes
  }

  public loadFavorites(user: Observable<User>): Observable<ClothingItem[]> {
    return user.pipe(
      map(user => user.wishlist)
    )
  }

  private _createClothes(): ClothingItem[] {
    const clothingList: ClothingItem[] = [
      {
        name: 'Classic Cotton T-Shirt',
        gender: 'men',
        price: 19.99,
        imgUrl: 'https://images.stockcake.com/public/5/e/6/5e6112b1-8c4c-4570-aae8-402ef1f8426d/simple-white-t-shirt-stockcake.jpg',
        stock: 10,
        style: ['casual', 'basics'],
        type: 'top',
        desc: 'A comfortable and versatile white cotton t-shirt, perfect for everyday wear.',
        _id: this.utilService.makeId()
      },
      {
        name: 'Flowy Floral Dress',
        gender: 'women',
        price: 49.99,
        imgUrl: ['https://images.stockcake.com/public/9/0/6/906a534a-d281-4e86-a532-b13fbde50881/vibrant-dress-twirl-stockcake.jpg',
          'https://images.stockcake.com/public/5/c/e/5ce8c8be-4849-4e0e-8cb6-d098bdab4fa1/elegant-sunset-twirl-stockcake.jpg'],
        stock: 5,
        style: ['romantic', 'summer'],
        type: 'dress',
        desc: 'A lightweight and airy dress featuring a beautiful floral print, ideal for warm weather.',
        _id: this.utilService.makeId()
      },
      {
        name: 'Ripped Denim Jeans',
        gender: 'unisex',
        price: 39.99,
        imgUrl: 'https://images.stockcake.com/public/f/a/3/fa35d8c6-3d15-4215-a14d-f89de815aef7/trendy-ripped-jeans-stockcake.jpg',
        stock: 15,
        style: ['casual', 'streetwear'],
        type: 'bottoms',
        desc: 'Stylish and edgy ripped denim jeans for a relaxed and trendy look.',
        _id: this.utilService.makeId()
      },
      {
        name: 'Warm Winter Jacket',
        gender: 'men',
        price: 99.99,
        imgUrl: ['https://images.stockcake.com/public/1/a/c/1aca8860-6fe2-4fd5-b666-ec933d05e256_large/winter-adventure-gear-stockcake.jpg',
          'https://images.stockcake.com/public/3/6/a/36ad0854-0134-4256-8e56-30e4b2748597/mountain-winter-fashion-stockcake.jpg'],
        stock: 8,
        style: ['winter', 'outerwear'],
        type: 'jacket',
        desc: 'A warm and insulated winter jacket perfect for cold weather conditions.',
        _id: this.utilService.makeId()
      },
      {
        name: 'Elegant Silk Blouse',
        gender: 'women',
        price: 79.99,
        imgUrl: ['https://images.stockcake.com/public/d/2/1/d210cb58-571b-4f61-9c65-664309220365/fashionable-urban-chic-stockcake.jpg',
          'https://images.stockcake.com/public/5/b/4/5b431679-3e42-45ba-9b35-a11463405cdf_large/fashionable-urban-chic-stockcake.jpg'],
        stock: 3,
        style: ['formal', 'workwear'],
        type: 'top',
        desc: 'A luxurious and sophisticated silk blouse for a polished and professional look.',
        _id: this.utilService.makeId()
      },
      {
        name: 'Sporty Tracksuit',
        gender: 'unisex',
        price: 54.99,
        imgUrl: ['https://images.stockcake.com/public/2/9/e/29ec4245-68a0-4839-96d1-d60c860648dc_large/urban-morning-jog-stockcake.jpg',
          'https://images.stockcake.com/public/6/8/5/6855c71b-bbee-4760-9f1a-f2e8f1cb877b_large/athlete-sprinting-intensely-stockcake.jpg'],
        stock: 12,
        style: ['sporty', 'activewear'],
        type: 'set',
        desc: 'A comfortable and stylish tracksuit for workouts or casual wear.',
        _id: this.utilService.makeId()
      },
      {
        name: 'Cozy Cashmere Sweater',
        gender: 'women',
        price: 149.99,
        imgUrl: ['https://images.stockcake.com/public/a/0/d/a0d911ed-6190-4517-afb4-6966a9179709_large/stylish-winter-fashion-stockcake.jpg',
          'https://images.stockcake.com/public/e/c/2/ec25c922-822e-4c04-9761-2c98241e83e7_large/elegant-wrist-watch-stockcake.jpg'],
        stock: 2,
        style: ['winter', 'luxurious'],
        type: 'sweater',
        desc: 'A soft and luxurious cashmere sweater for warmth and comfort in cooler weather.',
        _id: this.utilService.makeId()
      },
      {
        name: 'Lightweight Linen Shirt',
        gender: 'men',
        price: 24.99,
        imgUrl: 'https://images.stockcake.com/public/6/e/2/6e212e0f-e82b-4047-a747-9df91dcbd370_large/serene-meditation-garden-stockcake.jpg',
        stock: 7,
        style: ['summer', 'casual'],
        type: 'top',
        desc: 'A breathable and airy linen shirt for a comfortable and relaxed feel in hot weather.',
        _id: this.utilService.makeId()
      },
      {
        name: 'Functional Cargo Pants',
        gender: 'men',
        price: 45.99,
        imgUrl: ['https://images.stockcake.com/public/3/7/7/377fa064-6d79-4edc-9a40-448c2d6a6c6a/stylish-cargo-pants-stockcake.jpg',
          'https://images.stockcake.com/public/7/5/6/756b50e9-450d-44de-84ed-3589160ac896_large/casual-cargo-pants-stockcake.jpg',
          'https://images.stockcake.com/public/3/f/3/3f35d75a-922e-474e-8a4f-7abae5500249_large/cargo-pants-detail-stockcake.jpg'],
        stock: 10,
        style: ['casual', 'utility'],
        type: 'bottoms',
        desc: 'Practical and stylish cargo pants with multiple pockets for everyday wear.',
        _id: this.utilService.makeId()
      },
      {
        name: 'Hooded Sweatshirt',
        gender: 'unisex',
        price: 34.99,
        imgUrl: ['https://images.stockcake.com/public/0/7/d/07db86fa-d1ae-44e6-9cd4-784cd2f9fab2/black-hooded-sweatshirt-stockcake.jpg',
          'https://images.stockcake.com/public/1/c/e/1ce8c606-469a-42de-b791-b7ec3d2c96f0/sleek-black-hoodie-stockcake.jpg',
          'https://images.stockcake.com/public/d/f/6/df61f856-cdbe-4050-a4c4-ba0a54b9692b/casual-black-hoodie-stockcake.jpg'],
        stock: 18,
        style: ['casual', 'streetwear'],
        type: 'top',
        desc: 'A comfortable and versatile hooded sweatshirt for layering or wearing on its own.',
        _id: this.utilService.makeId()
      },
      {
        name: 'Elegant Cocktail Dress',
        gender: 'women',
        price: 89.99,
        imgUrl: ['https://images.stockcake.com/public/a/1/5/a1594536-ccba-494f-8576-82be46d7bb0d/elegant-evening-toast-stockcake.jpg',
          'https://images.stockcake.com/public/9/3/9/93941780-df32-4930-8c8c-b41e3a737d96/elegant-cocktail-evening-stockcake.jpg'],
        stock: 4,
        style: ['formal', 'eveningwear'],
        type: 'dress',
        desc: 'A stunning and sophisticated cocktail dress for a special occasion.',
        _id: this.utilService.makeId()
      },
      {
        name: 'Performance Running Tights',
        gender: 'unisex',
        price: 49.99,
        imgUrl: 'https://images.stockcake.com/public/8/5/d/85d9f11a-90da-459f-84f9-d10d78dbdbbc/dynamic-marathon-runners-stockcake.jpg',
        stock: 6,
        style: ['sporty', 'activewear'],
        type: 'bottoms',
        desc: 'Supportive and breathable running tights for optimal performance during workouts.',
        _id: this.utilService.makeId()
      },
      {
        name: 'Classic Leather Boots',
        gender: 'men',
        price: 179.99,
        imgUrl: ['https://images.stockcake.com/public/4/5/c/45ce6e55-3d22-4430-98a5-e4c737b73751/morning-run-session-stockcake.jpg',
          'https://images.stockcake.com/public/0/8/2/0822aebf-35e9-43f6-b970-7af9e9206c1b/graceful-ballet-pose-stockcake.jpg'],
        stock: 5,
        style: ['formal', 'winter'],
        type: 'shoes',
        desc: 'Durable and stylish leather boots for a timeless and elevated look.',
        _id: this.utilService.makeId()
      },
      {
        name: 'Trendy Denim Jacket',
        gender: 'women',
        price: 59.99,
        imgUrl: 'https://images.stockcake.com/public/6/6/0/660118f3-0a71-4102-a3a7-d385660b05fa/urban-fashion-posing-stockcake.jpg',
        stock: 9,
        style: ['casual', 'streetwear'],
        type: 'jacket',
        desc: 'A cool and versatile denim jacket for a relaxed and trendy look.',
        _id: this.utilService.makeId()
      },
      {
        name: 'Comfortable Pajamas',
        gender: 'unisex',
        price: 29.99,
        imgUrl: ['https://images.stockcake.com/public/3/2/9/3292131e-4d5a-4dcc-a325-c3bc8ff02069/festive-family-pajamas-stockcake.jpg',
          'https://images.stockcake.com/public/0/a/b/0abe4667-cdf0-46d5-a369-f1b6a1927c2e/festive-family-portrait-stockcake.jpg'],
        stock: 15,
        style: ['sleepwear', 'loungewear'],
        type: 'set',
        desc: 'A soft and cozy pajama set for ultimate comfort and relaxation.',
        _id: this.utilService.makeId()
      },
      {
        name: 'Functional Hiking Boots',
        gender: 'unisex',
        price: 84.99,
        imgUrl: 'https://images.stockcake.com/public/6/b/6/6b6e9f95-fc96-41f5-814e-a3a63ac02dd1/hiking-boots-outdoors-stockcake.jpg',
        stock: 7,
        style: ['utility', 'activewear'],
        type: 'shoes',
        desc: 'Durable and supportive hiking boots for outdoor adventures.',
        _id: this.utilService.makeId()
      },
      {
        name: 'Warm Puffer Jacket',
        gender: 'men',
        price: 69.99,
        imgUrl: ['https://images.stockcake.com/public/a/2/d/a2d1bb61-f07b-4687-8f90-ea8f385877d0_large/savoring-aroma-intently-stockcake.jpg',
          'https://images.stockcake.com/public/d/a/6/da68525e-ef77-4a6a-82eb-8c10eb106758_large/urban-digital-connection-stockcake.jpg'],
        stock: 11,
        style: ['winter', 'outerwear'],
        type: 'jacket',
        desc: 'A lightweight and warm puffer jacket for cold weather conditions.',
        _id: this.utilService.makeId()
      },
      {
        name: 'Flowy Maxi Dress',
        gender: 'women',
        price: 64.99,
        imgUrl: ['https://images.stockcake.com/public/5/1/8/518192e2-a732-456b-a76a-ef178c745c76/elegant-summer-fashion-stockcake.jpg',
          'https://images.stockcake.com/public/5/1/c/51cd964b-b137-4091-91be-a23761374943/bohemian-style-outfit-stockcake.jpg'],
        stock: 3,
        style: ['summer', 'hippie'],
        type: 'dress',
        desc: 'A beautiful and flowy maxi dress for a relaxed and elegant look in warm weather.',
        _id: this.utilService.makeId()
      }]

    return clothingList
  }

  private _handleError(err: HttpErrorResponse) {
    console.log('err:', err)
    return throwError(() => err)
  }

}


