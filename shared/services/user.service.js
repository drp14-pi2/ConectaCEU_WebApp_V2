import { storageKeys } from '/shared/constants/storage-keys.js'

export class UserService {
    static getLoggedUser() {
        const loggedUser = sessionStorage.getItem(storageKeys.loggedUser)
        
        return loggedUser ? JSON.parse(loggedUser) : null
    }
}
