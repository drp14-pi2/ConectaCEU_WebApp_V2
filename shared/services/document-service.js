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

    static async get(id) {
        return await fetch(`${config.apiUrl}/document/${id}`)
    }

    static async getUserDocuments(userId) {
        return await fetch(`${config.apiUrl}/document/user/${userId}`)
    }

    static async getUserDocumentByType(userId, documentTypeId) {
        return await fetch(`${config.apiUrl}/document/user/${userId}/type/${documentTypeId}`)
    }

    static async getManagementDocumentTemplate(documentTypeId, component_id, month) {
        const params = new URLSearchParams();

        if (component_id) {
            params.set('component_id', component_id);
        }

        if (month) {
            params.set('month', month);
        }

        const resource = params.size
            ? `${config.apiUrl}/document/management/type/${documentTypeId}?${params}`
            : `${config.apiUrl}/document/management/type/${documentTypeId}`

        return await fetch(resource)
    }

    static async getUserIdentityDocument(userId) {
        return await fetch(`${config.apiUrl}/document/user/${userId}/identity/type`)
    }

    // Document validation
    static async validate(validationBody) {
        return await fetch(`${config.apiUrl}/document/validate`, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                document_id: validationBody.documentId,
                document_validation_status_type_id: validationBody.documentValidationStatusTypeId,
                rejection_reason: validationBody.rejectionReason
            })
        })
    }

    static async listPendingValidations(userId) {
        return await fetch(`${config.apiUrl}/document/validate/user/${userId}/pending`)
    }
}
