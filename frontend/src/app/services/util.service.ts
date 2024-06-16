export const utilService = {
  loadFromStorage,
  makeId,
  setToStorage,
  removeFromStorage
}

  function loadFromStorage(entity: string): object | false {
    const userData = localStorage.getItem(entity)
    if (userData) return JSON.parse(userData)
    return false
  }

  function setToStorage(entity: string, data: object): void {
    localStorage.setItem(entity, JSON.stringify(data))
  }

  function makeId(length: number = 10): string {
    let txt = ''
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (let i = 0; i < length; i++) {
      txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return txt
  }

  function removeFromStorage(entity: string) : void {
    localStorage.removeItem(entity)
  }