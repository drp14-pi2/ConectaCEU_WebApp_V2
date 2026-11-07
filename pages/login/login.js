import { AuthService } from '/shared/services/auth-service.js'
import { pageRouting } from '/shared/constants/page-routing.js'
import { User } from '/shared/models/user.js'
import { storageKeys } from '/shared/constants/storage-keys.js'
import { setLoading } from '/shared/components/loading-button.js'
import { showMessage } from '/shared/components/toast.component.js'
import { openPopup } from '/shared/components/popup.js'
import { ApiHelper } from '/shared/helpers/api-helper.js'

// Privacy policy
const openPrivacyPolicyBtn = document.querySelector('#openPrivacyPolicyBtn')
openPrivacyPolicyBtn.addEventListener('click', async () => {
    const response = await fetch('/pages/privacy-policy/privacy-policy.html')
    openPopup({
        title: 'Política de Privacidade',
        content: await response.text()
    })
})

// Terms of use
const openTermsOfUseBtn = document.querySelector('#openTermsOfUseBtn')
openTermsOfUseBtn.addEventListener('click', async () => {
    const response = await fetch('/pages/terms-of-use/terms-of-use.html')
    openPopup({
        title: 'Termos de Uso',
        content: await response.text()
    })
})

// Submit form
const submitButton = document.querySelector('#button-submit-form')
submitButton.addEventListener('click', async () => {
    setLoading(submitButton, true, 'Enviando...')
    const userDocument = document.querySelector('#user-document').value
    const password = document.querySelector('#user-password').value

    if (!userDocument || !password) {
        setLoading(submitButton, false)
        showMessage('Credenciais inválidas');
        
        return
    }
    
    const response = await AuthService.login(userDocument, password)

    if (!response.ok) {
        setLoading(submitButton, false)
        showMessage(await ApiHelper.getResponseError(response));
    }
    else {
        const responseBody = await response.json()

        if (responseBody.access_token) {
            sessionStorage.setItem(storageKeys.authToken, responseBody.access_token)
            sessionStorage.setItem(storageKeys.refreshToken, responseBody.refresh_token)
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
