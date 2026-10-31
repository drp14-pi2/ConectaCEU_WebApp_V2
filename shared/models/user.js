export class User {
    id
    name
    email
    userTypeId
    educationalUnitId

    constructor(id, name, email, userTypeId, educationalUnitId) {
        this.id = id
        this.name = name
        this.email = email
        this.userTypeId = Number(userTypeId)
        this.educationalUnitId = educationalUnitId
    }
}

export class CreateUserForm {
    selectDocumentType
    userDocument
    userDocumentFrontFile
    userDocumentBackFile
    userPhotoFile
    email
    userName
    birthdate
    phone
    secondPhone
    sex
    gender
    school
    password
    repeatedPassword
    zipCode
    street
    addressNumber
    addressComplement
    neighborhood

    // Representative 1
    representative1Name
    representative1Degree
    selectRep1DocumentType
    representative1Document
    rep1DocumentFrontFile
    rep1DocumentBackFile
    rep1AuthorizationFile

    // Representative 2
    representative2Name
    representative2Degree
    selectRep2DocumentType
    representative2Document
    rep2DocumentFrontFile
    rep2DocumentBackFile
    rep2AuthorizationFile

    consent
    educationalUnitId
    healthCertificate

    constructor (
        selectDocumentType,
        userDocument,
        userDocumentFrontFile,
        userDocumentBackFile,
        userPhotoFile,
        email,
        userName,
        birthdate,
        phone,
        secondPhone,
        sex,
        gender,
        school,
        password,
        repeatedPassword,
        zipCode,
        street,
        addressNumber,
        addressComplement,
        neighborhood,
        representative1Name,
        representative1Degree,
        selectRep1DocumentType,
        representative1Document,
        rep1DocumentFrontFile,
        rep1DocumentBackFile,
        rep1AuthorizationFile,
        representative2Name,
        representative2Degree,
        selectRep2DocumentType,
        representative2Document,
        rep2DocumentFrontFile,
        rep2DocumentBackFile,
        rep2AuthorizationFile,
        consent,
        educationalUnitId,
        healthCertificate) {
        this.selectDocumentType = Number(selectDocumentType)
        this.userDocument = userDocument
        this.userDocumentFrontFile = userDocumentFrontFile
        this.userDocumentBackFile = userDocumentBackFile
        this.userPhotoFile = userPhotoFile
        this.email = email
        this.userName = userName
        this.birthdate = birthdate
        this.phone = phone
        this.secondPhone = secondPhone
        this.sex = Number(sex)
        this.gender = Number(gender)
        this.school = school
        this.password = password
        this.repeatedPassword = repeatedPassword
        this.zipCode = zipCode
        this.street = street
        this.addressNumber = addressNumber
        this.addressComplement = addressComplement
        this.neighborhood = neighborhood
        this.representative1Name = representative1Name
        this.representative1Degree = representative1Degree
        this.selectRep1DocumentType = Number(selectRep1DocumentType)
        this.representative1Document = representative1Document
        this.rep1DocumentFrontFile = rep1DocumentFrontFile
        this.rep1DocumentBackFile = rep1DocumentBackFile
        this.rep1AuthorizationFile = rep1AuthorizationFile
        this.representative2Name = representative2Name
        this.representative2Degree = representative2Degree
        this.selectRep2DocumentType = Number(selectRep2DocumentType)
        this.representative2Document = representative2Document
        this.rep2DocumentFrontFile = rep2DocumentFrontFile
        this.rep2DocumentBackFile = rep2DocumentBackFile
        this.rep2AuthorizationFile = rep2AuthorizationFile
        this.consent = consent
        this.educationalUnitId = educationalUnitId
        this.healthCertificate = healthCertificate
    }
}

export class CreateUser {
    document
    name
    email
    cellphoneNumber
    contactCellphoneNumber
    birthdate
    school
    sexId
    genderId
    userTypeId
    password
    educationalUnitId
    idDocumentFront
    idDocumentBack
    userPhoto
    healthCertificate
    address
    legalRepresentative1
    legalRepresentative2

    constructor(
        document,
        name,
        email,
        cellphoneNumber,
        contactCellphoneNumber,
        birthdate,
        school,
        sexId,
        genderId,
        userTypeId,
        password,
        educationalUnitId,
        idDocumentFront,
        idDocumentBack,
        userPhoto,
        healthCertificate,
        address,
        legalRepresentative1,
        legalRepresentative2) {
        this.document = document
        this.name = name
        this.email = email
        this.cellphoneNumber = cellphoneNumber
        this.contactCellphoneNumber = contactCellphoneNumber
        this.birthdate = birthdate
        this.school = school
        this.sexId = sexId
        this.genderId = genderId
        this.userTypeId = userTypeId
        this.password = password
        this.educationalUnitId = educationalUnitId
        this.idDocumentFront = idDocumentFront 
        this.idDocumentBack = idDocumentBack
        this.userPhoto = userPhoto
        this.healthCertificate = healthCertificate
        this.address = address
        this.legalRepresentative1 = legalRepresentative1
        this.legalRepresentative2 = legalRepresentative2
    }
}
