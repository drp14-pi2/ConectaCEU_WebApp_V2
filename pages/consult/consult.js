import { AuthService } from '/shared/services/auth-service.js'
import { UserType } from '/shared/constants/user-type.js'
import { StyleHelper } from '/shared/helpers/style-helper.js'

const loggedUser = AuthService.getLoggedUser()
const consultEducatorsButton = document.querySelector('#consult-educators-button')

if (loggedUser.userTypeId == UserType.COORDINATOR) {
    StyleHelper.setDisplay(consultEducatorsButton, 'flex')
}
else {
    StyleHelper.setDisplay(consultEducatorsButton, 'none')
}
