import { ListUsers } from '/shared/models/user.js'
import { UserType } from '/shared/constants/user-type.js'
import { ShiftType } from '/shared/constants/shift-type.js'
import { AuthService } from '/shared/services/auth-service.js'
import { UserService } from '/shared/services/user-service.js'
import { EducationalUnitService } from '/shared/services/educational-unit-service.js'
import { CourseService } from '/shared/services/course-service.js'
import { ReferenceService } from '/shared/services/reference-service.js'
import { showMessage } from '/shared/components/toast.component.js'
import { setLoading } from '/shared/components/loading-button.js'
import { CreateCourse } from '/shared/models/course.js'
import { ArrayHelper } from '/shared/helpers/array-helper.js'
import { CreateComponent } from '/shared/models/component.js'
import { ApiHelper } from '/shared/helpers/api-helper.js'

// Shift type
async function setShiftTypes() {
    const response = await ReferenceService.getShiftTypes()

    if (!response.ok) {
        showMessage(await ApiHelper.getResponseError(response))

        return
    }

    const shiftTypes = await response.json()
    const shiftTypeSelectElement = document.querySelector('#shift-type')

    for (const type of shiftTypes) {
        const typeOption = document.createElement('option')
        typeOption.value = type.id
        typeOption.textContent = type.description
        shiftTypeSelectElement.appendChild(typeOption)
    }
}

await setShiftTypes()

// Educational units
async function setEducationalUnits() {
    const loggedUser = AuthService.getLoggedUser()

    if (loggedUser && loggedUser.educationalUnitId) {
        const response = await EducationalUnitService.get(loggedUser.educationalUnitId)

        if (!response.ok) {
            await showMessage(await ApiHelper.getResponseError(response))

            return
        }

        const educationalUnitSelectElement = document.querySelector('#educational-unit')
        const educationalUnit = await response.json()
        const unitOption = document.createElement('option')
        unitOption.value = educationalUnit.id
        unitOption.innerText = educationalUnit.name
        educationalUnitSelectElement.appendChild(unitOption)
    }
    else {
        const response = await EducationalUnitService.list()

        if (!response.ok) {
            await showMessage(await ApiHelper.getResponseError(response))

            return
        }

        const educationalUnitSelectElement = document.querySelector('#educational-unit')
        const educationalUnits = await response.json()

        for (const unit of educationalUnits) {
            const unitOption = document.createElement('option')
            unitOption.value = unit.id
            unitOption.innerText = unit.name
            educationalUnitSelectElement.appendChild(unitOption)
        }
    }
}

await setEducationalUnits()

// Educators
let educators = []

async function listEducators() {
    const loggedUser = AuthService.getLoggedUser()
    const body = new ListUsers(
        null,
        null,
        null,
        null,
        UserType.EDUCATOR,
        true,
        loggedUser.educationalUnitId ? [ loggedUser.educationalUnitId ] : null,
        null,
        1,
        100
    )
    const response = await UserService.list(body)

    if (!response.ok) {
        showMessage(await ApiHelper.getResponseError(response))

        return
    }

    const responseBody = await response.json()

    educators = responseBody.users
}


async function setEducators(educatorSelectElement) {
    if (educators.length <= 1) await listEducators()

    for (const educator of educators) {
        const educatorOption = document.createElement('option')
        educatorOption.value = educator.id
        educatorOption.textContent = educator.name
        educatorSelectElement.appendChild(educatorOption)
    }
}

const selectResponsibleEducator1Element = document.querySelector('#responsible-educator-1')

if (selectResponsibleEducator1Element.childElementCount == 1) {
    await setEducators(selectResponsibleEducator1Element)
}

