import { UserService } from '/shared/services/user-service.js'
import { DocumentService } from '/shared/services/document-service.js'
import { showMessage } from '/shared/components/toast.component.js'
import { pageRouting } from '/shared/constants/page-routing.js'
import { ListUsers } from '/shared/models/user.js'
import { UserType } from '/shared/constants/user-type.js'
import { DocumentType } from '/shared/constants/document-type.js'

const params = new URLSearchParams(window.location.search);
const userId = params.get('id');

if (!userId) location.href = pageRouting.manageUsers

async function getUserIdentityDocument(userId) {
    const response = await DocumentService.getUserIdentityDocument(userId)

    if (response.ok) {
        const responseBody = await response.json()
        const firstDocument = responseBody[0]

        if (firstDocument.document_type_id) {
            return DocumentType.getName(firstDocument.document_type_id)
        }
    }
    
    return ''
}

async function setUserData() {
    const response = await UserService.get(userId)

    if (!response.ok) {
        showMessage(await response.text())

        return
    }

    const user = await response.json()

    // Name
    const userNameElement = document.querySelector('#user-name')
    userNameElement.value = user.name

    // Document type
    const documentTypeElement = document.querySelector('#select-document-type')
    const documentTypeOption = document.createElement('option')
    documentTypeOption.textContent = await getUserIdentityDocument(userId)
    documentTypeElement.appendChild(documentTypeOption)

    // Document
    const userDocumentElement = document.querySelector('#user-document')
    userDocumentElement.value = user.document

    // Phone
    const phoneElement = document.querySelector('#phone')
    phoneElement.value = user.cellphone_number

    // E-mail
    const emailElement = document.querySelector('#email')
    emailElement.value = user.email

    // User type
    const userTypeElement = document.querySelector('#user-type')
    const userTypeOptionElement = document.createElement('option')
    userTypeOptionElement.textContent = UserType.getName(user.user_type_id)
    userTypeElement.appendChild(userTypeOptionElement)

    // Status
    const userStatusElement = document.querySelector('#user-status')
    const statusOptionElement = document.createElement('option')
    statusOptionElement.textContent = user.active ? 'Ativo' : 'Inativo'
    userStatusElement.appendChild(statusOptionElement)
}
await setUserData()

async function submitForm() {

}
const submitButton = document.querySelector('#button-submit-form')
submitButton.addEventListener('click', async () => await submitForm())
