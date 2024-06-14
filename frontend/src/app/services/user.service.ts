import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError, from, tap, retry, catchError, map, Subscription } from 'rxjs';
import { storageService } from './local.storage.service';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from '../models/user.model';
import { utilService } from './util.service';

const USER_DB = 'user'
const USERS_DB = 'users'

@Injectable({
  providedIn: 'root'
})

export class userService {

  private _loggedInUser$ = new BehaviorSubject<User | null>(null)
  public loggedInUser$ = this._loggedInUser$.asObservable()

  constructor() {
    const storedUser = utilService.loadFromStorage(USER_DB)
    this._loadUsers()
    if (this._isValidUser(storedUser)) {
      this._loggedInUser$.next(storedUser)
    } else {
      console.error('Invalid user data found in storage')
      this._loggedInUser$.next(null)
    }
  }

  public async signup(credentials: Partial<User>): Promise<User | Error | null> {
    if (!this._validateCredentials(credentials)) {
      return new Error('Invalid credentials. Please check your information.')
    }

    try {
      const user: User = {
        fullName: credentials.fullName!,
        sex: credentials.sex!,
        isAdmin: credentials.isAdmin!,
        password: credentials.password!,
        email: credentials.email!,
        _id: utilService.makeId(),
        coins: 1000,
        wishlist: [],
        isSubscribed: credentials.isSubscribed ?? false,
        favoriteStyles: [],
      }

      this._loggedInUser$.next(user)
      utilService.setToStorage(USER_DB, user)
      await storageService.post<User>(USERS_DB, user)
      return user
    } catch (err) {
      this._handleError(err as Error)
    }
    return null
  }

  public async login(credentials: Partial<User>): Promise<User | undefined> {
    try {
      const users = await storageService.query<User>(USERS_DB)
      const user = users.find(_user => _user.fullName === credentials.fullName && _user.password === credentials.password)
      return user
    } catch(err) {
      this._handleError(err as Error)
    }
    return undefined
  }

  public disconnect() : void {
    localStorage.removeItem(USER_DB)
    this._loggedInUser$.next(null)
  }

  private async _loadUsers() {
    let users: User[]
    try {
      users = await storageService.query<User>(USERS_DB)
      if (users) return
      else {
        this._setDefaultUsers(1000)
      }
    } catch (err) {
      this._handleError(err as HttpErrorResponse)
    }
  }

  private _setDefaultUsers(coins: number) {
    const users: User[] = [
      {
        fullName: 'Shoval Sabag',
        sex: 'Female',
        isAdmin: true,
        password: 'shov99',
        _id: utilService.makeId(),
        coins,
        wishlist: [],
        email: 'shoval.sabag@example.com',
        isSubscribed: true,
        favoriteStyles: ['Classic', 'Casual', 'Hippie'],
      },
      {
        fullName: 'Guest Guest',
        sex: 'Male',
        isAdmin: false,
        password: 'shov99',
        _id: utilService.makeId(),
        coins,
        wishlist: [],
        email: 'guest@example.com',
        isSubscribed: false,
      },
      {
        fullName: 'Alice Smith',
        sex: 'Female',
        isAdmin: false,
        password: 'shov99',
        _id: utilService.makeId(),
        coins,
        wishlist: [],
        email: 'alice.smith@example.com',
        isSubscribed: true,
      },
      {
        fullName: 'Bob Johnson',
        sex: 'Male',
        isAdmin: false,
        password: 'shov99',
        _id: utilService.makeId(),
        coins,
        wishlist: [],
        email: 'bob.johnson@example.com',
        isSubscribed: false,
      },
      {
        fullName: 'Charlie Brown',
        sex: 'Male',
        isAdmin: false,
        password: 'shov99',
        _id: utilService.makeId(),
        coins,
        wishlist: [],
        email: 'charlie.brown@example.com',
        isSubscribed: true,
        favoriteStyles: ['Sporty'],
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
