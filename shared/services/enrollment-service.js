import { config } from '/config.js'

export class EnrollmentService {
    static async getUserEnrollments(userId){
        return await fetch(`${config.apiUrl}/enrollment/user/${userId}`)
    }

    static async getCourseEnrollments(courseId){
        return await fetch(`${config.apiUrl}/enrollment/course/${courseId}`)
    }
}
