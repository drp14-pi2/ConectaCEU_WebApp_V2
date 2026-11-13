export class SendBroadcast {
    subject
    message
    documents
    sendEmail
    sendWhatsapp
    sendSms
    recipientUserIds
    recipientCourseId
    recipientUserTypeId
    educationalUnitsIds

    constructor(
        subject,
        message,
        documents,
        sendEmail,
        sendWhatsapp,
        sendSms,
        recipientUserIds,
        recipientCourseId,
        recipientUserTypeId,
        educationalUnitsIds) {
        this.subject = subject
        this.message = message
        this.documents = documents
        this.sendEmail = sendEmail
        this.sendWhatsapp = sendWhatsapp
        this.sendSms = sendSms
        this.recipientUserIds = recipientUserIds
        this.recipientCourseId = recipientCourseId
        this.recipientUserTypeId = recipientUserTypeId
        this.educationalUnitsIds = educationalUnitsIds
    }
}
