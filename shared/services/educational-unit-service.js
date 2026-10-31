import { config } from '/config.js'

export class EducationalUnitService {
    static async list() {
        return await fetch(`${config.apiUrl}/unit?active=true`, { method: 'GET' })
    }

    static async create(createUnit) {
        return await fetch(`${config.apiUrl}/unit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: createUnit.name,
                zip_code: createUnit.zipCode,
                street: createUnit.street,
                number: createUnit.number,
                complement: createUnit.complement,
                neighborhood: createUnit.neighborhood
            })
        })
    }
}
