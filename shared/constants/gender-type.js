export class GenderType {
    static WOMAN = 1
    static MAN = 2
    static NON_BINARY = 3
    static OTHER = 4
    static PREFER_NOT_TO_INFORM = 5

    static isValid(gender) {
        return gender === this.WOMAN
            || gender === this.MAN
            || gender === this.NON_BINARY
            || gender === this.OTHER
            || gender === this.PREFER_NOT_TO_INFORM
    }
}
