export class UserType {
    static ADMINISTRATOR = 1
    static SECRETARY = 2
    static COORDINATOR = 3
    static EDUCATOR = 4
    static STUDENT = 5
    static MANAGER = 6

    static isValid(value) {
        return value == UserType.ADMINISTRATOR
            || value == UserType.SECRETARY
            || value == UserType.COORDINATOR
            || value == UserType.EDUCATOR
            || value == UserType.STUDENT
            || value == UserType.MANAGER
    }

    static getName(value) {
        switch (value) {
            case UserType.ADMINISTRATOR:
                return 'Administrador'
            case UserType.SECRETARY:
                return 'Secretário'
            case UserType.COORDINATOR:
                return 'Coordenador'
            case UserType.EDUCATOR:
                return 'Educador'
            case UserType.STUDENT:
                return 'Estudante'
            case UserType.MANAGER:
                return 'Gestor'
            default:
                return 'N/A'
        }
    }
}
