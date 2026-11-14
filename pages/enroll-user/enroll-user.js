import { UserService } from '/shared/services/user-service.js'
import { AuthService } from '/shared/services/auth-service.js'
import { DocumentService } from '/shared/services/document-service.js'
import { EnrollmentService } from '/shared/services/enrollment-service.js'
import { CourseService } from '/shared/services/course-service.js'
import { showMessage } from '/shared/components/toast.component.js'
import { ApiHelper } from '/shared/helpers/api-helper.js'
import { pageRouting } from '/shared/constants/page-routing.js'
import { DateHelper } from '/shared/helpers/date-helper.js'
import { StyleHelper } from '/shared/helpers/style-helper.js'
import { SexType } from '/shared/constants/sex-type.js'
import { GenderType } from '/shared/constants/gender-type.js'
import { ShiftType } from '/shared/constants/shift-type.js'
import { UserType } from '/shared/constants/user-type.js'
import { DocumentType } from '/shared/constants/document-type.js'
import { openPopup } from '/shared/components/popup.js'
import { ListCourses } from '/shared/models/course.js'

const loggedUser = AuthService.getLoggedUser()
function getUserId() {
    const params = new URLSearchParams(window.location.search)
    const queryId = params.get('id')

    if (queryId && queryId != loggedUser.id && loggedUser.userTypeId != UserType.STUDENT) {
        return queryId
    }
    else if (loggedUser.userTypeId == UserType.STUDENT) {
        return loggedUser.id
    }
    else {
        if (document.referrer && new URL(document.referrer).origin === pageRouting.enrollUsers) {
            history.back()
        } else {
            location.href = pageRouting.root
        }
    }
}
const userId = getUserId()
let user = {}


// Documents
async function getUserIdentityDocumentType() {
    const response = await DocumentService.getUserDocuments(userId)

    if (!response.ok) return

    const responseBody = await response.json()
    const identityDocumentTypes = [DocumentType.CPF, DocumentType.RG, DocumentType.CIN]
    const identityDocument = responseBody.length > 0
        ? responseBody.find((x) =>
            identityDocumentTypes.includes(x.document_type_id)
            && x.legal_representative_id === null)
        : null

    return identityDocument?.document_type_id
}


// User enrollments
async function getUserEnrollments() {
    const response = await EnrollmentService.getUserEnrollments(user.id, true)

    if (!response.ok) {
        showMessage(await ApiHelper.getResponseError(response))

        return
    }

    return await response.json()
}


// Get course
async function getCourse(courseId) {
    const response = await CourseService.get(courseId)

    if (!response.ok) {
        showMessage(await ApiHelper.getResponseError(response))

        return
    }

    return await response.json()
}


// User
async function getUser() {
    const response = await UserService.get(userId)

    if (!response.ok) {
        showMessage(await ApiHelper.getResponseError(response))

        if (document.referrer) {
            const origin =  new URL(document.referrer).origin

            if (origin === pageRouting.consultEducator || origin === pageRouting.consultStudent) {
                history.back()
            }
        } else {
            location.href = pageRouting.root
        }

        return
    }

    user = await response.json()

    // Page title
    const pageTitleElement = document.querySelector('#page-title')
    pageTitleElement.textContent = user.user_type_id == loggedUser.userTypeId ? 'Me matricular' : 'Matricular discente'

    // Identity document
    const identityDocumentType = await getUserIdentityDocumentType()
    const documentTypeElement = document.querySelector('#select-document-type')
    const documentTypeOption = document.createElement('option')
    documentTypeOption.textContent = DocumentType.getName(identityDocumentType)
    documentTypeElement.appendChild(documentTypeOption)
    
    // Document
    const userDocumentElement = document.querySelector('#user-document')
    userDocumentElement.value = user.document

    // E-mail
    const emailElement = document.querySelector('#email')
    emailElement.value = user.email

    // Name
    const userNameElement = document.querySelector('#userName')
    userNameElement.value = user.name

    // Birthdate
    const birthdateElement = document.querySelector('#birthdate')
    birthdateElement.value = DateHelper.toDateInputValue(user.birthdate)

    // Phone number
    const phoneElement = document.querySelector('#phone')
    phoneElement.value = user.cellphone_number

    if (user.contact_cellphone_number) {
        const secondPhoneElement = document.querySelector('#secondPhone')
        secondPhoneElement.value = user.contact_cellphone_number
    }

    // Sex
    const sexElement = document.querySelector('#sex')
    const sexOptionElement = document.createElement('option')
    sexOptionElement.textContent = SexType.getName(user.sex_id)
    sexElement.appendChild(sexOptionElement)

    // Gender
    const genderElement = document.querySelector('#gender')
    const genderOptionElement = document.createElement('option')
    genderOptionElement.textContent = GenderType.getName(user.gender_id)
    genderElement.appendChild(genderOptionElement)
}
await getUser()


