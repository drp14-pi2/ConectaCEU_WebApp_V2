export class ShiftType {
    static MORNING = 1
    static AFTERNOON = 2
    static EVENING = 3

    static isValid(value) {
        return value == ShiftType.MORNING
            || value == ShiftType.AFTERNOON
            || value == ShiftType.EVENING
    }
}
