import { ReferenceService } from '/shared/services/reference-service.js'
import { EducationalUnitService } from '/shared/services/educational-unit-service.js'
import { AuthService } from '/shared/services/auth-service.js'
import { LegalRepresentativeService } from '/shared/services/legal-representative-service.js'
import { DocumentService } from '/shared/services/document-service.js'
import { DocumentType } from '/shared/constants/document-type.js'
import { SexType } from '/shared/constants/sex-type.js'
import { GenderType } from '/shared/constants/gender-type.js'
import { LegalRepresentativeDegree } from '/shared/constants/legal-representative-degree.js'
import { CreateUserForm } from '/shared/models/user.js'
import { DateHelper } from '/shared/helpers/date-helper.js'
import { Validator } from '/shared/validation/validator.js'
import { showMessage } from '/shared/components/toast.component.js'
import { ArrayHelper } from '/shared/helpers/array-helper.js'
import { FileHelper } from '/shared/helpers/file-helper.js'

// Assign select items
async function setSexTypes() {
    const response = await ReferenceService.getSexTypes()

    if (!response.ok) {
        await showMessage(await response.text())

        return
    }

    const sexSelectElement = document.querySelector('#sex')
    const sexTypes = await response.json()
    
    for (const sex of sexTypes) {
        const sexOption = document.createElement('option')
        sexOption.value = sex.id
        sexOption.innerText = sex.description
        sexSelectElement.appendChild(sexOption)
    }
}

async function setGenderTypes() {
    const response = await ReferenceService.getGenderTypes()

    if (!response.ok) {
        await showMessage(await response.text())

        return
    }

    const genderSelectElement = document.querySelector('#gender')
    const genderTypes = await response.json()
    
    for (const gender of genderTypes) {
        const genderOption = document.createElement('option')
        genderOption.value = gender.id
        genderOption.innerText = gender.description
        genderSelectElement.appendChild(genderOption)
    }
}

async function setLegalRepresentativeDegrees() {
    const response = await ReferenceService.getLegalRepresentativeDegreeTypes()

    if (!response.ok) {
        await showMessage(await response.text())

        return
    }

    const legalRepresentativeDegrees = await response.json()

    async function setLegalRepresentative1Degrees() {
        const representative1DegreeSelectElement = document.querySelector('#representative-1-degree')

        for (const degree of legalRepresentativeDegrees) {
            const degreeOption = document.createElement('option')
            degreeOption.value = degree.id
            degreeOption.innerText = degree.description
            representative1DegreeSelectElement.appendChild(degreeOption)
        }
    }

    async function setLegalRepresentative2Degrees() {
        const representative2DegreeSelectElement = document.querySelector('#representative-2-degree')

        for (const degree of legalRepresentativeDegrees) {
            const degreeOption = document.createElement('option')
            degreeOption.value = degree.id
            degreeOption.innerText = degree.description
            representative2DegreeSelectElement.appendChild(degreeOption)
        }
    }

    await setLegalRepresentative1Degrees()
    await setLegalRepresentative2Degrees()
}

async function setEducationalUnits() {
    const response = await EducationalUnitService.list()

    if (!response.ok) {
        await showMessage(await response.text())

        return
    }

    const educationalUnitSelectElement = document.querySelector('#educationalUnit')
    const educationalUnits = await response.json()

    for (const unit of educationalUnits) {
        const unitOption = document.createElement('option')
        unitOption.value = unit.id
        unitOption.innerText = unit.name
        educationalUnitSelectElement.appendChild(unitOption)
    }
}

await setSexTypes()
await setGenderTypes()
await setLegalRepresentativeDegrees()
await setEducationalUnits()

// Set date range for birthdate
function setBirthdateRange() {
    const birthdateElement = document.querySelector('#birthdate')
    const today = Date()

    // Set min date
    const minDate = new Date(today);
    minDate.setDate(minDate.getDate() - (30 * 12 * 110)); // max 110 years old
    birthdateElement.min = DateHelper.toDateInputValue(minDate);

    // Set max date
    const maxDate = new Date(today);
    maxDate.setDate(minDate.getDate() - (30 * 12 * 2)); // min 2 years old
    birthdateElement.max = DateHelper.toDateInputValue(maxDate);
}

