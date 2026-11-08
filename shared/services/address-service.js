import { config } from '/config.js'

export class AddressService {
    static async list(userId) {
        return await fetch(`${config.apiUrl}/address/user/${userId}`)
    }
}