selectResponsibleEducator1Element.addEventListener('change', async () => {
    const responsibleEducator2Element = document.querySelector('.responsible-educator-2')

    if (selectResponsibleEducator1Element.value) {
        if (getComputedStyle(responsibleEducator2Element).display != 'flex') {
            responsibleEducator2Element.style.display = 'flex'
        }

        const responsibleEducator2SelectElement = document.querySelector('#responsible-educator-2')

        if (responsibleEducator2SelectElement.childElementCount == 1) {
            await setEducators(responsibleEducator2SelectElement)
        }
    }
    else {
        if (getComputedStyle(responsibleEducator2Element).display != 'none') {
            responsibleEducator2Element.style.display = 'none'
        }
    }
})


// Components
const container = document.querySelector('.components-container')

// Icons
const PLUS_ICON = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" fill="currentColor"><path d="M352 128C352 110.3 337.7 96 320 96C302.3 96 288 110.3 288 128L288 288L128 288C110.3 288 96 302.3 96 320C96 337.7 110.3 352 128 352L288 352L288 512C288 529.7 302.3 544 320 544C337.7 544 352 529.7 352 512L352 352L512 352C529.7 352 544 337.7 544 320C544 302.3 529.7 288 512 288L352 288L352 128z"/></svg>'
const MINUS_ICON = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" fill="currentColor"><path d="M96 320C96 302.3 110.3 288 128 288L512 288C529.7 288 544 302.3 544 320C544 337.7 529.7 352 512 352L128 352C110.3 352 96 337.7 96 320z"/></svg>'

// Unique id helper (counter fallback if crypto.randomUUID absent)
let rowCounter = 0
function nextRowId() { return `component-row-${++rowCounter}` }

// Row builder
function makeRow() {
    const rowId = nextRowId()

    const row = document.createElement('div')
    row.classList.add('form-row', 'form-row-col-2', 'input-row-with-textarea', 'component-row')

    // Name field
    const nameContainer = document.createElement('div')
    nameContainer.classList.add('input-container')

    const nameLabel = document.createElement('label')
    nameLabel.htmlFor = `${rowId}-name`
    nameLabel.append('Nome do componente ')
    const nameRequired = document.createElement('span')
    nameRequired.classList.add('color-red')
    nameRequired.textContent = '*'
    nameLabel.appendChild(nameRequired)

    const nameInput = document.createElement('input')
    nameInput.type = 'text'
    nameInput.name = 'component-name'
    nameInput.id = `${rowId}-name`
    nameInput.placeholder = 'ex: Vôlei'
    nameInput.required = true

    nameContainer.append(nameLabel, nameInput)

    // Description field
    const descContainer = document.createElement('div')
    descContainer.classList.add('input-container')

    const descLabel = document.createElement('label')
    descLabel.htmlFor = `${rowId}-description`
    descLabel.append('Descrição ')
    const descRequired = document.createElement('span')
    descRequired.classList.add('color-red')
    descRequired.textContent = '*'
    descLabel.appendChild(descRequired)

    const descTextarea = document.createElement('textarea')
    descTextarea.name = 'description'
    descTextarea.id = `${rowId}-description`
    descTextarea.placeholder = 'Descreva o componente...'
    descTextarea.required = true

    descContainer.append(descLabel, descTextarea)

    // Assemble
    row.append(nameContainer, descContainer)

    return row
}

// Action button builder
function makeActionButton({ icon, label, side, onClick }) {
    const btn = document.createElement('div')
    btn.classList.add('action-button', side)
    btn.setAttribute('aria-label', label)
    btn.innerHTML = icon
    btn.addEventListener('click', onClick)

    return btn
}

// Render controls
function renderControls() {
    const rows = [...container.querySelectorAll('.component-row')]
    const lastIndex = rows.length - 1

    rows.forEach((row, index) => {
        // Strip any existing control row from every row
        row.querySelector('.horizontal-action-button-row')?.remove()

        // Only the last row gets controls
        if (index !== lastIndex) return

        const controlRow = document.createElement('div')
        controlRow.classList.add('horizontal-action-button-row')

        // Remove button. Rendered only when there's more than one row
        if (rows.length > 1) {
            controlRow.appendChild(makeActionButton({
                icon: MINUS_ICON,
                label: 'Remover componente',
                side: 'round-first-child',
                onClick: () => {
                    row.remove()
                    renderControls()
                },
            }))
        }

        // Add button
        controlRow.appendChild(makeActionButton({
            icon: PLUS_ICON,
            label: 'Adicionar componente',
            side: rows.length > 1 ? 'round-last-child' : 'round',
            onClick: () => {
                container.appendChild(makeRow())
                renderControls()
            },
        }))

        row.appendChild(controlRow)
    })
}

