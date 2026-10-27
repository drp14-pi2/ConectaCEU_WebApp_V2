import { storageKeys } from '/shared/constants/storage-keys.js'
import { pageRouting } from '/shared/constants/page-routing.js'
import { config } from '/config.js'

// Submit form
const submitButton = document.getElementById('button-submit-form')
submitButton.addEventListener('click', async () => {
    submitButton.setAttribute('disabled', true)
    const userDocument = document.getElementById('user-document').value
    const password = document.getElementById('user-password').value

    const response = await fetch(`${config.apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            document: userDocument,
            password: password
        })
    })

    if (!response.ok) {
        submitButton.removeAttribute('disabled')
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }
    else {
        const responseBody = await response.json()

        if (responseBody.access_token) {
            sessionStorage.setItem(storageKeys.authToken, responseBody.access_token)
            location.href = pageRouting.home
        }
        
        submitButton.removeAttribute('disabled')
    }
})
