export class DocumentType {
    static CPF = 1
    static RG = 2
    static CIN = 3
    static ProfilePicture = 4
    static MinorEnrollmentAuthorization = 5
    static HealthCertificate = 6
    static AbsenseJustification = 7
    static StudentCard = 8
    static RegisterUserFormTemplate = 9
    static HealthCertificateTemplate = 10
    static AttendanceListTemplate = 11

    static isIdentityDocumentType(number) {
        return number == this.CPF
            || number == this.RG
            || number == this.CIN
    }
}
