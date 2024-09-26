import { Injectable, inject } from '@angular/core'
import { Observable, BehaviorSubject, throwError, from, tap, retry, catchError, map, Subscription, of, take } from 'rxjs'
import { storageService } from './local.storage.service'
import { HttpErrorResponse } from '@angular/common/http'
import { User } from '../models/user.model'
import { UtilService } from './util.service'
import { ClothingItem } from '../models/clothingitem.model'
import { Order } from '../models/order.model'
import { ClothingItemService } from './clothingitem.service'
import { Buyer } from '../models/buyer.model'

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
    if (!users || users.length === 0) this._setDefaultUsers(1000)
    const storedUser = this.utilService.loadFromStorage(USER_DB)
    if (this._isValidUser(storedUser)) {
      const userToSave = users.find(user => user.username === storedUser.username)!
      this._loggedInUser$.next(userToSave)
    }
    else this._loggedInUser$.next(null)
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
    } else return of(undefined);
  }

  public disconnect(): void {
    this.utilService.removeFromStorage(USER_DB)
    this.clothingService.removeQuantitiesFromClothes()
    this._loggedInUser$.next(null)
  }

  public addItemToList(item: ClothingItem, listName: 'wishlist' | 'recentOrder'): Observable<ClothingItem[] | Order> {
    let userToUpdate = this._loggedInUser$.value
    if (!userToUpdate) return throwError('No logged in user found')
    if (listName === 'wishlist') userToUpdate[listName].unshift(item)
    else {
      const order = userToUpdate.recentOrder
      if (item.stock > 0) {
        if (order) {
          const idxOfItemInOrder = order.selectedItems.findIndex(_item => _item._id === item._id)
          if (idxOfItemInOrder >= 0) {
            userToUpdate.recentOrder = { ...order, sum: order.sum + item.price }
          } else userToUpdate.recentOrder = {
            ...order,
            selectedItems: [...order.selectedItems, item],
            sum: +(order.sum + item.price).toFixed(2)
          }
        } else userToUpdate.recentOrder = {
          selectedItems: [item],
          sum: item.price,
          _id: this.utilService.makeId()
        }
        this.utilService.setToStorage(USER_DB, userToUpdate)
        this._loggedInUser$.next(userToUpdate)
        const quantityToUpdate: number = item.quantity ? ++item.quantity : 1
        const itemToUpdate: ClothingItem = { ...item, quantity: quantityToUpdate, stock: --item.stock }
        this.clothingService.saveClothingItem(itemToUpdate).pipe(take(1)).subscribe()
      } else return throwError('The item is out stock')
    }

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
      const order = user.recentOrder!
      user.recentOrder = {
        ...order, selectedItems: order!.selectedItems.filter(item => item._id !== itemToRemove._id),
        sum: order!.sum - itemToRemove.price, _id: order._id
      }
      const itemToUpdate: ClothingItem = { ...itemToRemove }
      if (itemToUpdate.quantity! > 1) itemToUpdate.quantity! -= 1
      else delete itemToUpdate.quantity
      itemToUpdate.stock += 1
      this.clothingService.saveClothingItem(itemToUpdate).subscribe()
    }
    this.utilService.setToStorage(USER_DB, user)
    this._loggedInUser$.next(user)
    return of(this._loggedInUser$.value!)
  }

  public getUser(): Partial<User> {
    const user = this._loggedInUser$.value
    return this._deleteUsersPrivateInfo(user!)
  }

  public updateUser(user: Partial<User>): Observable<User> | undefined {
    const userToEdit = users.find(_user => _user.username === user.username)
    if (!userToEdit) return undefined
    const userToUpdate = { ...userToEdit, ...user } as User
    users = users.map(user => {
      if (user.username === userToUpdate.username) return userToUpdate
      return user
    })
    this._loggedInUser$.next(userToUpdate)
    const userForStorage = { ...userToUpdate }
    delete (userForStorage as Partial<User>).password
    this.utilService.setToStorage(USER_DB, userForStorage)
    return of(userToUpdate)
  }

  public addOrder(buyerDetails: Buyer): Observable<User> {
    const user = this._loggedInUser$.value as User
    const userToUpdate = { ...user }
    const currOrder = { ...user.recentOrder! }
    const orderToAdd: Order = {
      selectedItems: currOrder.selectedItems,
      sum: currOrder.sum,
      orderNumber: `o10${++user.orders.length}`,
      orderDetails: {
        buyer: { ...buyerDetails }
      },
      _id: currOrder._id
    }
    userToUpdate.orders.push(orderToAdd)
    userToUpdate.coins -= currOrder.sum
    delete userToUpdate.recentOrder
    this.utilService.setToStorage(USER_DB, userToUpdate)
    this._loggedInUser$.next(userToUpdate)
    return of(userToUpdate)
  }

  private _deleteUsersPrivateInfo(user: User): Partial<User> {
    let userToReturn: Partial<User> = { ...user }
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
      Array.isArray(user.wishlist) &&
      typeof user.isSubscribed === 'boolean' &&
      (user.favoriteStyles === undefined || Array.isArray(user.favoriteStyles))
    )
  }
}
