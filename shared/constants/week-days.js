export class WeekDays {
    static MONDAY = 0
    static TUESDAY = 1
    static WEDNESDAY = 2
    static THURSDAY = 3
    static FRIDAY = 4
    static SATURDAY = 5
    static SUNDAY = 6

    static isValid(value) {
        return value == WeekDays.MONDAY
            || value == WeekDays.TUESDAY
            || value == WeekDays.WEDNESDAY
            || value == WeekDays.THURSDAY
            || value == WeekDays.FRIDAY
            || value == WeekDays.SATURDAY
            || value == WeekDays.SUNDAY
    }
}
