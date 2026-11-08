import { UserService } from '/shared/services/user-service.js'
import { DocumentService } from '/shared/services/document-service.js'
import { showMessage } from '/shared/components/toast.component.js'
import { pageRouting } from '/shared/constants/page-routing.js'
import { UserType } from '/shared/constants/user-type.js'
import { DocumentType } from '/shared/constants/document-type.js'
import { ApiHelper } from '/shared/helpers/api-helper.js'
import { StyleHelper } from '/shared/helpers/style-helper.js'

const params = new URLSearchParams(window.location.search);
const userId = params.get('id');

if (!userId) location.href = pageRouting.manageUsers

// Get user data
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
        showMessage(await ApiHelper.getResponseError(response))
        location.href = pageRouting.manageUsers

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
    const isActive = user.active
    statusOptionElement.textContent = isActive ? 'Ativo' : 'Inativo'
    statusOptionElement.value = isActive ? 'true' : 'false'
    userStatusElement.appendChild(statusOptionElement)

    if (isActive) {
        const reasonContainerElement = document.querySelector('.reason-container')

        if (reasonContainerElement) StyleHelper.setDisplay(reasonContainerElement, 'flex')
    }

    return
}
await setUserData()

async function submitForm() {
    const userStatusElement = document.querySelector('#user-status')

    if (!userStatusElement || (userStatusElement.value != 'true' && userStatusElement.value != 'false')) {
        showMessage('Status inválido')

        return
    }

    const isUserActivate = userStatusElement.value === 'true'

    if (isUserActivate) {
        const reason = document.querySelector('#reason').value

        if (!reason) {
            showMessage('Uma justificativa de desativação é obrigatória')

            return
        }

        if (reason.length < 10) {
            showMessage('A justificativa precisa de pelo menos 10 caracteres')

            return
        }

        const response = await UserService.deactivate(userId, reason)

        if (!response.ok) {
            showMessage(await ApiHelper.getResponseError(response))

            return
        }

        const responseBody = await response.json()
        await showMessage(responseBody.message)
        location.href = pageRouting.manageUsers

        return
    }
    else {
        const response = await UserService.activate(userId)

        if (!response.ok) {
            showMessage(await ApiHelper.getResponseError(response))

            return
        }

        const responseBody = await response.json()
        await showMessage(responseBody.message)
        location.href = pageRouting.manageUsers

        return
    }
}
const submitButton = document.querySelector('#button-submit-form')
submitButton.addEventListener('click', async () => await submitForm())
