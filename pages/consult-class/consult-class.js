import { AuthService } from '/shared/services/auth-service.js'
import { CourseService } from '/shared/services/course-service.js'
import { UserService } from '/shared/services/user-service.js'
import { CourseComponentService } from '/shared/services/course-component-service.js'
import { EnrollmentService } from '/shared/services/enrollment-service.js'
import { ClassService } from '/shared/services/class-service.js'
import { AttendanceService } from '/shared/services/attendance-service.js'
import { ListCourses } from '/shared/models/course.js'
import { ListClasses } from '/shared/models/class.js'
import { ApiHelper } from '/shared/helpers/api-helper.js'
import { DateHelper } from '/shared/helpers/date-helper.js'
import { showMessage } from '/shared/components/toast.component.js'
import { ShiftType } from '/shared/constants/shift-type.js'
import { UserType } from '/shared/constants/user-type.js'
import { AttendanceType } from '/shared/constants/attendance-type.js'
import { StyleHelper } from '/shared/helpers/style-helper.js'
import { FileHelper } from '/shared/helpers/file-helper.js'
import { openPopup } from '/shared/components/popup.js'

const loggedUser = AuthService.getLoggedUser()
const isLoggedUserStudent = loggedUser.userTypeId == UserType.STUDENT
const courseElement = document.querySelector('#course')
const courseComponentElement = document.querySelector('#courseComponent')
let courses = []
let selectedCourse = {}
let educators = []

// List courses
async function listCourses() {
    if (isLoggedUserStudent) {
        const enrollmentsResponse = await EnrollmentService.getUserEnrollments(loggedUser.id)

        if (!enrollmentsResponse.ok) {
            showMessage(await ApiHelper.getResponseError(response))

            return
        }

        const enrollments = await enrollmentsResponse.json()

        for (const enrollment of enrollments) {
            const courseResponse = await CourseService.get(enrollment.course_id)

            if (!courseResponse.ok) {
                showMessage(await ApiHelper.getResponseError(courseResponse))

                return
            }

            courses.push(await courseResponse.json())
        }
    }
    else {
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

        courses = await response.json()
    }

    for (const course of courses) {
        const option = document.createElement('option')
        option.value = course.id
        option.textContent = course.name
        courseElement.appendChild(option)
    }
}
await listCourses()


// List components
async function listComponents() {
    const response = await CourseComponentService.list(courseElement.value)

    if (!response.ok) {
        showMessage(await ApiHelper.getResponseError(response))

        return
    }

    const responseBody = await response.json()

    for (const courseComponent of responseBody) {
        const option = document.createElement('option')
        option.value = courseComponent.id
        option.textContent = courseComponent.name
        courseComponentElement.appendChild(option)
    }
}
courseElement.addEventListener('change', async () => {
    const componentContainer = document.querySelector('.component-container')

    while (courseComponentElement.children.length > 1) {
        courseComponentElement.lastElementChild.remove()
    }

    if (courseElement.value) {
        StyleHelper.setDisplay(componentContainer, 'flex')
        selectedCourse = courses.find(x => x.id == courseElement.value)

        await listComponents()
    }
    else {
        StyleHelper.setDisplay(componentContainer, 'none')

        selectedCourse = {}
    }
})


// List educators
async function listEducators() {
    if (educators.length > 0) return educators

    let educatorIds = [selectedCourse.responsible_educator_1]

    if (selectedCourse.responsible_educator_2) {
        educatorIds.push(selectedCourse.responsible_educator_2)
    }

    for (const id of educatorIds) {
        const response = await UserService.get(id)

        if (!response.ok) return

        educators.push(await response.json())
    }

    return educators
}


