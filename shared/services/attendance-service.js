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

    static async getUserAttendance(userId, classId) {
        return await fetch(`${config.apiUrl}/attendance/user/${userId}/class/${classId}`)
    }

    static async submitAbsenceJustification(attendanceId, userId, base64) {
        return await fetch(`${config.apiUrl}/attendance/${attendanceId}/justify/user/${userId}`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                base64: base64,
                document_type_id: 7,
                is_front: null,
                user_id: userId,
                legal_representative_id: null
            })
        })
    }
}
