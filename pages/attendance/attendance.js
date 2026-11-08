import { AttendanceService } from '/shared/services/attendance-service.js'
import { AuthService } from '/shared/services/auth-service.js'
import { CourseService } from '/shared/services/course-service.js'
import { ClassService } from '/shared/services/class-service.js'
import { EnrollmentService } from '/shared/services/enrollment-service.js'
import { UserService } from '/shared/services/user-service.js'
import { ApiHelper } from '/shared/helpers/api-helper.js'
import { DateHelper } from '/shared/helpers/date-helper.js'
import { ArrayHelper } from '/shared/helpers/array-helper.js'
import { showMessage } from '/shared/components/toast.component.js'
import { pageRouting } from '/shared/constants/page-routing.js'
import { ListUsers } from '/shared/models/user.js'
import { UserType } from '/shared/constants/user-type.js'

const params = new URLSearchParams(window.location.search);
const courseId = params.get('course');
const classId = params.get('class');
let course = {}

// Get course
async function getCourse() {
    const response = await CourseService.get(courseId)

    if (!response.ok) {
        await showMessage(await ApiHelper.getResponseError(response))

        if (document.referrer && new URL(document.referrer).origin === pageRouting.consultClass) {
            history.back()
        } else {
            location.href = pageRouting.root
        }
    }

    course = await response.json()
}
await getCourse()


// Get class
async function getClass() {
    const response = await ClassService.get(classId)

    if (!response.ok) {
        await showMessage(await ApiHelper.getResponseError(response))

        if (document.referrer && new URL(document.referrer).origin === pageRouting.consultClass) {
            history.back()
        } else {
            location.href = pageRouting.root
        }
    }

    const classFound = await response.json()

    const dateInput = document.querySelector('#date')
    dateInput.textContent = DateHelper.toDateDisplay(classFound.date)
}
await getClass()


// List users
async function listUsers(userIds) {
    if (userIds.length == 0) return

    const loggedUser = AuthService.getLoggedUser()
    const query = new ListUsers(
        null,
        null,
        null,
        null,
        UserType.STUDENT,
        true,
        loggedUser.educationalUnitId ? [ loggedUser.educationalUnitId ] : null,
        null,
        userIds,
        1,
        100
    )
    const response = await UserService.list(query)

    if (!response.ok) {
        showMessage(await ApiHelper.getResponseError(response))

        return
    }

    const responseBody = await response.json()

    return responseBody.users
}


// Show results
async function renderResults(enrollments) {
    if (enrollments.length == 0) return

    const tbodyElement = document.querySelector('.item-listing-result tbody')
    tbodyElement.replaceChildren()
    const userIds = enrollments.map(x => x.user_id)
    const users = await listUsers(userIds)

    if (!users) return

    for (const user of users) {
        // Create table row
        const trowElement = document.createElement('tr')
        trowElement.id = user.id

        // User name
        const userName = document.createElement('td')
        userName.textContent = user.name
        trowElement.appendChild(userName)

        // User document
        const userDocument = document.createElement('td')
        userDocument.textContent = user.document
        trowElement.appendChild(userDocument)

        // User phone
        const userPhone = document.createElement('td')
        userPhone.textContent = user.cellphone_number
        trowElement.appendChild(userPhone)

        // E-mail
        const emailCell = document.createElement('td')
        emailCell.textContent = user.email
        trowElement.appendChild(emailCell)

        // Select attandance
        // Create button
        const attendanceSelectElement = document.createElement('select')
        attendanceSelectElement.classList.add('attendance-select')

        // Add options
        const defaultOption = document.createElement('option')
        defaultOption.value = ''
        defaultOption.textContent = 'Selecionar'
        const attendedOption = document.createElement('option')
        attendedOption.value = '1'
        attendedOption.textContent = 'Presente'
        const inAnotherGroupOption = document.createElement('option')
        inAnotherGroupOption.value = '2'
        inAnotherGroupOption.textContent = 'Em outro grupo'
        const absentOption = document.createElement('option')
        absentOption.value = '3'
        absentOption.textContent = 'Faltou'
        attendanceSelectElement.append(defaultOption, attendedOption, inAnotherGroupOption, absentOption)

        // Create button cell and append anchor
        const attendanceSelectCell = document.createElement('td')
        attendanceSelectCell.classList.add('table-action-button-cell')
        attendanceSelectCell.appendChild(attendanceSelectElement)

        // Append cell to row
        trowElement.appendChild(attendanceSelectCell)

        // Append row to tbody
        tbodyElement.appendChild(trowElement)
    }
}


// Enrollments
async function getCourseEnrollments() {
    const response = await EnrollmentService.getCourseEnrollments(courseId)

    if (!response.ok) {
        showMessage(await ApiHelper.getResponseError(response))
        
        return
    }

    const enrollments = await response.json()

    if (enrollments.length == 0) return

    await renderResults(enrollments)
}
await getCourseEnrollments()


// Submit form
function getFormData() {
    const tbody = document.querySelector('tbody')
    const tableRows = tbody.children
    const attendances = []

    for (const row of tableRows) {
        attendances.push({
            user_id: row.id,
            class_attendance_type_id: Number(row.querySelector('.attendance-select').value)
        })
    }

    return {
        class_id: classId,
        attendances
    }
}
function validateFormData(formData) {
    const errors = []

    if (!formData.class_id) {
        errors.push('Erro ao definir curso')
    }

    const hasInvalidType = !formData.attendances.length
        || formData.attendances.some(x => ![1, 2, 3].includes(x.class_attendance_type_id))

    const hasMissingUser = formData.attendances.some(x => !x.user_id)

    if (hasInvalidType || hasMissingUser) {
        errors.push('Todas as presenças devem ser definidas')
    }

    return errors
}
const submitButton = document.querySelector('#button-submit-form')
async function submitForm() {
    const formData = getFormData()
    const formDataValidation = validateFormData(formData)

    if (formDataValidation.length > 0) {
        showMessage(ArrayHelper.arrayToString(formDataValidation))

        return
    }

    const response = await AttendanceService.create(formData)

    if (!response.ok) {
        showMessage(await ApiHelper.getResponseError(response))

        return
    }

    const responseBody = await response.json()

    if (responseBody.created || responseBody.updated) {
        showMessage('Chamada salva com sucesso')
    }
    else {
        showMessage('Erro ao salvar chamada')
    }
}
submitButton.addEventListener('click', async () => await submitForm())
