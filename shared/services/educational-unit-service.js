import { config } from '/config.js'

export class EducationalUnitService {
    static async list() {
        return await fetch(`${config.apiUrl}/unit?active=true`, { method: 'GET' })
    }
}
