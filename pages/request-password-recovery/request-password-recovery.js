import { pageRouting } from '/shared/constants/page-routing.js'
import { config } from '/config.js'
import { showMessage } from '/shared/components/toast.component.js'

// Submit form
const submitButton = document.getElementById('button-submit-form')
submitButton.addEventListener('click', async () => {
    const emailInput = document.getElementById('email')
    const emailString = emailInput.value

    if (!isValidEmail(emailString)) {
        await showMessage("E-mail inválido")

        return
    }

    const response = await fetch(`${config.apiUrl}/password/reset/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailString })
    })

    emailInput.value = ''

    if (!response.ok) {
        await showMessage(await response.text());
    }
    else {
        const responseBody = await response.json()

        if (responseBody.message) {
            await showMessage(responseBody.message)
            location.href = pageRouting.root
        }
    }
})

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return re.test(String(email).trim());
}
