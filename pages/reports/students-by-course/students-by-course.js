import { AuthService } from '/shared/services/auth-service.js'
import { CourseService } from '/shared/services/course-service.js'
import { ReportService } from '/shared/services/report-service.js'
import { ListCourses } from '/shared/models/course.js'
import { ApiHelper } from '/shared/helpers/api-helper.js'
import { showMessage } from '/shared/components/toast.component.js'
import { ShiftType } from '/shared/constants/shift-type.js'
import { StyleHelper } from '/shared/helpers/style-helper.js'

const courseElement = document.querySelector('#course')

// List courses
async function listCourses() {
    const loggedUser = AuthService.getLoggedUser()
    const query = new ListCourses(
        null,
        true,
        null,
        null,
        loggedUser.educationalUnitId,
        1,
        500)
    const response = await CourseService.list(query)

    if (!response.ok) {
        showMessage(await ApiHelper.getResponseError(response))

        return
    }

    const courses = await response.json()

    for (const course of courses) {
        const option = document.createElement('option')
        option.value = course.id
        option.textContent = course.name
        courseElement.appendChild(option)
    }
}
await listCourses()


// Render results
async function renderResults(reportData) {
    const resultContainer = document.querySelector('.item-listing-result')

    if (!reportData) {
        StyleHelper.setDisplay(resultContainer, 'none')
        
        return
    }

    resultContainer.style.display = 'flex'

    const tbodyElement = document.querySelector('.item-listing-result tbody')
    tbodyElement.replaceChildren()

    for (const reportRow of reportData) {
        // Create table row
        const trowElement = document.createElement('tr')

        // Course name
        const courseNameCell = document.createElement('td')
        courseNameCell.textContent = reportRow.course_name
        trowElement.appendChild(courseNameCell)

        // Shift type
        const shiftTypeCell = document.createElement('td')
        shiftTypeCell.textContent = ShiftType.getName(reportRow.shift_type_id)
        trowElement.appendChild(shiftTypeCell)

        // Student name
        const studentNameCell = document.createElement('td')
        studentNameCell.textContent = reportRow.student_name
        trowElement.appendChild(studentNameCell)

        // Student document
        const studentDocumentCell = document.createElement('td')
        studentDocumentCell.textContent = reportRow.student_document
        trowElement.appendChild(studentDocumentCell)

        // Student phone
        const studentPhoneCell = document.createElement('td')
        studentPhoneCell.textContent = reportRow.student_phone
        trowElement.appendChild(studentPhoneCell)

        // Student email
        const studentEmailCell = document.createElement('td')
        studentEmailCell.textContent = reportRow.student_email
        trowElement.appendChild(studentEmailCell)

        // Append row to tbody
        tbodyElement.appendChild(trowElement)
    }
}


// Submit form
const submitButton = document.querySelector('.search-button')
async function submitForm() {
    const courseId = courseElement?.value
    const loggedUser = AuthService.getLoggedUser()
    const educationalUnitId = loggedUser?.educationalUnitId
    const response = await ReportService.getStudentsByCourse(courseId, educationalUnitId)

    if (!response.ok) {
        showMessage(await ApiHelper.getResponseError(response))

        return
    }

    const reportData = await response.json()
    await renderResults(reportData)
}
submitButton.addEventListener('click', async () => await submitForm())
