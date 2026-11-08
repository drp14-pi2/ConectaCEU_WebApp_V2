import { AuthService } from '/shared/services/auth-service.js'
import { UserType } from '/shared/constants/user-type.js'

const loggedUser = AuthService.getLoggedUser()
const consultEducatorsButton = document.querySelector('#consult-educators-button')

if (loggedUser.userTypeId == UserType.COORDINATOR) {
    if (getComputedStyle(consultEducatorsButton).display != 'flex') {
        consultEducatorsButton.style.display = 'flex'
    }
}
else {
    if (getComputedStyle(consultEducatorsButton).display != 'none') {
        consultEducatorsButton.style.display = 'none'
    }
}
