export class LegalRepresentativeDegreeType {
    static MOTHER = 1
    static FATHER = 2
    static AUNT = 3
    static UNCLE = 4
    static GRANDMOTHER = 5
    static GRANDFATHER = 6
    static OTHER = 7
	
    static getName(value) {
        switch (value) {
            case this.MOTHER:
                return 'Mãe'
            case this.FATHER:
                return 'Pai'
            case this.AUNT:
                return 'Tia'
            case this.UNCLE:
                return 'Tio'
            case this.GRANDMOTHER:
                return 'Avó'
            case this.GRANDFATHER:
                return 'Avô'
            case this.OTHER:
                return 'Outro'
            default:
                return ''
        }
    }
}
