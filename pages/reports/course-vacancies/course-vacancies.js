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

        // Total seats
        const totalSeatsCell = document.createElement('td')
        totalSeatsCell.textContent = reportRow.total_seats
        trowElement.appendChild(totalSeatsCell)

        // Students enrolled
        const enrolledCell = document.createElement('td')
        enrolledCell.textContent = reportRow.enrolled
        trowElement.appendChild(enrolledCell)

        // Available seats
        const availableSeatsCell = document.createElement('td')
        availableSeatsCell.textContent = reportRow.available_seats
        trowElement.appendChild(availableSeatsCell)

        // Occupation rate
        const occupationRateCell = document.createElement('td')
        occupationRateCell.textContent = String(reportRow.occupation_rate).replace('.', ',')
        trowElement.appendChild(occupationRateCell)

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
    const response = await ReportService.getCourseVacancies(courseId, educationalUnitId)

    if (!response.ok) {
        showMessage(await ApiHelper.getResponseError(response))

        return
    }

    const reportData = await response.json()
    await renderResults(reportData)
}
submitButton.addEventListener('click', async () => await submitForm())

// Download
const downloadButton = document.querySelector('.download-button')
async function download(){
    const courseId = courseElement?.value
    const loggedUser = AuthService.getLoggedUser()
    const educationalUnitId = loggedUser?.educationalUnitId
    const response = await ReportService.getCourseVacanciesXlsx(courseId, educationalUnitId)

    if (!response.ok) {
        showMessage(await ApiHelper.getResponseError(response))

        return
    }

    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'vagas_por_curso.xlsx'
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
}
downloadButton.addEventListener('click', async () => await download())
