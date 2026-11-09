import { UserService } from '/shared/services/user-service.js'
import { AddressService } from '/shared/services/address-service.js'
import { EducationalUnitService } from '/shared/services/educational-unit-service.js'
import { DocumentService } from '/shared/services/document-service.js'
import { LegalRepresentativeService } from '/shared/services/legal-representative-service.js'
import { showMessage } from '/shared/components/toast.component.js'
import { ApiHelper } from '/shared/helpers/api-helper.js'
import { pageRouting } from '/shared/constants/page-routing.js'
import { DateHelper } from '/shared/helpers/date-helper.js'
import { FileHelper } from '/shared/helpers/file-helper.js'
import { StyleHelper } from '/shared/helpers/style-helper.js'
import { SexType } from '/shared/constants/sex-type.js'
import { GenderType } from '/shared/constants/gender-type.js'
import { UserType } from '/shared/constants/user-type.js'
import { DocumentType } from '/shared/constants/document-type.js'
import { LegalRepresentativeDegreeType } from '/shared/constants/legal-representative-degree-type.js'
import { openPopup } from '/shared/components/popup.js'

const params = new URLSearchParams(window.location.search);
const userId = params.get('id');
let user = {}


// Address
async function getAddress() {
    const response = await AddressService.list(userId)

    if (!response.ok) {
        showMessage(await ApiHelper.getResponseError(response))

        return
    }

    return await response.json()
}


// Educational unit
async function getEducationalUnit(educationalUnitId) {
    const response = await EducationalUnitService.get(educationalUnitId)

    if (!response.ok) return

    return await response.json()
}


// Documents
async function getUserDocuments() {
    const response = await DocumentService.getUserDocuments(userId)

    if (!response.ok) return

    return await response.json()
}


// Legal representatives
async function getLegalRepresentatives() {
    const response = await LegalRepresentativeService.getUserRepresentatives(userId)

    if (!response.ok) return

    return await response.json()
}


