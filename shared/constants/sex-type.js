export class SexType {
    static FEMININE = 1
    static MASCULINE = 2

    static isValid(sex) {
        return sex == this.FEMININE || sex == this.MASCULINE
    }
}
