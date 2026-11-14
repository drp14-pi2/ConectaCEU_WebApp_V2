export class AttendanceType {
    static Present = 1
    static InAnotherGroup = 2
    static Absent = 3

    static getName(value) {
        if (typeof value != 'number' && typeof value != 'string') return value

        switch (value) {
            case this.Present:
                return 'Presente'
            case this.InAnotherGroup:
                return 'Em outro grupo'
            case this.Absent:
                return 'Faltou'
        }
    }
}
