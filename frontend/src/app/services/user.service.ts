import { Injectable, inject } from '@angular/core'
import { Observable, BehaviorSubject, throwError, from, tap, retry, catchError, map, Subscription, of, take } from 'rxjs'
import { storageService } from './local.storage.service'
import { HttpErrorResponse } from '@angular/common/http'
import { User } from '../models/user.model'
import { UtilService } from './util.service'
import { ClothingItem } from '../models/clothingitem.model'
import { Order } from '../models/order.model'
import { ClothingItemService } from './clothingitem.service'

const USER_DB = 'user'
let users: User[]

@Injectable({
  providedIn: 'root'
})

export class UserService {

  private utilService = inject(UtilService)
  private clothingService = inject(ClothingItemService)
  private _loggedInUser$ = new BehaviorSubject<User | null>(null)
  public loggedInUser$ = this._loggedInUser$.asObservable()

  constructor() {
    const storedUser = this.utilService.loadFromStorage(USER_DB)
    if (this._isValidUser(storedUser)) this._loggedInUser$.next(storedUser)
    else this._loggedInUser$.next(null)

    if (!users || users.length === 0) this._setDefaultUsers(1000)
  }

  public signup(credentials: Partial<User>): Observable<Partial<User> | Error> {
    if (!this._validateCredentials(credentials)) {
      return throwError(() => new Error('Invalid credentials. Please check your information.'))
    }

    const user: User = {
      fullName: credentials.fullName!,
      username: credentials.username!,
      gender: credentials.gender!,
      isAdmin: false,
      password: credentials.password!,
      email: credentials.email!,
      coins: 1000,
      wishlist: [],
      isSubscribed: credentials.isSubscribed ?? false,
      favoriteStyles: [],
      orders: [],
      _id: this.utilService.makeId()
    }

    return of(users.unshift(user))
      .pipe(
        map(() => {
          this._loggedInUser$.next(user)
          const userToSave: Partial<User> = this._deleteUsersPrivateInfo(user)
          this.utilService.setToStorage(USER_DB, userToSave)
          return userToSave
        }),
      )
  }

  public login(credentials: Partial<User>): Observable<Partial<User> | undefined> {
    const user = users.find(user => credentials.username === user.username && credentials.password === user.password)
    if (user) {
      this._loggedInUser$.next(user);
      const userToSave: Partial<User> = this._deleteUsersPrivateInfo(user)
      this.utilService.setToStorage(USER_DB, userToSave);
      return of(userToSave);
    } else {
      return of(undefined);
    }
  }

  public disconnect(): void {
    this.utilService.removeFromStorage(USER_DB)
    this._loggedInUser$.next(null)
  }

  public addItemToList(item: ClothingItem, listName: 'wishlist' | 'recentOrder'): Observable<ClothingItem[] | Order> {
    let userToUpdate = this._loggedInUser$.value
    if (!userToUpdate) return throwError('No logged in user found')
    if (listName === 'wishlist') userToUpdate[listName].unshift(item)
    else {
      userToUpdate.recentOrder = userToUpdate.recentOrder ?
        { ...userToUpdate.recentOrder, selectedItems: [...userToUpdate.recentOrder.selectedItems, item], sum: userToUpdate.recentOrder.sum + item.price } :
        { selectedItems: [item], sum: item.price }
      const quantityToUpdate: number = item.quantity ? item.quantity++ : 1
      const itemToUpdate: ClothingItem = { ...item, quantity: quantityToUpdate }
      this.clothingService.saveClothingItem(itemToUpdate).pipe(take(1)).subscribe()
    }

    this.utilService.setToStorage(USER_DB, userToUpdate)
    this._loggedInUser$.next(userToUpdate)
    return of(userToUpdate)
      .pipe(
        map(user => {
          return user[listName]!
        })
      )
  }

  public removeItemFromList(itemToRemove: ClothingItem, listName: 'wishlist' | 'recentOrder'): Observable<User> {
    const user = this._loggedInUser$.value
    if (!user) return this._handleError(new Error('No logged in user found'))
    if (listName === 'wishlist') user.wishlist = user.wishlist.filter(item => item._id !== itemToRemove._id)
    else {
      user.recentOrder = {
        ...user.recentOrder, selectedItems: user.recentOrder!.selectedItems.filter(item => item._id !== itemToRemove._id),
        sum: user.recentOrder!.sum - itemToRemove.price
      }
      const itemToUpdate: ClothingItem = { ...itemToRemove }
      if (itemToUpdate.quantity! > 1) itemToUpdate.quantity! -= 1
      else delete itemToUpdate.quantity
      this.clothingService.saveClothingItem(itemToUpdate).subscribe()
    }
    this.utilService.setToStorage(USER_DB, user)
    this._loggedInUser$.next(user)
    return of(this._loggedInUser$.value!)
  }

  private _deleteUsersPrivateInfo(user: User): Partial<User> {
    let userToReturn: Partial<User> = user
    delete userToReturn.password
    delete userToReturn._id
    return userToReturn
  }

  private _setDefaultUsers(coins: number) {
    const _users: User[] = [
      {
        fullName: 'Shoval Sabag',
        username: 'Shovalit',
        gender: 'Female',
        isAdmin: true,
        password: 'shov99',
        _id: this.utilService.makeId(),
        coins,
        wishlist: [],
        email: 'shoval.sabag@example.com',
        isSubscribed: true,
        favoriteStyles: ['classic', 'casual', 'hippie'],
        orders: []
      },
      {
        fullName: 'Guest Guest',
        username: 'guest',
        gender: 'Male',
        isAdmin: false,
        password: 'guest',
        _id: this.utilService.makeId(),
        coins,
        wishlist: [],
        email: 'guest@example.com',
        isSubscribed: false,
        orders: []
      },
      {
        fullName: 'Alice Smith',
        username: 'AliceS',
        gender: 'Female',
        isAdmin: false,
        password: 'shov99',
        _id: this.utilService.makeId(),
        coins,
        wishlist: [],
        email: 'alice.smith@example.com',
        isSubscribed: true,
        orders: []
      },
      {
        fullName: 'Bob Johnson',
        username: 'BobJ',
        gender: 'Male',
        isAdmin: false,
        password: 'shov99',
        _id: this.utilService.makeId(),
        coins,
        wishlist: [],
        email: 'bob.johnson@example.com',
        isSubscribed: false,
        orders: []
      },
      {
        fullName: 'Charlie Brown',
        username: 'CharlieB',
        gender: 'Male',
        isAdmin: false,
        password: 'shov99',
        _id: this.utilService.makeId(),
        coins,
        wishlist: [],
        email: 'charlie.brown@example.com',
        isSubscribed: true,
        favoriteStyles: ['sporty'],
        orders: []
      }
    ]
    users = _users
  }

  private _validateCredentials(credentials: Partial<User>): boolean {
    if (!credentials ||
      !credentials.fullName ||
      !credentials.password ||
      !credentials.email) return false

    return credentials.fullName.length > 0 &&
      credentials.password.length > 0 &&
      credentials.email.length > 0
  }

  private _handleError(err: Error) {
    console.log('err:', err)
    return throwError(() => err)
  }

  private _isValidUser(user: any): user is User {
    return (
      typeof user.fullName === 'string' &&
      typeof user.email === 'string' &&
      typeof user._id === 'string' &&
      Array.isArray(user.wishlist) &&
      typeof user.isSubscribed === 'boolean' &&
      (user.favoriteStyles === undefined || Array.isArray(user.favoriteStyles))
    )
  }
}
