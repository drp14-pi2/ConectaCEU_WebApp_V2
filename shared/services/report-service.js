import { config } from '/config.js'

export class ReportService {
    static async getUserEnrollments(userId) {
        return await fetch(`${config.apiUrl}/report/user/${userId}/enrollments`)
    }
}
