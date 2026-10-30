import { config } from '/config.js'

export class DocumentService {
    static async upload(base64, documentTypeId, userId, isFront = null, legalRepresentativeId = null) {
        return await fetch(`${config.apiUrl}/document`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                base64: base64,
                document_type_id: documentTypeId,
                user_id: userId,
                is_front: isFront,
                legal_representative_id: legalRepresentativeId
            })
        })
    }
}