// Initialize with one row and add button only
container.replaceChildren(makeRow())
renderControls()


// Form
function getFormData() {
    const componentRows = document.querySelectorAll('.components-container .component-row')
    const components = []
    
    for (const row of componentRows) {
        const name = row.querySelector('[name="component-name"]')?.value.trim() ?? ''
        const description = row.querySelector('[name="description"]')?.value.trim() ?? ''

        // skip rows where both fields are empty
        if (!name && !description) continue

        components.push(new CreateComponent(name, description))
    }

    return new CreateCourse(
        document.querySelector('#course-name').value,
        document.querySelector('#seat-limit').value,
        document.querySelector('#workload').value,
        document.querySelector('#min-age').value,
        document.querySelector('#max-age').value,
        document.querySelector('#shift-type').value,
        document.querySelector('#responsible-educator-1').value,
        document.querySelector('#responsible-educator-2').value,
        document.querySelector('#educational-unit').value,
        components.length > 0 ? components : null
    )
}

function validateFormData(formData) {
    const errors = []

    if (formData.name.length < 5 || formData.name.length > 100) {
        errors.push('Nome do curso deve conter entre 5 e 100 caracteres')
    }

    if (formData.totalSeatLimit < 1) {
        errors.push('Quantidade de vagas inválida')
    }

    if (formData.workload < 1) {
        errors.push('Carga horária inválida')
    }

    if (formData.minStudentAge < 4) {
        errors.push('A idade mínima permitida é 4 anos')
    }

    if (formData.maxStudentAge > 100) {
        errors.push('A idade máxima permitida é 100 anos')
    }

    if (!ShiftType.isValid(formData.shiftTypeId)) {
        errors.push('Turno inválido')
    }

    if (!formData.educationalUnitId) {
        errors.push('CEU é obrigatório')
    }

    if (!formData.responsibleEducator1) {
        errors.push('Educador responsável 1 é obrigatório')
    }

    if (formData.responsibleEducator2 && (formData.responsibleEducator1 == formData.responsibleEducator2)) {
        errors.push('Os responsáveis não podem ser iguais')
    }

    if (formData.responsibleEducator2 && (formData.responsibleEducator1 == formData.responsibleEducator2)) {
        errors.push('Os responsáveis não podem ser iguais')
    }

    if (formData.components.length > 0) {
        for (const component of formData.components) {
            if (component.name.length < 3 || component.name.length > 100) {
                errors.push(`Nome do componente ${component.name} precisa ter entre 3 e 100 caracteres`)
            }

            if (component.description.length < 10 || component.description.length > 500) {
                errors.push(`Descrição do componente ${component.name} precisa ter entre 10 e 500 caracteres`)
            }
        }
    }
    
    return errors
}

const submitButton = document.querySelector('#button-submit-form')
async function submitForm() {
    setLoading(submitButton, true, 'Enviando...')
    const formData = getFormData()
    const validationErrors = validateFormData(formData)

    if (validationErrors.length > 0) {
        showMessage(ArrayHelper.arrayToString(validationErrors))
        setLoading(submitButton, false)

        return
    }

    console.log(JSON.stringify(formData))
    const response = await CourseService.create(formData)

    if (!response.ok) {
        showMessage(await ApiHelper.getResponseError(response))
        setLoading(submitButton, false)

        return
    }

    showMessage('Curso criado com sucesso')
    setLoading(submitButton, false)

    return
}
submitButton.addEventListener('click', async () => await submitForm())
