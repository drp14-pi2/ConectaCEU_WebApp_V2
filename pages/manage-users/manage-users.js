import { UserType } from '/shared/constants/user-type.js'
import { ReferenceService } from '/shared/services/reference-service.js'
import { UserService } from '/shared/services/user-service.js'
import { DocumentService } from '/shared/services/document-service.js'
import { showMessage }  from '/shared/components/toast.component.js'
import { setLoading }  from '/shared/components/loading-button.js'
import { ListUsers } from '/shared/models/user.js'
import { Validator } from '/shared/validation/validator.js'
import { StringHelper } from '/shared/helpers/string-helper.js'
import { ArrayHelper } from '/shared/helpers/array-helper.js'
import { DocumentType } from '/shared/constants/document-type.js'

async function setUserTypes() {
    const response = await ReferenceService.getUserTypes()

    if (!response.ok) {
        await showMessage(await response.text())

        return
    }

    const userSelectElement = document.querySelector('#userType')
    const userTypes = await response.json()
    
    for (const user of userTypes) {
        if (user.id == UserType.ADMINISTRATOR) continue
        
        const userOption = document.createElement('option')
        userOption.value = user.id
        userOption.innerText = user.description
        userSelectElement.appendChild(userOption)
    }
}

await setUserTypes()

function getFormData() {
    return {
        userName: document.querySelector('#userName').value ?? null,
        userDocument: StringHelper.removeNotNumber(document.querySelector('#userDocument').value),
        email: document.querySelector('#email').value,
        phone: StringHelper.removeNotNumber(document.querySelector('#phone').value),
        userType: document.querySelector('#userType').value,
        userStatus: document.querySelector('#userStatus').value
    }
}

function getSearchBody(formData, pageNumber, pageSize) {
    return new ListUsers(
        formData.userName ? formData.userName : null,
        formData.userDocument ? formData.userDocument : null,
        formData.email ? formData.email : null,
        formData.phone ? formData.phone : null,
        formData.userType ? formData.userType : null,
        formData.userStatus ? formData.userStatus : null,
        null,
        pageNumber,
        pageSize
    )
}

function validateFormData(formData) {
    const errors = []

    if (formData.name && (formData.name.length < 5 || formData.name.length > 200)) {
        errors.push('Nome deve ter entre 5 e 200 caracteres')
    }

    if (formData.document && formData.document.length != 11) {
        errors.push('Documento deve ter 11 caracteres')
    }

    if (formData.email && !Validator.isValidEmail(formData.email)) {
        errors.push('E-mail inválido')
    }

    if (formData.phoneNumber && formData.phoneNumber.length > 15) {
        errors.push('Número de celular deve ter até 15 caracteres')
    }

    if (formData.userTypeId && !UserType.isValid(formData.userTypeId)) {
        errors.push('Tipo de usuário inválido')
    }

    if (formData.active && (formData.active != 'true' && formData.active != 'false')) {
        errors.push('Status inválido')
    }

    return errors
}

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

async function addResponseDataToTable(users) {
    if (!users) return

    const tbodyElement = document.querySelector('.item-listing-result tbody')
    tbodyElement.replaceChildren()

    for (const user of users) {
        // Create table row
        const trowElement = document.createElement('tr')

        // Name
        const userNameCell = document.createElement('td')
        userNameCell.textContent = user.name
        trowElement.appendChild(userNameCell)

        // Document type
        const documentTypeCell = document.createElement('td')
        documentTypeCell.textContent = await getUserIdentityDocument(user.id)
        trowElement.appendChild(documentTypeCell)

        // Document
        const documentCell = document.createElement('td')
        documentCell.textContent = user.document
        trowElement.appendChild(documentCell)

        // Phone
        const phoneCell = document.createElement('td')
        phoneCell.textContent = user.cellphone_number
        trowElement.appendChild(phoneCell)

        // E-mail
        const emailCell = document.createElement('td')
        emailCell.textContent = user.email
        trowElement.appendChild(emailCell)

        // User type
        const userTypeCell = document.createElement('td')
        userTypeCell.textContent = UserType.getName(Number(user.user_type_id))
        trowElement.appendChild(userTypeCell)

        // Status
        const userStatusCell = document.createElement('td')
        userStatusCell.textContent = user.active ? 'Ativo' : 'Inativo'
        trowElement.appendChild(userStatusCell)

        // Append row to tbody
        tbodyElement.appendChild(trowElement)
    }
}

// Pagination
const pageSize = 10
let pageNumber = 1
let totalItems = 0

// Get total pages count
function totalPages() {
    return Math.ceil(totalItems / pageSize)
}

// Update the page number display
function updatePageNumberDisplay() {
    const tablePageControlPageNumber = document.querySelector('.table-page-control-page-number')

    if (tablePageControlPageNumber) tablePageControlPageNumber.textContent = pageNumber
}

// Set the page number
function setPage(n) {
    const last = totalPages();
    pageNumber = Math.min(Math.max(1, n), Math.max(last, 1));
    updatePageNumberDisplay();
}

// Start button
const tablePageControlStart = document.querySelector('.table-page-control-start')
tablePageControlStart.addEventListener('click', async () => {
    if (pageNumber <= 1) return

    setPage(1)
    await searchItems()
})

// Previous button
const tablePageControlPrevious = document.querySelector('.table-page-control-previous')
tablePageControlPrevious.addEventListener('click', async () => {
    if (pageNumber <= 1) return
    
    setPage(pageNumber - 1)
    await searchItems()
})

// Forward button
const tablePageControlForward = document.querySelector('.table-page-control-forward')
tablePageControlForward.addEventListener('click', async () => {
    if (pageNumber >= totalPages()) return
    
    setPage(pageNumber + 1)
    await searchItems()
})

// End button
const tablePageControlLast = document.querySelector('.table-page-control-last')
tablePageControlLast.addEventListener('click', async () => {
    const last = totalPages();

    if (last < 1 || pageNumber >= last) return;

    setPage(last);
    await searchItems()
})

// Submit form
const submitButton = document.querySelector('.search-button')
async function searchItems() {
    setLoading(submitButton, true)
    const formData = getFormData()
    const formDataErrors = validateFormData(formData)
    
    if (formDataErrors.length > 0) {
        showMessage(ArrayHelper.arrayToString(formDataErrors))
        setLoading(submitButton, false)

        return
    }

    // Queries users
    const searchBody = getSearchBody(formData, pageNumber, pageSize)
    const createUnitResponse = await UserService.list(searchBody)
    
    if (!createUnitResponse.ok) {
        showMessage(await createUnitResponse.text())
        setLoading(submitButton, false)

        return
    }

    const responseBody = await createUnitResponse.json()

    if (responseBody.length == 0) {
        showMessage('Nenhum usuário encontrado')
    }
    else {
        totalItems = responseBody.total
        await addResponseDataToTable(responseBody.users)
    }

    updatePageNumberDisplay()
    setLoading(submitButton, false)

    return
}
submitButton.addEventListener('click', async () => await searchItems())