setBirthdateRange()

// Form
function getFormData() {
    const fileInputs = document.getElementsByClassName('file-input__native')

    return new CreateUserForm(
        document.querySelector('#select-document-type').value,
        document.querySelector('#user-document').value,
        fileInputs[0].files[0] || null,
        fileInputs[1].files[0] || null,
        fileInputs[2].files[0] || null,
        document.querySelector('#email').value,
        document.querySelector('#userName').value,
        document.querySelector('#birthdate').value,
        document.querySelector('#phone').value,
        document.querySelector('#secondPhone').value,
        document.querySelector('#sex').value,
        document.querySelector('#gender').value,
        document.querySelector('#school').value,
        document.querySelector('#password').value,
        document.querySelector('#repeatedPassword').value,
        document.querySelector('#zipCode').value,
        document.querySelector('#street').value,
        document.querySelector('#addressNumber').value,
        document.querySelector('#addressComplement').value,
        document.querySelector('#neighborhood').value,
        document.querySelector('#representative-1-name').value,
        document.querySelector('#representative-1-degree').value,
        document.querySelector('#select-rep-1-document-type').value,
        document.querySelector('#representative-1-document').value,
        fileInputs[3].files[0] || null,
        fileInputs[4].files[0] || null,
        fileInputs[5].files[0] || null,
        document.querySelector('#representative-2-name').value,
        document.querySelector('#representative-2-degree').value,
        document.querySelector('#select-rep-2-document-type').value,
        document.querySelector('#representative-2-document').value,
        fileInputs[6].files[0] || null,
        fileInputs[7].files[0] || null,
        fileInputs[8].files[0] || null,
        document.querySelector('#consent').checked,
        document.querySelector('#educationalUnit').value)
}

function validateFormData(formData) {
    const errors = []
    console.log(JSON.stringify(formData))

    if (!formData.selectDocumentType || !DocumentType.isIdentityDocumentType(formData.selectDocumentType)) {
        errors.push('Tipo de documento de identificação inválido')
    }

    if (!formData.userDocument || formData.userDocument.length != 11) {
        errors.push('Documento de identificação inválido')
    }

    if (!formData.userDocumentFrontFile) {
        errors.push('Frente do documento de identificação não anexada')
    }

    if (!formData.userDocumentBackFile) {
        errors.push('Verso do documento de identificação não anexado')
    }

    if (!formData.userPhotoFile || formData.userPhotoFile.size <= 0) {
        errors.push('Foto de usuário é obrigatória')
    }

    if (!formData.userName || formData.userName.length < 5) {
        errors.push('Nome de usuário inválido')
    }

    if (!formData.birthdate) {
        errors.push('Date de nascimento inválida')
    }

    if (!formData.phone) {
        errors.push('Número de celular inválido')
    }
    
    if (!SexType.isValid(formData.sex)) {
        errors.push('Sexo inválido')
    }

    if (!GenderType.isValid(formData.gender)) {
        errors.push('Gênero inválido')
    }

    const passwordValidation = Validator.validatePassword(formData.password)
    
    if (!passwordValidation.valid) {
        errors.push(passwordValidation.errors)
    }

    if (!formData.repeatedPassword || formData.repeatedPassword != formData.password) {
        errors.push('Senhas não batem')
    }

    if (!formData.zipCode || formData.zipCode.length != 8) {
        errors.push('CEP inválido')
    }

    if (!formData.street || formData.street.length < 5) {
        errors.push('Logradouro inválido')
    }

    if (!formData.addressNumber) {
        formData.addressNumber = 'S/N'
    }
    
    if (!formData.neighborhood || formData.neighborhood.length < 5) {
        errors.push('Bairro inválido')
    }

    const isUserMinor = DateHelper.isMinor(formData.birthdate)

    if (isUserMinor) {
        if (!formData.representative1Name || formData.representative1Name.length < 5) {
            errors.push('Nome do representante legal 1 inválido')
        }

        if (!LegalRepresentativeDegree.isValid(formData.representative1Degree)) {
            errors.push('Grau de representate legal 1 inválido')
        }

        if (!DocumentType.isIdentityDocumentType(formData.selectRep1DocumentType)) {
            errors.push('Tipo de documento de representante legal 1 inválido')
        }

        if (!formData.representative1Document || formData.representative1Document.length != 11) {
            errors.push('Documento do representante legal 1 inválido')
        }

        if (!formData.rep1DocumentFrontFile) {
            errors.push('Frente do documento de identificação do representante 1 não anexado')
        }

        if (!formData.rep1DocumentBackFile) {
            errors.push('Verso do documento de identificação do representante 1 não anexado')
        }

        if (!formData.rep1AuthorizationFile) {
            errors.push('Autorização de cadastro do usuário menor não anexada')
        }

        if (formData.representative2Name) {
            if (formData.representative2Name.length < 5) {
                errors.push('Nome do representante legal 2 inválido')
            }

            if (!LegalRepresentativeDegree.isValid(formData.representative2Degree)) {
                errors.push('Grau de representate legal 2 inválido')
            }

            if (!DocumentType.isIdentityDocumentType(formData.selectRep2DocumentType)) {
                errors.push('Tipo de documento de representante legal 2 inválido')
            }

        if (!formData.representative2Document || formData.representative2Document.length != 11) {
            errors.push('Documento do representante legal 2 inválido')
        }

            if (!formData.rep2DocumentFrontFile) {
                errors.push('Frente do documento de identificação do representante 2 não anexado')
            }

            if (!formData.rep2DocumentBackFile) {
                errors.push('Verso do documento de identificação do representante 2 não anexado')
            }

            if (!formData.rep2AuthorizationFile) {
                errors.push('Autorização de cadastro do usuário menor não anexada')
            }
        }
    }
    
    if (!formData.consent) {
        errors.push('É necessário consentir com a Política de Privacidade e os Termos de Uso')
    }

    if (!formData.educationalUnitId) {
        errors.push('CEU inválido')
    }

    return errors
}

