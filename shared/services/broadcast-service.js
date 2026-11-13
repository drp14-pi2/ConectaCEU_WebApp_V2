import { config } from '/config.js'

export class BroadcastService {
    static async send(formData) {
        return await fetch(`${config.apiUrl}/broadcast`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                subject: formData.subject,
                message: formData.message,
                documents: formData.documents,
                send_email: formData.sendEmail,
                send_whatsapp: formData.sendWhatsapp,
                send_sms: formData.sendSms,
                recipient_user_ids: formData.recipientUserIds,
                recipient_course_id: formData.recipientCourseId,
                recipient_user_type_id: formData.recipientUserTypeId,
                educational_units_ids: formData.educationalUnitsIds
            })
        })
    }
}
