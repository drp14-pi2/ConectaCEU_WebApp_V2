import { config } from '/config.js'

export const pageRouting = {
    root: `${config.appUrl}`,
    home: `${config.appUrl}/pages/home/home.html`,
    login: `${config.appUrl}/pages/login/login.html`,
    requestPasswordRecovery: `${config.appUrl}/pages/request-password-recovery/request-password-recovery.html`,
    createUser: `${config.appUrl}/pages/create-user/create-user.html`,
    createUnit: `${config.appUrl}/pages/create-unit/create-unit.html`,
    manageUsers: `${config.appUrl}/pages/manage-users/manage-users.html`,
    manageUser: `${config.appUrl}/pages/manage-user/manage-user.html`,
    validateDocuments: `${config.appUrl}/pages/validate-documents/validate-documents.html`,
    validateUserDocuments: `${config.appUrl}/pages/validate-user-documents/validate-user-documents.html`,
    createCourse: `${config.appUrl}/pages/create-course/create-course.html`,
    createClass: `${config.appUrl}/pages/create-class/create-class.html`,
    consult: `${config.appUrl}/pages/consult/consult.html`,
    consultClass: `${config.appUrl}/pages/consult-class/consult-class.html`,
    attendance: `${config.appUrl}/pages/attendance/attendance.html`,
}