const submitButton = document.querySelector('#button-submit-form')
async function submitForm() {
    submitButton.setAttribute('disabled', true)
    const formData = getFormData()
    const formDataErrors = validateFormData(formData)

    if (formDataErrors.length > 0) {
        console.log('valida form')
        console.log(JSON.stringify(formDataErrors))
        await showMessage(ArrayHelper.arrayToString(formDataErrors))
        submitButton.removeAttribute('disabled')

        return
    }

    // Register user
    const createUserResponse = await AuthService.publicUserRegister(formData)
    
    if (!createUserResponse.ok) {
        console.log('cria usuario')
        await showMessage(await createUserResponse.text())
        submitButton.removeAttribute('disabled')

        return
    }
    
    const createUserResponseBody = await createUserResponse.json()
    const userId = createUserResponseBody.user_id
    console.log(JSON.stringify(createUserResponseBody))

    // Upload identity document front
    const identityDocumentFrontUploadResponse = await DocumentService.upload(
        await FileHelper.fileToBase64(formData.userDocumentFrontFile),
        formData.selectDocumentType,
        userId,
        true
    )

    if (!identityDocumentFrontUploadResponse.ok) {
        console.log('sobe frente ident')
        await showMessage(await identityDocumentFrontUploadResponse.text())
    }

    // Upload identity document back
    const identityDocumentBackUploadResponse = await DocumentService.upload(
        await FileHelper.fileToBase64(formData.userDocumentBackFile),
        formData.selectDocumentType,
        userId,
        false
    )

    if (!identityDocumentBackUploadResponse.ok) {
        console.log('sobe verso ident')
        await showMessage(await identityDocumentBackUploadResponse.text())
    }

    // Create legal representative 1
    if (formData.representative1Name){
        const legalRepresentative1CreationResponse = await LegalRepresentativeService.create(
            formData.representative1Name,
            formData.representative1Document,
            formData.representative1Degree,
            userId
        )
    
        if (!legalRepresentative1CreationResponse.ok) {
            console.log('cria rep 1')
            await showMessage(await legalRepresentative1CreationResponse.text())
        }
        
        const legalRepresentative1CreationResponseBody = await legalRepresentative1CreationResponse.json()
    
        // Upload legal representative 1 identity document front
        const rep1IdentityDocumentFrontUploadResponse = await DocumentService.upload(
            await FileHelper.fileToBase64(formData.rep1DocumentFrontFile),
            formData.selectRep1DocumentType,
            userId,
            true,
            legalRepresentative1CreationResponseBody.id
        )
        
        if (!rep1IdentityDocumentFrontUploadResponse.ok) {
            console.log('sobe frente ident rep 1')
            await showMessage(await rep1IdentityDocumentFrontUploadResponse.text())
        }

        // Upload legal representative 1 identity document back
        const rep2IdentityDocumentBackUploadResponse = await DocumentService.upload(
            await FileHelper.fileToBase64(formData.rep1DocumentBackFile),
            formData.selectRep1DocumentType,
            userId,
            false,
            legalRepresentative1CreationResponseBody.id
        )
        
        if (!rep2IdentityDocumentBackUploadResponse.ok) {
            console.log('sobe verso ident rep 1')
            await showMessage(await rep2IdentityDocumentBackUploadResponse.text())
        }

        // Upload legal representative 1 authorization file
        const rep1AuthFileUploadResponse = await DocumentService.upload(
            await FileHelper.fileToBase64(formData.rep1AuthorizationFile),
            DocumentType.MinorEnrollmentAuthorization,
            userId,
            null,
            legalRepresentative1CreationResponseBody.id
        )
        
        if (!rep1AuthFileUploadResponse.ok) {
            console.log('sobe auth rep 1')
            await showMessage(await rep1AuthFileUploadResponse.text())
        }
    }

    // Create legal representative 1
    if (formData.representative2Name){
        const legalRepresentative2CreationResponse = await LegalRepresentativeService.create(
            formData.representative2Name,
            formData.representative2Document,
            formData.representative2Degree,
            userId
        )
    
        if (!legalRepresentative2CreationResponse.ok) {
            console.log('cria rep 2')
            await showMessage(await legalRepresentative2CreationResponse.text())
        }
        
        const legalRepresentative2CreationResponseBody = await legalRepresentative2CreationResponse.json()
    
        // Upload legal representative 2 identity document front
        const rep2IdentityDocumentFrontUploadResponse = await DocumentService.upload(
            await FileHelper.fileToBase64(formData.rep2DocumentFrontFile),
            formData.selectRep2DocumentType,
            userId,
            true,
            legalRepresentative2CreationResponseBody.id
        )
        
        if (!rep2IdentityDocumentFrontUploadResponse.ok) {
            console.log('sobre frente ident rep 2')
            await showMessage(await rep2IdentityDocumentFrontUploadResponse.text())
        }

        // Upload legal representative 2 identity document back
        const rep2IdentityDocumentBackUploadResponse = await DocumentService.upload(
            await FileHelper.fileToBase64(formData.rep2DocumentBackFile),
            formData.selectRep2DocumentType,
            userId,
            false,
            legalRepresentative2CreationResponseBody.id
        )
        
        if (!rep2IdentityDocumentBackUploadResponse.ok) {
            console.log('sobre verso ident rep 2')
            await showMessage(await rep2IdentityDocumentBackUploadResponse.text())
        }

        // Upload legal representative 1 authorization file
        const rep2AuthFileUploadResponse = await DocumentService.upload(
            await FileHelper.fileToBase64(formData.rep2AuthorizationFile),
            DocumentType.MinorEnrollmentAuthorization,
            userId,
            null,
            legalRepresentative2CreationResponseBody.id
        )
        
        if (!rep2AuthFileUploadResponse.ok) {
            console.log('sobre auth repo 2')
            await showMessage(await rep2AuthFileUploadResponse.text())
        }
    }

    // Upload health certificate
    if (formData.healthCertificate) {
        const healthCertificateUploadResponse = await DocumentService.upload(
            await FileHelper.fileToBase64(formData.healthCertificate),
            DocumentType.HealthCertificate,
            userId
        )
        
        if (!healthCertificateUploadResponse.ok) {
            console.log('sobre atestado')
            await showMessage(await healthCertificateUploadResponse.text())
        }
    }

    submitButton.removeAttribute('disabled')

    return
}
submitButton.addEventListener('click', async () => await submitForm())
