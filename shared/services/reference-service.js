import { config } from '/config.js'

export class ReferenceService {
    static async getSexTypes() {
        return await fetch(`${config.apiUrl}/reference/sex-types`, { method: 'GET' })
    }

    static async getGenderTypes() {
        return await fetch(`${config.apiUrl}/reference/gender-types`, { method: 'GET' })
    }
    
    static async getLegalRepresentativeDegreeTypes() {
        return await fetch(`${config.apiUrl}/reference/legal-representative-degrees`, { method: 'GET' })
    }
}
