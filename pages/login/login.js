import { AuthService } from '/shared/services/auth-service.js'
import { pageRouting } from '/shared/constants/page-routing.js'
import { User } from '/shared/models/user.js'
import { storageKeys } from '/shared/constants/storage-keys.js'

// Submit form
const submitButton = document.getElementById('button-submit-form')
submitButton.addEventListener('click', async () => {
    submitButton.setAttribute('disabled', true)
    const userDocument = document.getElementById('user-document').value
    const password = document.getElementById('user-password').value
    const response = await AuthService.login(userDocument, password)

    if (!response.ok) {
        submitButton.removeAttribute('disabled')
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }
    else {
        const responseBody = await response.json()

        if (responseBody.access_token) {
            sessionStorage.setItem(storageKeys.authToken, responseBody.access_token)
            const responseUser = responseBody.user
            const user = new User(
                responseUser.id,
                responseUser.name,
                responseUser.email,
                responseUser.user_type_id,
                responseUser.educational_unit_id
            )

            sessionStorage.setItem(storageKeys.loggedUser, JSON.stringify(user))
            location.href = pageRouting.home
        }
        
        submitButton.removeAttribute('disabled')
    }
})
