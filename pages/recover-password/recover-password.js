import { pageRouting } from '/shared/constants/page-routing.js'
import { config } from '/config.js'
import { showMessage } from '/shared/components/toast.component.js'
import { Validator } from '/shared/validation/validator.js'

const params = new URLSearchParams(window.location.search);
const urlToken = params.get('token');

if (!urlToken) {
    location.href = pageRouting.home
}

const tokenValidationResponse = await fetch(`${config.apiUrl}/password/reset/validate?token=${urlToken}`, { method: 'GET' })
const tokenValidation = await tokenValidationResponse.json()

if (!tokenValidation?.valid) {
    location.href = pageRouting.root
}

// Submit form
const submitButton = document.getElementById('button-submit-form')
submitButton.addEventListener('click', async () => {
    submitButton.setAttribute('disabled', true)
    const newPassword = document.getElementById('new-password').value
    const repeatedPassword = document.getElementById('repeat-password').value
    const passwordValidation = Validator.validatePassword(newPassword)

    if (!passwordValidation.valid) {
        showMessage(passwordValidation.errors)
        submitButton.removeAttribute('disabled')

        return
    }

    if (newPassword != repeatedPassword) {
        showMessage("As senhas não batem")
        submitButton.removeAttribute('disabled')

        return
    }

    const response = await fetch(`${config.apiUrl}/password/reset`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            token: urlToken,
            new_password: newPassword
        })
    })

    if (!response.ok) {
        submitButton.removeAttribute('disabled')
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }
    else {
        const responseBody = await response.json()
        await showMessage(responseBody.message)
        location.href = pageRouting.home
    }
})
