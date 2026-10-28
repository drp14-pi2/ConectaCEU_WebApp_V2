import { config } from '/config.js'

export const pageRouting = {
    root: `${config.appUrl}`,
    home: `${config.appUrl}/pages/home/home.html`,
    login: `${config.appUrl}/pages/login/login.html`,
    requestPasswordRecovery: `${config.appUrl}/pages/request-password-recovery/request-password-recovery.html`,
    createUser: `${config.appUrl}/pages/create-user/create-user.html`
}
