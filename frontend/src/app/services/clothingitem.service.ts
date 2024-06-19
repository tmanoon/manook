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

  private _clothes$ = new BehaviorSubject<ClothingItem[] | null>(null)
  public clothes$ = this._clothes$.asObservable()
  private _filterBy$ = new BehaviorSubject<FilterBy>({
    gender: '',
    style: [],
    type: [],
    name: '',
    priceRange: { min: 0, max: Infinity }
  })
  public filterBy$ = this._filterBy$.asObservable()

  constructor() {
    const storedClothes = this.utilService.loadFromStorage(CLOTHES_DB) as ClothingItem[] || null
    if (!storedClothes || storedClothes.length === 0) {
      this.utilService.setToStorage(CLOTHES_DB, this._createClothes())
    }
  }

  public loadClothes() {
    return from(storageService.query<ClothingItem>(CLOTHES_DB))
      .pipe(
        tap(clothes => {
          const filterBy = this._filterBy$.value
          if (filterBy &&
            (filterBy.gender ||
              filterBy.style ||
              filterBy.type ||
              filterBy.name ||
              filterBy.priceRange.min ||
              filterBy.priceRange.max)) clothes = this._filter(clothes, filterBy)
          this._clothes$.next(this._sort(clothes))
        }),
        retry(1),
        catchError(this._handleError)
      )
  }

  public getClothingItemById(id: string): Observable<ClothingItem> {
    return from(storageService.get<ClothingItem>(CLOTHES_DB, id))
      .pipe(catchError(err => throwError(() => `Contact id ${id} not found!`)))
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

  public getEmptyContact() {
    return {
      name: '',
      email: '',
      phone: ''
    }
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
          this._clothes$.next(clothes.map(clothingItem => clothingItem._id === clothingItem._id ? updatedClothingItem : clothingItem))
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

  private _filter(clothes: ClothingItem[], filterBy: FilterBy) {
    filterBy.name = filterBy.name.toLocaleLowerCase()
    return clothes.filter(clothingItem => {
      return clothingItem.name.toLocaleLowerCase().includes(filterBy.name) &&
        clothingItem.gender.toLocaleLowerCase().includes(filterBy.gender) &&
        clothingItem.style.some(style => filterBy.style.includes(style)) &&
        filterBy.type.includes(clothingItem.type) &&
        (clothingItem.price >= filterBy.priceRange.min && clothingItem.price <= filterBy.priceRange.max)
    })
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
        gender: 'male',
        price: 19.99,
        imgUrl: 'https://example.com/images/clothing/t-shirt-white.jpg',
        quantity: 10,
        style: ['casual', 'basics'],
        type: 'top',
        desc: 'A comfortable and versatile white cotton t-shirt, perfect for everyday wear.',
        _id: this.utilService.makeId()
      },
      {
        name: 'Flowy Floral Dress',
        gender: 'female',
        price: 49.99,
        imgUrl: ['https://example.com/images/clothing/dress-floral-blue.jpg', 'https://example.com/images/clothing/dress-floral-red.jpg'],
        quantity: 5,
        style: ['romantic', 'summer'],
        type: 'dress',
        desc: 'A lightweight and airy dress featuring a beautiful floral print, ideal for warm weather.',
        _id: this.utilService.makeId()
      },
      {
        name: 'Ripped Denim Jeans',
        gender: 'unisex',
        price: 39.99,
        imgUrl: 'https://example.com/images/clothing/jeans-ripped-blue.jpg',
        quantity: 15,
        style: ['casual', 'streetwear'],
        type: 'bottoms',
        desc: 'Stylish and edgy ripped denim jeans for a relaxed and trendy look.',
        _id: this.utilService.makeId()
      },
      {
        name: 'Warm Winter Jacket',
        gender: 'male',
        price: 99.99,
        imgUrl: 'https://example.com/images/clothing/jacket-winter-black.jpg',
        quantity: 8,
        style: ['winter', 'outerwear'],
        type: 'jacket',
        desc: 'A warm and insulated winter jacket perfect for cold weather conditions.',
        _id: this.utilService.makeId()
      },
      {
        name: 'Elegant Silk Blouse',
        gender: 'female',
        price: 79.99,
        imgUrl: 'https://example.com/images/clothing/blouse-silk-white.jpg',
        quantity: 3,
        style: ['formal', 'workwear'],
        type: 'top',
        desc: 'A luxurious and sophisticated silk blouse for a polished and professional look.',
        _id: this.utilService.makeId()
      },
      {
        name: 'Sporty Tracksuit',
        gender: 'unisex',
        price: 54.99,
        imgUrl: ['https://example.com/images/clothing/tracksuit-grey.jpg', 'https://example.com/images/clothing/tracksuit-black.jpg'],
        quantity: 12,
        style: ['athleisure', 'sporty'],
        type: 'set',
        desc: 'A comfortable and stylish tracksuit for workouts or casual wear.',
        _id: this.utilService.makeId()
      },
      {
        name: 'Cozy Cashmere Sweater',
        gender: 'female',
        price: 149.99,
        imgUrl: 'https://example.com/images/clothing/sweater-cashmere-beige.jpg',
        quantity: 2,
        style: ['winter', 'luxury'],
        type: 'sweater',
        desc: 'A soft and luxurious cashmere sweater for warmth and comfort in cooler weather.',
        _id: this.utilService.makeId()
      },
      {
        name: 'Lightweight Linen Shirt',
        gender: 'male',
        price: 24.99,
        imgUrl: 'https://example.com/images/clothing/shirt-linen-white.jpg',
        quantity: 7,
        style: ['summer', 'casual'],
        type: 'top',
        desc: 'A breathable and airy linen shirt for a comfortable and relaxed feel in hot weather.',
        _id: this.utilService.makeId()
      },
      {
        name: 'Functional Cargo Pants',
        gender: 'male',
        price: 45.99,
        imgUrl: 'https://example.com/images/clothing/pants-cargo-khaki.jpg',
        quantity: 10,
        style: ['casual', 'utility'],
        type: 'bottoms',
        desc: 'Practical and stylish cargo pants with multiple pockets for everyday wear.',
        _id: this.utilService.makeId()
      },
      {
        name: 'Hooded Sweatshirt',
        gender: 'unisex',
        price: 34.99,
        imgUrl: ['https://example.com/images/clothing/sweatshirt-hoodie-grey.jpg', 'https://example.com/images/clothing/sweatshirt-hoodie-red.jpg'],
        quantity: 18,
        style: ['casual', 'streetwear'],
        type: 'top',
        desc: 'A comfortable and versatile hooded sweatshirt for layering or wearing on its own.',
        _id: this.utilService.makeId()
      },
      {
        name: 'Elegant Cocktail Dress',
        gender: 'female',
        price: 89.99,
        imgUrl: 'https://example.com/images/clothing/dress-cocktail-black.jpg',
        quantity: 4,
        style: ['formal', 'eveningwear'],
        type: 'dress',
        desc: 'A stunning and sophisticated cocktail dress for a special occasion.',
        _id: this.utilService.makeId()
      },
      {
        name: 'Performance Running Tights',
        gender: 'unisex',
        price: 49.99,
        imgUrl: 'https://example.com/images/clothing/tights-running-black.jpg',
        quantity: 6,
        style: ['athletic', 'activewear'],
        type: 'bottoms',
        desc: 'Supportive and breathable running tights for optimal performance during workouts.',
        _id: this.utilService.makeId()
      },
      {
        name: 'Classic Leather Boots',
        gender: 'male',
        price: 179.99,
        imgUrl: 'https://example.com/images/clothing/boots-leather-brown.jpg',
        quantity: 5,
        style: ['formal', 'winter'],
        type: 'shoes',
        desc: 'Durable and stylish leather boots for a timeless and elevated look.',
        _id: this.utilService.makeId()
      },
      {
        name: 'Trendy Denim Jacket',
        gender: 'female',
        price: 59.99,
        imgUrl: 'https://example.com/images/clothing/jacket-denim-lightwash.jpg',
        quantity: 9,
        style: ['casual', 'streetwear'],
        type: 'jacket',
        desc: 'A cool and versatile denim jacket for a relaxed and trendy look.',
        _id: this.utilService.makeId()
      },
      {
        name: 'Comfortable Pajamas',
        gender: 'unisex',
        price: 29.99,
        imgUrl: ['https://example.com/images/clothing/pajamas-striped-blue.jpg', 'https://example.com/images/clothing/pajamas-floral-pink.jpg'],
        quantity: 15,
        style: ['sleepwear', 'loungewear'],
        type: 'set',
        desc: 'A soft and cozy pajama set for ultimate comfort and relaxation.',
        _id: this.utilService.makeId()
      },
      {
        name: 'Functional Hiking Boots',
        gender: 'unisex',
        price: 84.99,
        imgUrl: 'https://example.com/images/clothing/boots-hiking-brown.jpg',
        quantity: 7,
        style: ['outdoor', 'activewear'],
        type: 'shoes',
        desc: 'Durable and supportive hiking boots for outdoor adventures.',
        _id: this.utilService.makeId()
      },
      {
        name: 'Warm Puffer Jacket',
        gender: 'male',
        price: 69.99,
        imgUrl: 'https://example.com/images/clothing/jacket-puffer-black.jpg',
        quantity: 11,
        style: ['winter', 'outerwear'],
        type: 'jacket',
        desc: 'A lightweight and warm puffer jacket for cold weather conditions.',
        _id: this.utilService.makeId()
      },
      {
        name: 'Flowy Maxi Dress',
        gender: 'female',
        price: 64.99,
        imgUrl: 'https://example.com/images/clothing/dress-maxi-floral.jpg',
        quantity: 3,
        style: ['summer', 'bohemian'],
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


