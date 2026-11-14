import { UserType } from '/shared/constants/user-type.js'
import { UserService } from '/shared/services/user-service.js'
import { AuthService } from '/shared/services/auth-service.js'
import { showMessage }  from '/shared/components/toast.component.js'
import { setLoading }  from '/shared/components/loading-button.js'
import { ListUsers } from '/shared/models/user.js'
import { Validator } from '/shared/validation/validator.js'
import { StringHelper } from '/shared/helpers/string-helper.js'
import { ArrayHelper } from '/shared/helpers/array-helper.js'
import { ApiHelper } from '/shared/helpers/api-helper.js'
import { StyleHelper } from '/shared/helpers/style-helper.js'

function getFormData() {
    return {
        userName: document.querySelector('#userName').value ?? null,
        userDocument: StringHelper.removeNotNumber(document.querySelector('#userDocument').value),
        email: document.querySelector('#email').value,
        phone: StringHelper.removeNotNumber(document.querySelector('#phone').value)
    }
}

function getSearchBody(formData, pageNumber, pageSize) {
    const loggedUser = AuthService.getLoggedUser()
    return new ListUsers(
        formData.userName ? formData.userName : null,
        formData.userDocument ? formData.userDocument : null,
        formData.email ? formData.email : null,
        formData.phone ? formData.phone : null,
        UserType.STUDENT,
        null,
        loggedUser.educationalUnitId ? [loggedUser.educationalUnitId] : null,
        null,
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

    return errors
}

async function renderResults(users) {
    const resultContainer = document.querySelector('.item-listing-result')

    if (!users) {
        StyleHelper.setDisplay(resultContainer, 'none')
        
        return
    }

    resultContainer.style.display = 'flex'

    const tbodyElement = document.querySelector('.item-listing-result tbody')
    tbodyElement.replaceChildren()

    for (const user of users) {
        // Create table row
        const trowElement = document.createElement('tr')

        // Name
        const userNameCell = document.createElement('td')
        userNameCell.textContent = user.name
        trowElement.appendChild(userNameCell)

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

        // Action button
        // Create button
        const actionButtonElement = document.createElement('button')
        actionButtonElement.classList.add('actionButton')

        // Icon
        const penIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" fill="currentColor"><path d="M432.5 82.3L382.4 132.4L507.7 257.7L557.8 207.6C579.7 185.7 579.7 150.3 557.8 128.4L511.7 82.3C489.8 60.4 454.4 60.4 432.5 82.3zM343.3 161.2L342.8 161.3L198.7 204.5C178.8 210.5 163 225.7 156.4 245.5L67.8 509.8C64.9 518.5 65.9 528 70.3 535.8L225.7 380.4C224.6 376.4 224.1 372.3 224.1 368C224.1 341.5 245.6 320 272.1 320C298.6 320 320.1 341.5 320.1 368C320.1 394.5 298.6 416 272.1 416C267.8 416 263.6 415.4 259.7 414.4L104.3 569.7C112.1 574.1 121.5 575.1 130.3 572.2L394.6 483.6C414.3 477 429.6 461.2 435.6 441.3L478.8 297.2L478.9 296.7L343.4 161.2z"/></svg>'
        actionButtonElement.innerHTML = penIcon

        // Create anchor and append button
        const anchorElement = document.createElement('a')
        anchorElement.style.margin = 'auto'
        anchorElement.href = `/pages/enroll-user/enroll-user.html?id=${user.id}`
        anchorElement.appendChild(actionButtonElement)

        // Create button cell and append anchor
        const actionButtonCell = document.createElement('td')
        actionButtonCell.classList.add('table-action-button-cell')
        actionButtonCell.appendChild(anchorElement)

        // Append cell to row
        trowElement.appendChild(actionButtonCell)

        // Append row to tbody
        tbodyElement.appendChild(trowElement)
    }
}

// Submit form
const submitButton = document.querySelector('.search-button')
async function submitForm() {
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
        showMessage(await ApiHelper.getResponseError(createUnitResponse))
        setLoading(submitButton, false)

        return
    }

    const responseBody = await createUnitResponse.json()

    if (responseBody.length == 0) {
        showMessage('Nenhum usuário encontrado')
    }
    else {
        totalItems = responseBody.total
        await renderResults(responseBody.users)
    }

    updatePageNumberDisplay()
    setLoading(submitButton, false)

    return
}
submitButton.addEventListener('click', async () => await submitForm())