// Render user enrollments
async function renderUserEnrollments() {
    const enrollments = await getUserEnrollments()

    if (enrollments.length == 0) return

    const enrollmentTableBodyElement = document.querySelector('.enrollment-table tbody')

    for (const enrollment of enrollments) {
        // Get course
        const course = await getCourse(enrollment.course_id)

        // Create row
        const newRowElement = document.createElement('tr')

        // Course name
        const courseNameElement = document.createElement('td')
        courseNameElement.textContent = course.name
        newRowElement.appendChild(courseNameElement)

        // Shift
        const shiftElement = document.createElement('td')
        shiftElement.textContent = ShiftType.getName(course.shift_type_id)
        newRowElement.appendChild(shiftElement)

        // Cancel enrollment button
        // Create button
        const cancelEnrollmentElement = document.createElement('button')
        cancelEnrollmentElement.classList.add('actionButton', 'cancel-button')

        // Icons
        const xMarkIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M18.3 5.71a1 1 0 0 0-1.42 0L12 10.59 7.12 5.71A1 1 0 0 0 5.7 7.12L10.59 12l-4.89 4.88a1 1 0 1 0 1.42 1.42L12 13.41l4.88 4.89a1 1 0 0 0 1.42-1.42L13.41 12l4.89-4.88a1 1 0 0 0 0-1.41z"/></svg>'
        cancelEnrollmentElement.innerHTML = xMarkIcon

        // Create anchor and append button
        const anchorElement = document.createElement('a')
        anchorElement.style.margin = 'auto'
        anchorElement.addEventListener('click', async () => {
            const cancelEnrollmentText = `Deseja mesmo cancelar a matrícula no curso <span class="bold">${course.name}</span>?`
            openPopup({
                title: 'Cancelar matrícula',
                content: cancelEnrollmentText,
                buttons: [
                    {
                        label: 'Confirmar',
                        onClick: async () => {
                            const unenrollResponse = await EnrollmentService.unenroll(enrollment.id)

                            if (!unenrollResponse.ok) {
                                showMessage(await ApiHelper.getResponseError(unenrollResponse))

                                return
                            }

                            await showMessage('Matrícula cancelada com sucesso')
                            location.reload()
                        },
                        variants: ['cancel-button']
                    },
                ]
            })
        })
        anchorElement.appendChild(cancelEnrollmentElement)

        // Create button cell and append anchor
        const actionButtonCell = document.createElement('td')
        actionButtonCell.classList.add('table-action-button-cell')
        actionButtonCell.appendChild(anchorElement)

        // Append button to row
        newRowElement.appendChild(actionButtonCell)

        // Append row to table
        enrollmentTableBodyElement.appendChild(newRowElement)
    }
}
await renderUserEnrollments()


