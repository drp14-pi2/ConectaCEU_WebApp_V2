import { AuthService } from '/shared/services/auth-service.js'
import { StringHelper } from '/shared/helpers/string-helper.js'
import { UserType } from '/shared/constants/user-type.js'

function getUserGreetings(fullName) {
    const firstName = fullName.split(' ')[0]

    return `Olá, ${StringHelper.capitalize(firstName)}!`
}

const loggedUser = AuthService.getLoggedUser()

// Builds greetings message with user's name
const userGreetingsElement = document.querySelector('.user-greetings')
userGreetingsElement.textContent = getUserGreetings(loggedUser.name)

if (loggedUser) {
    const mainElement = document.querySelector('main')
    const loggedUserType = loggedUser.userTypeId
    let menuComponentPath = '/pages/home/menu-components/'

    switch (loggedUserType) {
        case UserType.ADMINISTRATOR:
            menuComponentPath += 'administrator-menu.html'
            break
        case UserType.SECRETARY:
            menuComponentPath += 'secretary-menu.html'
            break
        case UserType.COORDINATOR:
            menuComponentPath += 'coordinator-menu.html'
            break
        case UserType.EDUCATOR:
            menuComponentPath += 'educator-menu.html'
            break
        case UserType.STUDENT:
            menuComponentPath += 'student-menu.html'
            break
        case UserType.MANAGER:
            menuComponentPath += 'manager-menu.html'
            break
        default:
            throw new Error(`User type ${loggedUserType} is invalid`)
    }

    const dynamicContentElement = document.createElement('dynamic-content')
    dynamicContentElement.setAttribute('src', menuComponentPath)
    mainElement.appendChild(dynamicContentElement)
}
