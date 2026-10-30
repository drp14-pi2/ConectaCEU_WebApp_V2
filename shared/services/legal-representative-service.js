import { config } from '/config.js'

export class LegalRepresentativeService {
    static async create(name, document, degreeId, userId) {
        return await fetch(`${config.apiUrl}/representative`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                document: document,
                legal_representative_degree_id: degreeId,
                user_id: userId
            })
        })
    }
}
