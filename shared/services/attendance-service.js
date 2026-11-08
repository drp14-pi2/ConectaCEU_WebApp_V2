import { config } from '/config.js'

export class AttendanceService {
    static async create(formData) {
        return await fetch(`${config.apiUrl}/attendance/class/take`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
    }
}