// Render results
async function renderResults(classes) {
    const resultContainer = document.querySelector('.item-listing-result')

    if (!classes) {
        StyleHelper.setDisplay(resultContainer, 'none')
        
        return
    }

    const theadElement = document.querySelector('thead > tr')

    if (isLoggedUserStudent) {
        const attendanceCell = document.createElement('td')
        attendanceCell.textContent = 'Presente'
        theadElement.appendChild(attendanceCell)

        const uploadJustificationCell = document.createElement('td')
        uploadJustificationCell.textContent = 'Justificativa'
        theadElement.appendChild(uploadJustificationCell)
    }
    else {
        const attendanceListCell = document.createElement('td')
        attendanceListCell.textContent = 'Chamada'
        theadElement.appendChild(attendanceListCell)
    }

    resultContainer.style.display = 'flex'

    const tbodyElement = document.querySelector('.item-listing-result tbody')
    tbodyElement.replaceChildren()

    for (const currentClass of classes) {
        // Create table row
        const trowElement = document.createElement('tr')

        // Seat limit
        const seatLimit = document.createElement('td')
        seatLimit.textContent = selectedCourse.total_seat_limit
        trowElement.appendChild(seatLimit)

        // Seats used
        const seatsInUse = document.createElement('td')
        seatsInUse.textContent = currentClass.seats_in_use
        trowElement.appendChild(seatsInUse)

        // Seats available
        const seatsAvailable = document.createElement('td')
        seatsAvailable.textContent = selectedCourse.total_seat_limit - currentClass.seats_in_use
        trowElement.appendChild(seatsAvailable)

        // Educator
        const educatorCell = document.createElement('td')
        const educators = await listEducators()
        const educatorNames = educators.map((x) => x.name)
        educatorCell.textContent = educatorNames ? educatorNames.join('/') : ''
        trowElement.appendChild(educatorCell)

        // Date
        const dateCell = document.createElement('td')
        dateCell.textContent = DateHelper.toDateDisplay(currentClass.date)
        trowElement.appendChild(dateCell)

        // Shift
        const shiftCell = document.createElement('td')
        shiftCell.textContent = ShiftType.getName(selectedCourse.shift_type_id)
        trowElement.appendChild(shiftCell)

        // Get attendance if user is student
        let attendance = null
        if (isLoggedUserStudent) {
            const attendanceResponse = await AttendanceService.getUserAttendance(loggedUser.id, currentClass.id)

            if (!attendanceResponse.ok) {
                showMessage(await ApiHelper.getResponseError(attendanceResponse))

                return
            }

            attendance = await attendanceResponse.json()

            // Attendance type
            const attendanceCell = document.createElement('td')
            attendanceCell.textContent = attendance ? AttendanceType.getName(attendance.class_attendance_type_id) : ''
            trowElement.appendChild(attendanceCell)
        }

        // Action button
        // Create button
        const actionButtonElement = document.createElement('button')
        actionButtonElement.classList.add('actionButton')
        
        // Create button cell
        const actionButtonCell = document.createElement('td')
        actionButtonCell.classList.add('table-action-button-cell')

        if (isLoggedUserStudent) {
            // Add absence justification upload button
            if (attendance?.class_attendance_type_id == 3) {
                // Icons
                const fileLinesIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" fill="currentColor"><path d="M342.6 41.4C330.1 28.9 309.8 28.9 297.3 41.4L169.3 169.4C156.8 181.9 156.8 202.2 169.3 214.7C181.8 227.2 202.1 227.2 214.6 214.7L288 141.3L288 576C288 593.7 302.3 608 320 608C337.7 608 352 593.7 352 576L352 141.3L425.4 214.7C437.9 227.2 458.2 227.2 470.7 214.7C483.2 202.2 483.2 181.9 470.7 169.4L342.7 41.4z"/></svg>'
                actionButtonElement.innerHTML = fileLinesIcon

                // Create anchor and append button
                const anchorElement = document.createElement('a')
                anchorElement.style.margin = 'auto'
                anchorElement.addEventListener('click', async () => {
                    const uploadJustificationHtml = `<dynamic-content src="/shared/components/form-file-input.html"></dynamic-content>`
                    openPopup({
                        title: 'Carregar justificativa',
                        content: uploadJustificationHtml,
                        buttons: [
                            {
                                label: 'Confirmar',
                                onClick: async () => {
                                    const fileInputs = document.getElementsByClassName('file-input__native')

                                    if (fileInputs.length == 0) {
                                        showMessage('A justificativa é obrigatória')

                                        return
                                    }

                                    const justification = fileInputs[0].files[0]

                                    if (!justification) {
                                        showMessage('A justificativa é obrigatória')

                                        return
                                    }

                                    const justificationUploadResponse = await AttendanceService.submitAbsenceJustification(
                                        attendance.id,
                                        loggedUser.id,
                                        await FileHelper.fileToBase64(justification))

                                    if (!justificationUploadResponse.ok) {
                                        showMessage(await ApiHelper.getResponseError(justificationUploadResponse))

                                        return
                                    }

                                    await showMessage('Justificativa enviada com sucesso')
                                    location.reload()
                                }
                            },
                        ]
                    })
                })
                anchorElement.appendChild(actionButtonElement)

                // Append anchor to button cell
                actionButtonCell.appendChild(anchorElement)
            }
        }
        else {
            // Icons
            const fileLinesIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" fill="currentColor"><path d="M192 112L304 112L304 200C304 239.8 336.2 272 376 272L464 272L464 512C464 520.8 456.8 528 448 528L192 528C183.2 528 176 520.8 176 512L176 128C176 119.2 183.2 112 192 112zM352 131.9L444.1 224L376 224C362.7 224 352 213.3 352 200L352 131.9zM192 64C156.7 64 128 92.7 128 128L128 512C128 547.3 156.7 576 192 576L448 576C483.3 576 512 547.3 512 512L512 250.5C512 233.5 505.3 217.2 493.3 205.2L370.7 82.7C358.7 70.7 342.5 64 325.5 64L192 64zM248 320C234.7 320 224 330.7 224 344C224 357.3 234.7 368 248 368L392 368C405.3 368 416 357.3 416 344C416 330.7 405.3 320 392 320L248 320zM248 416C234.7 416 224 426.7 224 440C224 453.3 234.7 464 248 464L392 464C405.3 464 416 453.3 416 440C416 426.7 405.3 416 392 416L248 416z"/></svg>'
            actionButtonElement.innerHTML = fileLinesIcon

            // Create anchor and append button
            const anchorElement = document.createElement('a')
            anchorElement.style.margin = 'auto'
            anchorElement.href = `/pages/attendance/attendance.html?course=${selectedCourse.id}&class=${currentClass.id}`
            anchorElement.appendChild(actionButtonElement)

            // Append anchor to button cell
            actionButtonCell.appendChild(anchorElement)
        }

        // Append cell to row
        trowElement.appendChild(actionButtonCell)

        // Append row to tbody
        tbodyElement.appendChild(trowElement)
    }
}


// Submit form
const submitButton = document.querySelector('.search-button')
async function submitForm() {
    const query = new ListClasses(
        courseComponentElement.value,
        true,
        null,
        null,
        pageNumber,
        pageSize
    )
    const response = await ClassService.list(query)

    if (!response.ok) {
        showMessage(await ApiHelper.getResponseError(response))

        return
    }

    const classes = await response.json()
    await renderResults(classes)
}
submitButton.addEventListener('click', async () => await submitForm())
