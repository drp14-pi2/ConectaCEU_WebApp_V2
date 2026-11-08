import { config } from '/config.js'

export class ClassService {
    static async create(createClass) {
        return await fetch(`${config.apiUrl}/class`, {
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

    static async get(classId) {
        return await fetch(`${config.apiUrl}/class/${classId}`)
    }

    static async list(listClasses) {
        return await fetch(`${config.apiUrl}/class/list`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                component_id: listClasses.componentId,
                active: listClasses.active,
                start_date: listClasses.startDate,
                end_date: listClasses.endDate,
                page: listClasses.page,
                page_size: listClasses.pageSize
            })
        })
    }
}
