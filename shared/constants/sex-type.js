export class SexType {
    static FEMININE = 1
    static MASCULINE = 2

    static isValid(sex) {
        return sex == this.FEMININE || sex == this.MASCULINE
    }

    static getName(sex) {
        switch (sex) {
            case this.FEMININE:
                return 'Feminino'
            case this.MASCULINE:
                return 'Masculino'
            default:
                return ''
        }
    }
}