// User
async function getUser() {
    const response = await UserService.get(userId)

    if (!response.ok) {
        showMessage(await ApiHelper.getResponseError(response))

        // if (document.referrer) {
        //     const origin =  new URL(document.referrer).origin

        //     if (origin === pageRouting.consultEducator || origin === pageRouting.consultStudent) {
        //         history.back()
        //     }
        // } else {
        //     location.href = pageRouting.root
        // }

        return
    }

    user = await response.json()

    const userTypeDisplayElement = document.querySelector('#user-type-display')
    userTypeDisplayElement.textContent = UserType.getName(user.user_type_id).toLowerCase()

    const fileInputElements = document.getElementsByClassName('view-file-container')

    // List user documents
    const documents = await getUserDocuments()

    // Identity document
    const identityDocumentTypes = [DocumentType.CPF, DocumentType.RG, DocumentType.CIN]

    const identityDocument = documents.length > 0
        ? documents.find((x) =>
            identityDocumentTypes.includes(x.document_type_id)
            && x.legal_representative_id === null)
        : null
    if (identityDocument) {
        // Get identity document type
        const documentTypeElement = document.querySelector('#select-document-type')
        const documentTypeOption = document.createElement('option')
        documentTypeOption.textContent = DocumentType.getName(identityDocument.document_type_id)
        documentTypeElement.appendChild(documentTypeOption)

        // Assign document's front to visualizer
        const idFront = documents.find((x) =>
            identityDocument.document_type_id === x.document_type_id
            && x.is_front === true
            && x.legal_representative_id === null)

        if (idFront) {
            const identityDocumentFront = fileInputElements[0]
            const identityDocumentFrontFileNameElement = identityDocumentFront.querySelector(':scope .view-file-name')
            identityDocumentFrontFileNameElement.innerHTML = DocumentType.getName(idFront.document_type_id)
            const identityDocumentFrontButtonElement = identityDocumentFront.querySelector(':scope .view-file-button')
            identityDocumentFrontButtonElement.addEventListener('click', () => {
                openPopup({
                    title: DocumentType.getName(idFront.document_type_id),
                    content: FileHelper.renderDocumentNode(idFront)
                })
            })
        }

        // Assign document's back to visualizer
        const back = documents.find((x) =>
            identityDocument.document_type_id === x.document_type_id
            && x.is_front === false)

        if (back) {
            const identityDocumentBack = fileInputElements[1]
            const identityDocumentBackFileNameElement = identityDocumentBack.querySelector(':scope .view-file-name')
            identityDocumentBackFileNameElement.innerHTML = DocumentType.getName(back.document_type_id)
            const identityDocumentBackButtonElement = identityDocumentBack.querySelector(':scope .view-file-button')
            identityDocumentBackButtonElement.addEventListener('click', () => {
                openPopup({
                    title: DocumentType.getName(back.document_type_id),
                    content: FileHelper.renderDocumentNode(back)
                })
            })
        }
    }
    
    // Document
    const userDocumentElement = document.querySelector('#user-document')
    userDocumentElement.value = user.document

    // Assign user photo to visualizer
    const userPhoto = documents.find((x) => x.document_type_id === DocumentType.ProfilePicture)

    if (userPhoto) {
        const userPhotoElement = fileInputElements[2]
        const userPhotoFileNameElement = userPhotoElement.querySelector(':scope .view-file-name')
        userPhotoFileNameElement.innerHTML = DocumentType.getName(userPhoto.document_type_id)
        const userPhotoButtonElement = userPhotoElement.querySelector(':scope .view-file-button')
        userPhotoButtonElement.addEventListener('click', () => {
            openPopup({
                title: DocumentType.getName(userPhoto.document_type_id),
                content: FileHelper.renderDocumentNode(userPhoto)
            })
        })
    }

    // E-mail
    const emailElement = document.querySelector('#email')
    emailElement.value = user.email

    // Name
    const userNameElement = document.querySelector('#userName')
    userNameElement.value = user.name

    // Birthdate
    const birthdateElement = document.querySelector('#birthdate')
    birthdateElement.value = DateHelper.toDateInputValue(user.birthdate)

    // Phone number
    const phoneElement = document.querySelector('#phone')
    phoneElement.value = user.cellphone_number

    if (user.contact_cellphone_number) {
        const secondPhoneElement = document.querySelector('#secondPhone')
        secondPhoneElement.value = user.contact_cellphone_number
    }

    // Sex
    const sexElement = document.querySelector('#sex')
    const sexOptionElement = document.createElement('option')
    sexOptionElement.textContent = SexType.getName(user.sex_id)
    sexElement.appendChild(sexOptionElement)

    // Gender
    const genderElement = document.querySelector('#gender')
    const genderOptionElement = document.createElement('option')
    genderOptionElement.textContent = GenderType.getName(user.gender_id)
    genderElement.appendChild(genderOptionElement)

    // Scholl
    if (user.school) {
        const schoolElement = document.querySelector('#school')
        schoolElement.value = user.school
    }

    // Address
    const address = (await getAddress())[0]

    if (address) {
        const zipCodeElement = document.querySelector('#zipCode')
        zipCodeElement.value = address.zip_code

        const streetElement = document.querySelector('#street')
        streetElement.value = address.street

        const addressNumberElement = document.querySelector('#addressNumber')
        addressNumberElement.value = address.number

        const addressComplementElement = document.querySelector('#addressComplement')
        addressComplementElement.value = address.complement

        const neighborhoodElement = document.querySelector('#neighborhood')
        neighborhoodElement.value = address.neighborhood
    }

    // Educational unit
    const unit = await getEducationalUnit(user.educational_unit_id)

    if (unit) {
        const educationalUnitElement = document.querySelector('#educationalUnit')
        const educationalUnitOption = document.createElement('option')
        educationalUnitOption.textContent = unit.name
        educationalUnitElement.appendChild(educationalUnitOption)
    }

    // User type
    const userTypeElement = document.querySelector('#userType')
    const userTypeOptionElement = document.createElement('option')
    userTypeOptionElement.textContent = UserType.getName(user.user_type_id)
    userTypeElement.appendChild(userTypeOptionElement)

    const legalRepresentatives = await getLegalRepresentatives()

    if (legalRepresentatives.length > 0) {
        const representativesContainer = document.querySelector('.legal-representatives-container')
        StyleHelper.setDisplay(representativesContainer, 'block')

        // Legal representative 1
        const rep1 = legalRepresentatives[0]

        // Name
        const representative1NameElement = document.querySelector('#representative-1-name')
        representative1NameElement.value = rep1.name

        // Degree
        const representative1DegreeElement = document.querySelector('#representative-1-degree')
        const rep1DegreeOptionElement = document.createElement('option')
        rep1DegreeOptionElement.textContent = LegalRepresentativeDegreeType.getName(rep1.legal_representative_degree_id)
        representative1DegreeElement.appendChild(rep1DegreeOptionElement)

        // Document type
        const rep1IdentityDocument = documents.length > 0
            ? documents.find((x) =>
                identityDocumentTypes.includes(x.document_type_id)
                && x.legal_representative_id === rep1.id)
            : null

        const selectRep1DocumentTypeElement = document.querySelector('#select-rep-1-document-type')
        const rep1DocumentTypeOptionElement = document.createElement('option')
        rep1DocumentTypeOptionElement.textContent = DocumentType.getName(rep1IdentityDocument.document_type_id)
        selectRep1DocumentTypeElement.appendChild(rep1DocumentTypeOptionElement)

        // Document
        const representative1DocumentElement = document.querySelector('#representative-1-document')
        representative1DocumentElement.value = rep1.document

        // Assign document's front to visualizer
        const rep1IdFront = documents.find((x) =>
            rep1IdentityDocument.document_type_id === x.document_type_id
            && x.is_front === true
            && x.legal_representative_id === rep1.id)

        if (rep1IdFront) {
            const rep1IdentityDocumentFront = fileInputElements[3]
            const rep1IdentityDocumentFrontFileNameElement = rep1IdentityDocumentFront.querySelector(':scope .view-file-name')
            rep1IdentityDocumentFrontFileNameElement.innerHTML = DocumentType.getName(rep1IdFront.document_type_id)
            const rep1IdentityDocumentFrontButtonElement = rep1IdentityDocumentFront.querySelector(':scope .view-file-button')
            rep1IdentityDocumentFrontButtonElement.addEventListener('click', () => {
                openPopup({
                    title: DocumentType.getName(rep1IdFront.document_type_id),
                    content: FileHelper.renderDocumentNode(rep1IdFront)
                })
            })
        }

        // Assign document's back to visualizer
        const rep1IdBack = documents.find((x) =>
            rep1IdentityDocument.document_type_id === x.document_type_id
            && x.is_front === false
            && x.legal_representative_id === rep1.id)

        if (rep1IdBack) {
            const rep1IdentityDocumentBack = fileInputElements[4]
            const rep1IdentityDocumentBackFileNameElement = rep1IdentityDocumentBack.querySelector(':scope .view-file-name')
            rep1IdentityDocumentBackFileNameElement.innerHTML = DocumentType.getName(rep1IdBack.document_type_id)
            const rep1IdentityDocumentBackButtonElement = rep1IdentityDocumentBack.querySelector(':scope .view-file-button')
            rep1IdentityDocumentBackButtonElement.addEventListener('click', () => {
                openPopup({
                    title: DocumentType.getName(rep1IdBack.document_type_id),
                    content: FileHelper.renderDocumentNode(rep1IdBack)
                })
            })
        }

        // Authorization
        const rep1Authorization = documents.find((x) =>
            x.document_type_id === DocumentType.MinorEnrollmentAuthorization
            && x.legal_representative_id === rep1.id)

        if (rep1Authorization) {
            const rep1AuthorizationElement = fileInputElements[5]
            const rep1AuthorizationFileNameElement = rep1AuthorizationElement.querySelector(':scope .view-file-name')
            rep1AuthorizationFileNameElement.innerHTML = DocumentType.getName(rep1Authorization.document_type_id)
            const rep1AuthorizationButtonElement = rep1AuthorizationElement.querySelector(':scope .view-file-button')
            rep1AuthorizationButtonElement.addEventListener('click', () => {
                openPopup({
                    title: DocumentType.getName(rep1Authorization.document_type_id),
                    content: FileHelper.renderDocumentNode(rep1Authorization)
                })
            })
        }

        if (legalRepresentatives.length > 1) {
            const legalRepresentative2Container = document.querySelector('.legal-representative-2')
            StyleHelper.setDisplay(legalRepresentative2Container, 'block')

            // Legal representative 2
            const rep2 = legalRepresentatives[1]

            // Name
            const representative2NameElement = document.querySelector('#representative-2-name')
            representative2NameElement.value = rep2.name

            // Degree
            const representative2DegreeElement = document.querySelector('#representative-2-degree')
            const rep2DegreeOptionElement = document.createElement('option')
            rep2DegreeOptionElement.textContent = LegalRepresentativeDegreeType.getName(rep2.legal_representative_degree_id)
            representative2DegreeElement.appendChild(rep2DegreeOptionElement)

            // Document type
            const rep2IdentityDocument = documents.length > 0
                ? documents.find((x) =>
                    identityDocumentTypes.includes(x.document_type_id)
                    && x.legal_representative_id === rep2.id)
                : null

            const selectRep2DocumentTypeElement = document.querySelector('#select-rep-2-document-type')
            const rep2DocumentTypeOptionElement = document.createElement('option')
            rep2DocumentTypeOptionElement.textContent = DocumentType.getName(rep2IdentityDocument.document_type_id)
            selectRep2DocumentTypeElement.appendChild(rep2DocumentTypeOptionElement)

            // Document
            const representative2DocumentElement = document.querySelector('#representative-2-document')
            representative2DocumentElement.value = rep2.document

            // Assign document's front to visualizer
            const rep2IdFront = documents.find((x) =>
                rep2IdentityDocument.document_type_id === x.document_type_id
                && x.is_front === true
                && x.legal_representative_id === rep2.id)

            if (rep2IdFront) {
                const rep2IdentityDocumentFront = fileInputElements[6]
                const rep2IdentityDocumentFrontFileNameElement = rep2IdentityDocumentFront.querySelector(':scope .view-file-name')
                rep2IdentityDocumentFrontFileNameElement.innerHTML = DocumentType.getName(rep2IdFront.document_type_id)
                const rep2IdentityDocumentFrontButtonElement = rep2IdentityDocumentFront.querySelector(':scope .view-file-button')
                rep2IdentityDocumentFrontButtonElement.addEventListener('click', () => {
                    openPopup({
                        title: DocumentType.getName(rep2IdFront.document_type_id),
                        content: FileHelper.renderDocumentNode(rep2IdFront)
                    })
                })
            }

            // Assign document's back to visualizer
            const rep2IdBack = documents.find((x) =>
                rep2IdentityDocument.document_type_id === x.document_type_id
                && x.is_front === false
                && x.legal_representative_id === rep2.id)

            if (rep2IdBack) {
                const rep2IdentityDocumentBack = fileInputElements[7]
                const rep2IdentityDocumentBackFileNameElement = rep2IdentityDocumentBack.querySelector(':scope .view-file-name')
                rep2IdentityDocumentBackFileNameElement.innerHTML = DocumentType.getName(rep2IdBack.document_type_id)
                const rep2IdentityDocumentBackButtonElement = rep2IdentityDocumentBack.querySelector(':scope .view-file-button')
                rep2IdentityDocumentBackButtonElement.addEventListener('click', () => {
                    openPopup({
                        title: DocumentType.getName(rep2IdBack.document_type_id),
                        content: FileHelper.renderDocumentNode(rep2IdBack)
                    })
                })
            }

            // Authorization
            const rep2Authorization = documents.find((x) =>
                x.document_type_id === DocumentType.MinorEnrollmentAuthorization
                && x.legal_representative_id === rep2.id)

            if (rep2Authorization) {
                const rep2AuthorizationElement = fileInputElements[8]
                const rep2AuthorizationFileNameElement = rep2AuthorizationElement.querySelector(':scope .view-file-name')
                rep2AuthorizationFileNameElement.innerHTML = DocumentType.getName(rep2Authorization.document_type_id)
                const rep2AuthorizationButtonElement = rep2AuthorizationElement.querySelector(':scope .view-file-button')
                rep2AuthorizationButtonElement.addEventListener('click', () => {
                    openPopup({
                        title: DocumentType.getName(rep2Authorization.document_type_id),
                        content: FileHelper.renderDocumentNode(rep2Authorization)
                    })
                })
            }
        }
    }
    
    // Health certificate
    const healthCertificate = documents.find((x) =>
        x.document_type_id === DocumentType.HealthCertificate
        && x.legal_representative_id === null)

    if (healthCertificate) {
        const healthCertificateContainer = document.querySelector('.health-certificate-container')
        StyleHelper.setDisplay(healthCertificateContainer, 'block')

        const healthCertificateElement = fileInputElements[9]
        const healthCertificateFileNameElement = healthCertificateElement.querySelector(':scope .view-file-name')
        healthCertificateFileNameElement.innerHTML = DocumentType.getName(healthCertificate.document_type_id)
        const healthCertificateButtonElement = healthCertificateElement.querySelector(':scope .view-file-button')
        healthCertificateButtonElement.addEventListener('click', () => {
            openPopup({
                title: DocumentType.getName(healthCertificate.document_type_id),
                content: FileHelper.renderDocumentNode(healthCertificate)
            })
        })
    }
}
await getUser()


// Student document emission buttons
if (user.user_type_id == UserType.STUDENT) {
    const documentEmissionContainer = document.querySelector('.document-emission-container')
    StyleHelper.setDisplay(documentEmissionContainer, 'flex')
}

const studentCardButtonElement = document.querySelector('#student-card-button')
studentCardButtonElement.addEventListener('click', async () => {
    const response = await DocumentService.getUserDocumentByType(userId, DocumentType.StudentCard)

    if (!response.ok) {
        showMessage(await ApiHelper.getResponseError(response))

        return
    }

    const studentCard = (await response.json())[0]
    openPopup({
        title: DocumentType.getName(DocumentType.StudentCard),
        content: FileHelper.renderDocumentNode(studentCard)
    })
})
