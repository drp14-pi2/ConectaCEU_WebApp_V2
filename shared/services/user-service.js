import { config } from '/config.js'

export class UserService {
    static async create(createUser) {
        return await fetch(`${config.apiUrl}/user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                document: createUser.document,
                name: createUser.name,
                email: createUser.email,
                cellphone_number: createUser.cellphoneNumber,
                contact_cellphone_number: createUser.contactCellphoneNumber,
                birthdate: createUser.birthdate,
                school: createUser.school,
                sex_id: createUser.sexId,
                gender_id: createUser.genderId,
                user_type_id: createUser.userTypeId,
                password: createUser.password,
                educational_unit_id: createUser.educationalUnitId,
                id_document_front: createUser.idDocumentFront,
                id_document_back: createUser.idDocumentBack,
                user_photo: createUser.userPhoto,
                health_certificate: createUser.healthCertificate ? createUser.healthCertificate : null,
                address: {
                    zip_code: createUser.address.zipCode,
                    street: createUser.address.street,
                    number: createUser.address.number,
                    complement: createUser.address.complement,
                    neighborhood: createUser.address.neighborhood
                },
                legal_representative_1: !createUser.legalRepresentative1 ? null : {
                    name: createUser.legalRepresentative1.name,
                    document: createUser.legalRepresentative1.document,
                    legal_representative_degree_id: createUser.legalRepresentative1.legalRepresentativeDegreeId,
                    id_document_front: createUser.legalRepresentative1.idDocumentFront,
                    id_document_back: createUser.legalRepresentative1.idDocumentBack,
                    student_registry_authorization: createUser.legalRepresentative1.studentRegistryAuthorization
                },
                legal_representative_2: !createUser.legalRepresentative2 ? null : {
                    name: createUser.legalRepresentative2.name,
                    document: createUser.legalRepresentative2.document,
                    legal_representative_degree_id: createUser.legalRepresentative2.legalRepresentativeDegreeId,
                    id_document_front: createUser.legalRepresentative2.idDocumentFront,
                    id_document_back: createUser.legalRepresentative2.idDocumentBack,
                    student_registry_authorization: createUser.legalRepresentative2.studentRegistryAuthorization
                }
            })
        })
    }

    static async get(userId) {
        return fetch(`${config.apiUrl}/user/${userId}`, { method: 'GET' })
    }

    static async list(searchBody) {
        return await fetch(`${config.apiUrl}/user/list`,
            {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    name: searchBody.name,
                    document: searchBody.document,
                    email: searchBody.email,
                    phone_number: searchBody.phoneNumber,
                    user_type_id: searchBody.userTypeId,
                    active: searchBody.active,
                    educational_units_ids: searchBody.educationalUnitsIds,
                    page: searchBody.page,
                    page_size: searchBody.pageSize
                })
            }
        )
    }

    static async activate(userId) {
        return await fetch(`${config.apiUrl}/user/${userId}/activate`, { method: 'PATCH' })
    }

    static async deactivate(userId, reason) {
        return await fetch(`${config.apiUrl}/user/${userId}/deactivate`, {
            method: 'PATCH',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                reason: reason
            })
        })
    }
}
