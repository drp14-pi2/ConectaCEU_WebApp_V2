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

try{
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
        UserType.EDUCATOR,
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
        if (getComputedStyle(resultContainer).display != 'none') {
            resultContainer.style.display = 'none'
        }
        
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

        // Icons
        const eyeIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" fill="currentColor"><path d="M320 144C254.8 144 201.2 173.6 160.1 211.7C121.6 247.5 95 290 81.4 320C95 350 121.6 392.5 160.1 428.3C201.2 466.4 254.8 496 320 496C385.2 496 438.8 466.4 479.9 428.3C518.4 392.5 545 350 558.6 320C545 290 518.4 247.5 479.9 211.7C438.8 173.6 385.2 144 320 144zM127.4 176.6C174.5 132.8 239.2 96 320 96C400.8 96 465.5 132.8 512.6 176.6C559.4 220.1 590.7 272 605.6 307.7C608.9 315.6 608.9 324.4 605.6 332.3C590.7 368 559.4 420 512.6 463.4C465.5 507.1 400.8 544 320 544C239.2 544 174.5 507.2 127.4 463.4C80.6 419.9 49.3 368 34.4 332.3C31.1 324.4 31.1 315.6 34.4 307.7C49.3 272 80.6 220 127.4 176.6zM320 400C364.2 400 400 364.2 400 320C400 290.4 383.9 264.5 360 250.7C358.6 310.4 310.4 358.6 250.7 360C264.5 383.9 290.4 400 320 400zM240.4 311.6C242.9 311.9 245.4 312 248 312C283.3 312 312 283.3 312 248C312 245.4 311.8 242.9 311.6 240.4C274.2 244.3 244.4 274.1 240.5 311.5zM286 196.6C296.8 193.6 308.2 192.1 319.9 192.1C328.7 192.1 337.4 193 345.7 194.7C346 194.8 346.2 194.8 346.5 194.9C404.4 207.1 447.9 258.6 447.9 320.1C447.9 390.8 390.6 448.1 319.9 448.1C258.3 448.1 206.9 404.6 194.7 346.7C192.9 338.1 191.9 329.2 191.9 320.1C191.9 309.1 193.3 298.3 195.9 288.1C196.1 287.4 196.2 286.8 196.4 286.2C208.3 242.8 242.5 208.6 285.9 196.7z"/></svg>'
        actionButtonElement.innerHTML = eyeIcon

        // Create anchor and append button
        const anchorElement = document.createElement('a')
        anchorElement.style.margin = 'auto'
        anchorElement.href = `/pages/consult-user/consult-user.html?id=${user.id}`
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
} catch (e) { console.log(e) }