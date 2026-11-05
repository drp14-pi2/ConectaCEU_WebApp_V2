import { config } from '/config.js'

export class ClassService {
    static create(createClass) {
        return fetch(`${config.apiUrl}/class`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                course_component_id: createClass.courseComponentId,
                start_date: createClass.startDate,
                end_date: createClass.endDate,
                days_of_week: createClass.daysOfWeek,
                seats_to_use: createClass.seatsToUse
            })
        })
    }
}
