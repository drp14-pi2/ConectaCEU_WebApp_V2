import { config } from '/config.js'
import { storageKeys } from '/shared/constants/storage-keys.js'
import { UserType } from '/shared/constants/user-type.js'

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

    static async publicUserRegister(createUserForm) {
        return await fetch(`${config.apiUrl}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                document: createUserForm.userDocument,
                name: createUserForm.userName,
                email: createUserForm.email,
                cellphone_number: createUserForm.phone,
                contact_cellphone_number: createUserForm.secondPhone,
                birthdate: createUserForm.birthdate,
                school: createUserForm.school,
                sex_id: createUserForm.sex,
                gender_id: createUserForm.gender,
                user_type_id: UserType.STUDENT,
                password: createUserForm.password,
                address: {
                    zip_code: createUserForm.zipCode,
                    street: createUserForm.street,
                    number: createUserForm.addressNumber,
                    complement: createUserForm.addressComplement,
                    neighborhood: createUserForm.neighborhood
                },
                educational_unit_id: createUserForm.educationalUnitId
            })
        })
    }

    static getLoggedUser() {
        const userString = sessionStorage.getItem(storageKeys.loggedUser)

        return JSON.parse(userString)
    }
}
