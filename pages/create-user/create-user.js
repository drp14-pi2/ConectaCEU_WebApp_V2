import { ReferenceService } from '/shared/services/reference-service.js'

async function setSexTypes() {
    const sexSelectElement = document.querySelector('#sex')
    const response = await ReferenceService.getSexTypes()
    const sexTypes = await response.json()
    
    for (const sex of sexTypes) {
        const sexOption = document.createElement('option')
        sexOption.value = sex.id
        sexOption.innerText = sex.description
        sexSelectElement.appendChild(sexOption)
    }
}

async function setGenderTypes() {
    const genderSelectElement = document.querySelector('#gender')
    const response = await ReferenceService.getGenderTypes()
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

await setSexTypes()
await setGenderTypes()
await setLegalRepresentativeDegrees()
