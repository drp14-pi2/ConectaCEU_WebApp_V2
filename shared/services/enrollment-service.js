import { config } from '/config.js'

export class EnrollmentService {
    static async getCourseEnrollments(courseId){
        return await fetch(`${config.apiUrl}/enrollment/course/${courseId}`)
    }
}
