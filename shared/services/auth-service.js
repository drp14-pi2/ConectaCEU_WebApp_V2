import { config } from '/config.js'
import { storageKeys } from '/shared/constants/storage-keys.js'

export class AuthService {
    static async login(userDocument, password) {
        return await fetch(`${config.apiUrl}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                document: userDocument,
                password: password
            })
        })
    }

    static getLoggedUser() {
        const userString = sessionStorage.getItem(storageKeys.loggedUser)

        return JSON.parse(userString)
    }
}
