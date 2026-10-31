import { config } from '/config.js'
import { pageRouting } from '/shared/constants/page-routing.js'
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

    static async publicUserRegister(createUser) {
        return await fetch(`${config.apiUrl}/auth/register`, {
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
                health_certificate: createUser.healthCertificate,
                address: {
                    zip_code: createUser.address.zipCode,
                    street: createUser.address.street,
                    number: createUser.address.number,
                    complement: createUser.address.complement,
                    neighborhood: createUser.address.neighborhood
                },
                legal_representative_1: {
                    name: createUser.legalRepresentative1.name,
                    document: createUser.legalRepresentative1.document,
                    legal_representative_degree_id: createUser.legalRepresentative1.legalRepresentativeDegreeId,
                    id_document_front: createUser.legalRepresentative1.idDocumentFront,
                    id_document_back: createUser.legalRepresentative1.idDocumentBack,
                    student_registry_authorization: createUser.legalRepresentative1.studentRegistryAuthorization
                },
                legal_representative_2: {
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

    static getLoggedUser() {
        const userString = sessionStorage.getItem(storageKeys.loggedUser)

        return JSON.parse(userString)
    }

    static logout() {
        sessionStorage.removeItem(storageKeys.authToken)
        location.href = pageRouting.root
    }
}
