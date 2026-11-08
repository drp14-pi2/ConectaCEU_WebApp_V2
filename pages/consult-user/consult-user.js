import { UserService } from '/shared/services/user-service.js'
import { AddressService } from '/shared/services/address-service.js'
import { EducationalUnitService } from '/shared/services/educational-unit-service.js'
import { DocumentService } from '/shared/services/document-service.js'
import { showMessage } from '/shared/components/toast.component.js'
import { ApiHelper } from '/shared/helpers/api-helper.js'
import { pageRouting } from '/shared/constants/page-routing.js'
import { DateHelper } from '/shared/helpers/date-helper.js'
import { FileHelper } from '/shared/helpers/file-helper.js'
import { SexType } from '/shared/constants/sex-type.js'
import { GenderType } from '/shared/constants/gender-type.js'
import { UserType } from '/shared/constants/user-type.js'
import { DocumentType } from '/shared/constants/document-type.js'
import { openPopup } from '/shared/components/popup.js'

const params = new URLSearchParams(window.location.search);
const userId = params.get('id');
let user = {}

async function getAddress() {
    const response = await AddressService.list(userId)

    if (!response.ok) {
        showMessage(await ApiHelper.getResponseError(response))

        return
    }

    return await response.json()
}

async function getEducationalUnit(educationalUnitId) {
    const response = await EducationalUnitService.get(educationalUnitId)

    if (!response.ok) return

    return await response.json()
}

async function getUserDocuments() {
    const response = await DocumentService.getUserDocuments(userId)

    if (!response.ok) return

    return await response.json()
}

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

    const fileInputs = document.getElementsByClassName('view-file-container')

    // List user documents
    const documents = await getUserDocuments()

    // Identity document
    const identityDocument = documents.length > 0
        ? documents.find((x) => [1, 2, 3].includes(x.document_type_id))
        : null
    if (identityDocument) {
        // Get identity document type
        const selectDocumentType = document.querySelector('#select-document-type')
        const selectDocumentOption = document.createElement('option')
        selectDocumentOption.textContent = DocumentType.getName(identityDocument.document_type_id)
        selectDocumentType.appendChild(selectDocumentOption)

        // Assign document's front to visualizer
        const front = documents.find((x) =>
            identityDocument.document_type_id === x.document_type_id
            && x.is_front === true)

        if (front) {
            const identityDocumentFront = fileInputs[0]
            const identityDocumentFrontFileName = identityDocumentFront.querySelector(':scope .view-file-name')
            identityDocumentFrontFileName.innerHTML = DocumentType.getName(front.document_type_id)
            const identityDocumentFrontButton = identityDocumentFront.querySelector(':scope .view-file-button')
            identityDocumentFrontButton.addEventListener('click', () => {
                openPopup({
                    title: DocumentType.getName(front.document_type_id),
                    content: FileHelper.renderDocumentNode(front)
                })
            })
        }

        // Assign document's back to visualizer
        const back = documents.find((x) =>
            identityDocument.document_type_id === x.document_type_id
            && x.is_front === false)

        if (back) {
            const identityDocumentBack = fileInputs[1]
            const identityDocumentBackFileName = identityDocumentBack.querySelector(':scope .view-file-name')
            identityDocumentBackFileName.innerHTML = DocumentType.getName(back.document_type_id)
            const identityDocumentBackButton = identityDocumentBack.querySelector(':scope .view-file-button')
            identityDocumentBackButton.addEventListener('click', () => {
                openPopup({
                    title: DocumentType.getName(back.document_type_id),
                    content: FileHelper.renderDocumentNode(back)
                })
            })
        }
    }
    
    // Document
    const userDocument = document.querySelector('#user-document')
    userDocument.value = user.document

    const userPhoto = fileInputs[2]

    // E-mail
    const email = document.querySelector('#email')
    email.value = user.email

    // Name
    const userName = document.querySelector('#userName')
    userName.value = user.name

    // Birthdate
    const birthdate = document.querySelector('#birthdate')
    birthdate.value = DateHelper.toDateInputValue(user.birthdate)

    // Phone number
    const phone = document.querySelector('#phone')
    phone.value = user.cellphone_number

    if (user.contact_cellphone_number) {
        const secondPhone = document.querySelector('#secondPhone')
        secondPhone.value = user.contact_cellphone_number
    }

    // Sex
    const sex = document.querySelector('#sex')
    const sexOption = document.createElement('option')
    sexOption.textContent = SexType.getName(user.sex_id)
    sex.appendChild(sexOption)

    // Gender
    const gender = document.querySelector('#gender')
    const genderOption = document.createElement('option')
    genderOption.textContent = GenderType.getName(user.gender_id)
    gender.appendChild(genderOption)

    // Scholl
    if (user.school) {
        const school = document.querySelector('#school')
        school.value = user.school
    }

    // Address
    const address = (await getAddress())[0]

    if (address) {
        const zipCode = document.querySelector('#zipCode')
        zipCode.value = address.zip_code

        const street = document.querySelector('#street')
        street.value = address.street

        const addressNumber = document.querySelector('#addressNumber')
        addressNumber.value = address.number

        const addressComplement = document.querySelector('#addressComplement')
        addressComplement.value = address.complement

        const neighborhood = document.querySelector('#neighborhood')
        neighborhood.value = address.neighborhood
    }

    // Educational unit
    const unit = await getEducationalUnit(user.educational_unit_id)

    if (unit) {
        const educationalUnit = document.querySelector('#educationalUnit')
        const educationalUnitOption = document.createElement('option')
        educationalUnitOption.textContent = unit.name
        educationalUnit.appendChild(educationalUnitOption)
    }

    // User type
    const userType = document.querySelector('#userType')
    const userTypeOption = document.createElement('option')
    userTypeOption.textContent = UserType.getName(user.user_type_id)
    userType.appendChild(userTypeOption)

    // Legal representative 1
    const representative1Name = document.querySelector('#representative-1-name')
    const representative1Degree = document.querySelector('#representative-1-degree')
    const selectRep1DocumentType = document.querySelector('#select-rep-1-document-type')
    const representative1Document = document.querySelector('#representative-1-document')
    const rep1IdentityDocumentFront = fileInputs[3]
    const rep1IdentityDocumentBack = fileInputs[4]
    const rep1Authorization = fileInputs[5]

    // Legal representative 2
    const representative2Name = document.querySelector('#representative-2-name')
    const representative2Degree = document.querySelector('#representative-2-degree')
    const selectRep2DocumentType = document.querySelector('#select-rep-2-document-type')
    const representative2Document = document.querySelector('#representative-2-document')
    const rep2IdentityDocumentFront = fileInputs[6]
    const rep2IdentityDocumentBack = fileInputs[7]
    const rep2Authorization = fileInputs[8]
    
    // Health certificate
    const healthCertificate = fileInputs[9]
}
await getUser()
