import { AuthService } from '/shared/services/auth-service.js'
import { CourseService } from '/shared/services/course-service.js'
import { CourseComponentService } from '/shared/services/course-component-service.js'
import { ClassService } from '/shared/services/class-service.js'
import { ListCourses } from '/shared/models/course.js'
import { showMessage } from '/shared/components/toast.component.js'
import { setLoading } from '/shared/components/loading-button.js'
import { DateHelper } from '/shared/helpers/date-helper.js'
import { ArrayHelper } from '/shared/helpers/array-helper.js'
import { CreateClass } from '/shared/models/class.js'
import { WeekDays } from '/shared/constants/week-days.js'
import { ApiHelper } from '/shared/helpers/api-helper.js'

const courseElement = document.querySelector('#course')

let courses = []

// Load courses
async function loadCourses() {
    const loggedUser = AuthService.getLoggedUser()
    const searchObject = new ListCourses(
        null,
        true,
        null,
        null,
        loggedUser?.educationalUnitId,
        1,
        1000
    )
    const response = await CourseService.list(searchObject)
    
    if (!response.ok) {
        showMessage(await ApiHelper.getResponseError(response))

        return
    }

    courses = await response.json()

    for (const course of courses) {
        const option = document.createElement('option')
        option.value = course.id
        option.textContent = course.name
        courseElement.appendChild(option)
    }
}
await loadCourses()

// Adjust seats
const seatLimitElement = document.querySelector('#total-seats')
seatLimitElement.value = 0
courseElement.addEventListener('click', () => {
    if (!courseElement.value) {
        seatLimitElement.value = 0

        return
    }

    const result = courses.filter((course) => course.total_seat_limit > 0)[0]
    seatLimitElement.value = result.total_seat_limit ?? 0

    const takeSeatsElement = document.querySelector('#take-seats')
    takeSeatsElement.max = result.total_seat_limit ?? 0
})

// Load components
async function loadComponents() {
    if (courseElement.value && courseElement.value != '') {
        const response = await CourseComponentService.list(courseElement.value)

        if (!response.ok) {
            showMessage(await ApiHelper.getResponseError(response))

            return
        }

        const components = await response.json()
        const courseComponentElement = document.querySelector('#course-component')
        const firstComponent = courseComponentElement.firstElementChild
        courseComponentElement.replaceChildren(firstComponent)

        for (const component of components) {
            const option = document.createElement('option')
            option.value = component.id
            option.textContent = component.name
            courseComponentElement.appendChild(option)
        }
    }

    return
}
courseElement.addEventListener('change', async () => await loadComponents())

// Configure dates
const initialDateElement = document.querySelector('#initial-date')
const endDateElement = document.querySelector('#end-date')

function addDays(date, days) {
    const d = new Date(date)
    d.setDate(d.getDate() + days)
    
    return d
}

// Start: min tomorrow
const tomorrow = addDays(new Date(), 1)
initialDateElement.min = DateHelper.toDateInputValue(tomorrow)

// End: min the day after tomorrow
const dayAfterTomorrow = addDays(new Date(), 2)
endDateElement.min = DateHelper.toDateInputValue(dayAfterTomorrow)

// When start changes, end must be at least the day after the new start
initialDateElement.addEventListener('change', () => {
    if (!initialDateElement.value) return

    const start = new Date(initialDateElement.value + 'T00:00:00')
    const endMin = addDays(start, 1)
    endDateElement.min = DateHelper.toDateInputValue(endMin)

    // if the current end is now invalid, clear
    if (endDateElement.value && endDateElement.value < endDateElement.min) {
        endDateElement.value = ''
    }
})

// Form
function getFormData() {
    const checked = document.querySelectorAll('input[name="week-day"]:checked')
    const weekDays = [... checked].map((cb => cb.value))

    return new CreateClass(
        document.querySelector('#course-component').value,
        document.querySelector('#initial-date').value,
        document.querySelector('#end-date').value,
        weekDays,
        document.querySelector('#take-seats').value,
    )
}

function validateFormData(formData) {
    const errors = []

    if (!formData.courseComponentId) {
        errors.push('Componente inválido')
    }

    if (!formData.startDate) {
        errors.push('Data inicial inválida')
    }

    if (!formData.endDate) {
        errors.push('Data final inválida')
    }

    if (!Array.isArray(formData.daysOfWeek)) {
        errors.push('Dia da semana inválido')
    } else if (formData.daysOfWeek.some((value) => !WeekDays.isValid(value))) {
        errors.push('Dia da semana inválido')
    }

    if (!formData.seatsToUse || formData.seatsToUse > seatLimitElement.value) {
        errors.push('Assentos reservados inválidos')
    }

    return errors
}

const submitButton = document.querySelector('#button-submit-form')
async function submitForm() {
    setLoading(submitButton, true, 'Enviando...')
    const formData = getFormData()
    const formDataErrors = validateFormData(formData)

    if (formDataErrors.length > 0) {
        showMessage(ArrayHelper.arrayToString(formDataErrors))
        setLoading(submitButton, false)

        return
    }

    const response = await ClassService.create(formData)

    if (!response.ok) {
        showMessage(await ApiHelper.getResponseError(response))
        setLoading(submitButton, false)

        return
    }

    const formElement = document.querySelector('form')
    formElement.reset()
    showMessage('Aulas criadas com sucesso')
    setLoading(submitButton, false)

    return
}
submitButton.addEventListener('click', async () => await submitForm())
