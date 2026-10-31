import '/shared/interceptors/auth-interceptor.js'
import { CreateEducationalUnit } from "/shared/models/educational-unit.js"
import { showMessage } from '/shared/components/toast.component.js'
import { EducationalUnitService } from "/shared/services/educational-unit-service.js"
import { ArrayHelper } from '/shared/helpers/array-helper.js'
import { StringHelper } from '/shared/helpers/string-helper.js'

function getCreateEducationalUnit() {
    return new CreateEducationalUnit(
        document.querySelector('#unitName').value,
        StringHelper.removeNotNumber(document.querySelector('#zipCode').value),
        document.querySelector('#street').value,
        document.querySelector('#addressNumber').value,
        document.querySelector('#addressComplement').value,
        document.querySelector('#neighborhood').value
    )
}

function validateFormData(formData) {
    let errors = []

    if (!formData.name || formData.name.length < 5 || formData.name.length > 200) {
        errors.push('Nome do CEU deve ter entre 5 e 200 caracteres')
    }

    if (!formData.zipCode || formData.zipCode.length != 8) {
        errors.push('CEP inválido')
    }

    if (!formData.street || formData.street.length < 5 || formData.street.length > 200) {
        errors.push('Logradouro deve ter entre 5 e 200 caracteres')
    }

    if (!formData.number) {
        formData.number = 'S/N'
    }
    else if (formData.number.length > 10) {
        errors.push('Logradouro deve ter até 10 caracteres')
    }
    
    if (!formData.neighborhood || formData.neighborhood.length < 5 || formData.neighborhood.length > 100) {
        errors.push('Bairro deve ter entre 5 e 100 caracteres')
    }

    if (formData.complement.length > 100) {
        errors.push('Complemento deve ter até 100 caracteres')
    }

    return errors
}

// Submit form
const submitButton = document.querySelector('#button-submit-form')
async function submitForm() {
    submitButton.setAttribute('disabled', true)
    const createUnitBody = getCreateEducationalUnit()
    const formDataErrors = validateFormData(createUnitBody)
    
    if (formDataErrors.length > 0) {
        showMessage(ArrayHelper.arrayToString(formDataErrors))
        submitButton.removeAttribute('disabled')

        return
    }

    // Register user
    const createUnitResponse = await EducationalUnitService.create(createUnitBody)
    
    if (!createUnitResponse.ok) {
        showMessage(await createUnitResponse.text())
        submitButton.removeAttribute('disabled')

        return
    }
    
    showMessage('CEU criado com sucesso')
    submitButton.removeAttribute('disabled')

    return
}
submitButton.addEventListener('click', async () => await submitForm())
