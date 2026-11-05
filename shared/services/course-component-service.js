import { config } from '/config.js'

export class CourseComponentService {
    static async list(courseId) {
        return fetch(`${config.apiUrl}/component/course/${courseId}`)
    }
}
