export class CreateLegalRepresentative {
    name
    document
    legalRepresentativeDegreeId
    userId
    idDocumentFront
    idDocumentBack
    studentRegistryAuthorization

    constructor(
        name,
        document,
        legalRepresentativeDegreeId,
        userId,
        idDocumentFront,
        idDocumentBack,
        studentRegistryAuthorization) {
        this.name = name
        this.document = document
        this.legalRepresentativeDegreeId = legalRepresentativeDegreeId
        this.userId = userId,
        this.idDocumentFront = idDocumentFront,
        this.idDocumentBack = idDocumentBack,
        this.studentRegistryAuthorization = studentRegistryAuthorization
    }
}