// Render courses
async function renderCourses(courses) {
    const coursesTableBodyElement = document.querySelector('.courses-table tbody')
    const coursesResultElement = document.querySelector('.courses-result')

    if (courses.length == 0) {
        coursesTableBodyElement.replaceChildren()
        StyleHelper.setDisplay(coursesResultElement, 'none')

        return
    }

    StyleHelper.setDisplay(coursesResultElement, 'flex')

    for (const course of courses) {
        // Create row
        const newRowElement = document.createElement('tr')

        // Course name
        const courseNameElement = document.createElement('td')
        courseNameElement.textContent = course.name
        newRowElement.appendChild(courseNameElement)

        // Shift
        const shiftElement = document.createElement('td')
        shiftElement.textContent = ShiftType.getName(course.shift_type_id)
        newRowElement.appendChild(shiftElement)

        // Seat limit
        const seatLimitElement = document.createElement('td')
        seatLimitElement.textContent = course.total_seat_limit
        newRowElement.appendChild(seatLimitElement)

        // Workload
        const workloadElement = document.createElement('td')
        workloadElement.textContent = course.workload
        newRowElement.appendChild(workloadElement)

        // Min student age
        const minStudentAgeElement = document.createElement('td')
        minStudentAgeElement.textContent = course.min_student_age ?? '0'
        newRowElement.appendChild(minStudentAgeElement)

        // Max student age
        const maxStudentAgeElement = document.createElement('td')
        maxStudentAgeElement.textContent = course.max_student_age ?? '0'
        newRowElement.appendChild(maxStudentAgeElement)

        // Enroll button
        // Create button
        const enrollElement = document.createElement('button')
        enrollElement.classList.add('actionButton')

        // Icons
        const penIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" fill="currentColor"><path d="M432.5 82.3L382.4 132.4L507.7 257.7L557.8 207.6C579.7 185.7 579.7 150.3 557.8 128.4L511.7 82.3C489.8 60.4 454.4 60.4 432.5 82.3zM343.3 161.2L342.8 161.3L198.7 204.5C178.8 210.5 163 225.7 156.4 245.5L67.8 509.8C64.9 518.5 65.9 528 70.3 535.8L225.7 380.4C224.6 376.4 224.1 372.3 224.1 368C224.1 341.5 245.6 320 272.1 320C298.6 320 320.1 341.5 320.1 368C320.1 394.5 298.6 416 272.1 416C267.8 416 263.6 415.4 259.7 414.4L104.3 569.7C112.1 574.1 121.5 575.1 130.3 572.2L394.6 483.6C414.3 477 429.6 461.2 435.6 441.3L478.8 297.2L478.9 296.7L343.4 161.2z"/></svg>'
        enrollElement.innerHTML = penIcon

        // Create anchor and append button
        const anchorElement = document.createElement('a')
        anchorElement.style.margin = 'auto'
        anchorElement.addEventListener('click', async () => {
            const cancelEnrollmentText = `Deseja mesmo realizar a matrícula no curso <span class="bold">${course.name}</span>?`
            openPopup({
                title: 'Matricular',
                content: cancelEnrollmentText,
                buttons: [
                    {
                        label: 'Confirmar',
                        onClick: async () => {
                            const enrollResponse = await EnrollmentService.enroll(user.id, course.id)

                            if (!enrollResponse.ok) {
                                showMessage(await ApiHelper.getResponseError(enrollResponse))

                                return
                            }

                            await showMessage('Matrícula realizada com sucesso')
                            location.reload()
                        }
                    },
                ]
            })
        })
        anchorElement.appendChild(enrollElement)

        // Create button cell and append anchor
        const actionButtonCell = document.createElement('td')
        actionButtonCell.classList.add('table-action-button-cell')
        actionButtonCell.appendChild(anchorElement)

        // Append button to row
        newRowElement.appendChild(actionButtonCell)

        // Append row to table
        coursesTableBodyElement.appendChild(newRowElement)
    }
}


// List courses
async function listCourses() {
    const shiftType = document.querySelector('#shift-type').value
    const query = new ListCourses(
        null,
        true,
        null,
        shiftType ? Number(shiftType) : null,
        loggedUser.educationalUnitId,
        1,
        10)
    const response = await CourseService.list(query)

    if (!response.ok) {
        showMessage(await ApiHelper.getResponseError(response))

        return
    }

    const courses = await response.json()

    await renderCourses(courses)
}

// Submit search
const submitButton = document.querySelector('.search-button')
submitButton.addEventListener('click', async () => await listCourses())
