import { config } from '/config.js'

export class EnrollmentService {
    static async getUserEnrollments(userId, active){
        const params = new URLSearchParams();

        if (active) params.set('active', active);

        let resource = `${config.apiUrl}/enrollment/user/${userId}`

        if (params.size) resource += `?${params}`

        return await fetch(resource)
    }

    static async getCourseEnrollments(courseId){
        return await fetch(`${config.apiUrl}/enrollment/course/${courseId}`)
    }

    static async enroll(userId, courseId){
        return await fetch(`${config.apiUrl}/enrollment`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                user_id: userId,
                course_id: courseId
            })
        })
    }

    static async unenroll(enrollmentId){
        return await fetch(`${config.apiUrl}/enrollment/${enrollmentId}/unenroll`, { method: 'PATCH' })
    }
}
