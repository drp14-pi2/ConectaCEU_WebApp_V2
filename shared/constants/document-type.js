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

    static getName(value) {
        switch (value) {
            case DocumentType.CPF:
                return 'CPF'
            case DocumentType.RG:
                return 'RG'
            case DocumentType.CIN:
                return 'CIN'
            case DocumentType.ProfilePicture:
                return 'Foto de perfil'
            case DocumentType.MinorEnrollmentAuthorization:
                return 'Autorização de matrícula de menor'
            case DocumentType.HealthCertificate:
                return 'Certificado de saúde'
            case DocumentType.AbsenseJustification:
                return 'Justificativa de falta'
            case DocumentType.StudentCard:
                return 'Carteirinha de estudante'
            case DocumentType.RegisterUserFormTemplate:
                return 'Template formulário de cadastro do usuário'
            case DocumentType.HealthCertificateTemplate:
                return 'Template certificado de saúde'
            case DocumentType.AttendanceListTemplate:
                return 'Template lista de chamada'
            default:
                return ''
        }
    }
}
