import { storageKeys } from '/shared/constants/storage-keys.js'
import { pageRouting } from '/shared/constants/page-routing.js'
import { config } from '/config.js'

// Submit form
const submitButton = document.getElementById('button-submit-form')
submitButton.addEventListener('click', async () => {
    const email = document.getElementById('email').value

    const response = await fetch(`${config.apiUrl}/password/reset/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email })
    })

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }
    else {
        const responseBody = await response.json()

        if (responseBody.access_token) {
            sessionStorage.setItem(storageKeys.authToken, responseBody.access_token)
            location.href = pageRouting.home
        }
    }
})
