import { AuthService } from '/shared/services/auth-service.js'
import { pageRouting } from '/shared/constants/page-routing.js'
import { User } from '/shared/models/user.js'
import { storageKeys } from '/shared/constants/storage-keys.js'
import { setLoading } from '/shared/components/loading-button.js'
import { showMessage } from '/shared/components/toast.component.js'

// Submit form
const submitButton = document.getElementById('button-submit-form')
submitButton.addEventListener('click', async () => {
    setLoading(submitButton, true, 'Enviando...')
    const userDocument = document.getElementById('user-document').value
    const password = document.getElementById('user-password').value

    if (!userDocument || !password) {
        setLoading(submitButton, false)
        showMessage('Credenciais inválidas');
        
        return
    }
    
    const response = await AuthService.login(userDocument, password)

    if (!response.ok) {
        setLoading(submitButton, false)
        showMessage(await response.text());
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
        
        setLoading(submitButton, false)
    }
})
