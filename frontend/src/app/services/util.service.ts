import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() { }

  loadFromStorage(entity: string): object | false {
    const data = localStorage.getItem(entity)
    if (data) return JSON.parse(data)
    return false
  }

  setToStorage(entity: string, data: object): void {
    localStorage.setItem(entity, JSON.stringify(data))
  }

  makeId(length: number = 10): string {
    let txt = ''
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (let i = 0; i < length; i++) {
      txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return txt
  }

  removeFromStorage(entity: string): void {
    localStorage.removeItem(entity)
  }
}
