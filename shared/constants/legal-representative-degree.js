export class LegalRepresentativeDegree {
    static MOTHER = 1
    static FATHER = 2
    static AUNT = 3
    static UNCLE = 4
    static GRANDMOTHER = 5
    static GRANDFATHER = 6
    static OTHER = 7

    static isValid(degree) {
        return degree == this.MOTHER
            || degree == this.FATHER
            || degree == this.AUNT
            || degree == this.UNCLE
            || degree == this.GRANDMOTHER
            || degree == this.GRANDFATHER
            || degree == this.OTHER
    }
}
