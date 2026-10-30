export class CreateLegalRepresentative {
    name
    document
    legalRepresentativeDegreeId
    userId

    constructor(
        name,
        document,
        legalRepresentativeDegreeId,
        userId) {
        this.name = name
        this.document = document
        this.legalRepresentativeDegreeId = legalRepresentativeDegreeId
        this.userId = userId
    }
}
