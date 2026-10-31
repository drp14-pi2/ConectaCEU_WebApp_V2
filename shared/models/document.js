export class CreateDocument {
    base64
    documentTypeId
    isFront
    userId
    legalRepresentativeId

    constructor(
        base64,
        documentTypeId,
        isFront,
        userId,
        legalRepresentativeId) {
        this.base64 = base64,
        this.document_type_id = documentTypeId,
        this.user_id = userId,
        this.is_front = isFront,
        this.legal_representative_id = legalRepresentativeId
    }
}
