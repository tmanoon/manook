import { Injectable } from '@angular/core'
import { Observable, BehaviorSubject, throwError, from, tap, retry, catchError, map, Subscription, of } from 'rxjs'
import { storageService } from './local.storage.service'
import { HttpErrorResponse } from '@angular/common/http'
import { User } from '../models/user.model'
import { utilService } from './util.service'

const USER_DB = 'user'
const USERS_DB = 'users'

@Injectable({
  providedIn: 'root'
})

export class UserService {

  private _loggedInUser$ = new BehaviorSubject<User | null>(null)
  public loggedInUser$ = this._loggedInUser$.asObservable()

  constructor() {
    const storedUser = utilService.loadFromStorage(USER_DB)
    if (this._isValidUser(storedUser)) this._loggedInUser$.next(storedUser)
    else this._loggedInUser$.next(null)

    const users = utilService.loadFromStorage(USERS_DB) as User[]
    if (!users || users.length === 0) this._setDefaultUsers(1000)
  }

  public signup(credentials: Partial<User>): Observable<User | Error> {
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
      _id: ''
    }

    return from(storageService.post<User>(USERS_DB, user))
      .pipe(
        map(() => {
          this._loggedInUser$.next(user)
          utilService.setToStorage(USER_DB, user)
          return user
        }),
        catchError(err => this._handleError(err))
      )
  }


  public login(credentials: Partial<User>): Observable<User | undefined> {
    return from(storageService.query<User>(USERS_DB))
      .pipe(
        map(users => users.find(_user => _user.username === credentials.username && _user.password === credentials.password)),
        catchError(err => of(undefined).pipe(catchError((error) => throwError(error)))),
        tap(user => {
          if (user) {
            this._loggedInUser$.next(user)
            utilService.setToStorage(USER_DB, user)
          }
        })
      )
  }

  public disconnect(): void {
    utilService.removeFromStorage(USER_DB)
    this._loggedInUser$.next(null)
  }

  private _setDefaultUsers(coins: number) {
    const users: User[] = [
      {
        fullName: 'Shoval Sabag',
        username: 'Shovalit',
        gender: 'Female',
        isAdmin: true,
        password: 'shov99',
        _id: utilService.makeId(),
        coins,
        wishlist: [],
        email: 'shoval.sabag@example.com',
        isSubscribed: true,
        favoriteStyles: ['Classic', 'Casual', 'Hippie'],
        orders: []
      },
      {
        fullName: 'Guest Guest',
        username: 'guest',
        gender: 'Male',
        isAdmin: false,
        password: 'shov99',
        _id: utilService.makeId(),
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
        _id: utilService.makeId(),
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
        _id: utilService.makeId(),
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
        _id: utilService.makeId(),
        coins,
        wishlist: [],
        email: 'charlie.brown@example.com',
        isSubscribed: true,
        favoriteStyles: ['Sporty'],
        orders: []
      }
    ]
    utilService.setToStorage(USERS_DB, users)
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
