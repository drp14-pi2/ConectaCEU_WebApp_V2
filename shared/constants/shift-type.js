export class ShiftType {
    static MORNING = 1
    static AFTERNOON = 2
    static EVENING = 3

    static isValid(value) {
        return value == ShiftType.MORNING
            || value == ShiftType.AFTERNOON
            || value == ShiftType.EVENING
    }

    static getName(value) {
        switch (value) {
            case ShiftType.MORNING:
                return 'Manhã'
            case ShiftType.AFTERNOON:
                return 'Tarde'
            case ShiftType.EVENING:
                return 'Noite'
            default:
                return 'N/A'
        }
    }
}
