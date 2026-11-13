import { SendBroadcast } from '/shared/models/broadcast.js'
import { AuthService } from '/shared/services/auth-service.js'
import { BroadcastService } from '/shared/services/broadcast-service.js'
import { ArrayHelper } from '/shared/helpers/array-helper.js'
import { showMessage } from '/shared/components/toast.component.js'
import { ApiHelper } from '/shared/helpers/api-helper.js'

function getFormData() {
    // Documents
    const fileInputs = document.getElementsByClassName('file-input__native')
    const document1 = fileInputs[0].files[0]
    const document2 = fileInputs[1].files[0]
    const documents = []

    if (document1) documents.push(document1)

    if (document2) documents.push(document2)

    // Means
    const checked = document.querySelectorAll('input[name="broadcast-mean"]:checked')
    const broadcastMeans = [... checked].map((cb => cb.value))
    const sendEmail = broadcastMeans[0] || false

    // Educational unit
    const loggedUser = AuthService.getLoggedUser()
    const educationalUnitId = loggedUser.educationalUnitId

    return new SendBroadcast(
        document.querySelector('#subject').value,
        document.querySelector('#message').value,
        documents ? documents : null,
        sendEmail,
        false,
        false,
        null,
        null,
        null,
        educationalUnitId ? [educationalUnitId] : null)
}

function validateFormData(formData) {
    const errors = []

    if (!formData.subject || (formData.subject.length < 5 || formData.subject.length > 200)) {
        errors.push('Assunto deve conter entre 5 e 200 caracteres')
    }

    if (!formData.message || (formData.message.length < 20 || formData.message.length > 4000)) {
        errors.push('Mensagem deve conter entre 20 e 4000 caracteres')
    }

    if (!formData.sendEmail && !formData.sendWhatsapp && !formData.sendSms) {
        errors.push('Ao menos um meio de comunicação deve ser selecionado')
    }

    return errors
}

const submitButton = document.querySelector('#button-submit-form')
async function submitForm() {
    const formData = getFormData()
    const formDataValidation = validateFormData(formData)

    if (formDataValidation.length > 0) {
        showMessage(ArrayHelper.arrayToString(formDataValidation))

        return
    }

    const response = await BroadcastService.send(formData)

    if (!response.ok) {
        showMessage(await ApiHelper.getResponseError(response))

        return
    }

    const responseBody = await response.json()

    if (!responseBody.email_sent && !responseBody.whatsapp_failed && !responseBody.sms_failed) {
        showMessage('Falha ao enviar mensagens')

        return
    }

    showMessage('Mensagem enviada com sucesso')
}
submitButton.addEventListener('click', async () => await submitForm())
