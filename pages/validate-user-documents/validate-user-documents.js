import { UserService } from '/shared/services/user-service.js'
import { DocumentService } from '/shared/services/document-service.js'
import { showMessage } from '/shared/components/toast.component.js'
import { pageRouting } from '/shared/constants/page-routing.js'
import { UserType } from '/shared/constants/user-type.js'
import { DocumentType } from '/shared/constants/document-type.js'
import { DocumentValidationStatusType } from '/shared/constants/document-validation-status-type.js'
import { openPopup } from '/shared/components/popup.js';
import { setLoading } from '/shared/components/loading-button.js';

const params = new URLSearchParams(window.location.search);
const userId = params.get('id');

if (!userId) location.href = pageRouting.validateDocuments

// Get user data
async function getUserIdentityDocument(userId) {
    const response = await DocumentService.getUserIdentityDocument(userId)

    if (response.ok) {
        const responseBody = await response.json()
        const firstDocument = responseBody[0]

        if (firstDocument.document_type_id) {
            return DocumentType.getName(firstDocument.document_type_id)
        }
    }
    
    return ''
}
async function setUserData() {
    const response = await UserService.get(userId)

    if (!response.ok) {
        showMessage(await response.text())
        location.href = pageRouting.validateDocuments

        return
    }

    const user = await response.json()

    // Name
    const userNameElement = document.querySelector('#user-name')
    userNameElement.value = user.name

    // Document type
    const documentTypeElement = document.querySelector('#select-document-type')
    const documentTypeOption = document.createElement('option')
    documentTypeOption.textContent = await getUserIdentityDocument(userId)
    documentTypeElement.appendChild(documentTypeOption)

    // Document
    const userDocumentElement = document.querySelector('#user-document')
    userDocumentElement.value = user.document

    // Phone
    const phoneElement = document.querySelector('#phone')
    phoneElement.value = user.cellphone_number

    // E-mail
    const emailElement = document.querySelector('#email')
    emailElement.value = user.email

    // User type
    const userTypeElement = document.querySelector('#user-type')
    const userTypeOptionElement = document.createElement('option')
    userTypeOptionElement.textContent = UserType.getName(user.user_type_id)
    userTypeElement.appendChild(userTypeOptionElement)

    return
}
await setUserData()

// Get document
async function getDocument(documentId) {
    const response = await DocumentService.get(documentId)

    if (!response.ok) {
        showMessage(await response.text())
    }

    return await response.json();
}

function reloadPage() {
    location.href = `${pageRouting.validateUserDocuments}?id=${userId}`
}

async function rejectDocument(documentId) {
    async function reject() {
        let buttons = document.getElementsByClassName('popup-action')
        let button = buttons[buttons.length - 1]
        setLoading(button, true, 'Enviando...')

        const rejectionReason = document.querySelector('textarea').value

        if (!rejectionReason || rejectionReason.length < 10) {
            showMessage('Motivo da rejeição precisa de pelo menos 10 caracteres')
            setLoading(button, false)

            return
        }

        const validationBody = {
            documentId: documentId,
            documentValidationStatusTypeId: DocumentValidationStatusType.rejected,
            rejectionReason: rejectionReason
        }
        const response = await DocumentService.validate(validationBody)

        if (!response.ok) {
            showMessage(await response.text())

            return
        }

        await showMessage('Documento rejeitado', 3000)
        reloadPage()
    }

    openPopup({
        title: 'Motivo da rejeição',
        content: '<textarea placeholder="Providencie uma justificativa para a rejeição..." require></textarea>',
        buttons: [
            { label: 'Rejeitar', onClick: async () => await reject() },
        ]
    })

    buttons = document.getElementsByClassName('popup-action')
    button = buttons[buttons.length - 1]
    setLoading(button, true, 'Enviando...')
}

async function acceptDocument(documentId) {
    const buttons = document.getElementsByClassName('popup-action')
    const button = buttons[buttons.length - 1]
    setLoading(button, true, 'Enviando...')
    const validationBody = {
        documentId: documentId,
        documentValidationStatusTypeId: DocumentValidationStatusType.approved
    }

    const response = await DocumentService.validate(validationBody)

    if (!response.ok) {
        showMessage(await response.text())

        return
    }

    await showMessage('Documento aceito', 3000)
    reloadPage()
}

function renderDocumentNode(doc) {
    const container = document.createElement('div')
    container.className = 'doc-render'

    // Normalize to a data URL
    const dataUrl = doc.base64.startsWith('data:')
        ? doc.base64
        : `data:${doc.mimeType ?? 'application/octet-stream'};base64,${doc.base64}`

    const mime = dataUrl.slice(5, dataUrl.indexOf(';'))

    if (mime.startsWith('image/')) {
        const img = document.createElement('img')
        img.src = dataUrl
        img.alt = DocumentType.getName(doc.document_type_id)
        img.className = 'doc-render-image'
        container.appendChild(img)
    } else if (mime === 'application/pdf') {
        const iframe = document.createElement('iframe')
        iframe.src = dataUrl
        iframe.className = 'doc-render-pdf'
        iframe.title = DocumentType.getName(doc.document_type_id)
        container.appendChild(iframe)
    } else {
        // unknown / unsupported — offer a download link
        const link = document.createElement('a')
        link.href = dataUrl
        link.download = doc.fileName ?? 'documento'
        link.textContent = 'Baixar documento'
        container.appendChild(link)
    }

    return container
}

// Get pending validation
async function listPendingValidations() {
    const response = await DocumentService.listPendingValidations(userId)

    if (!response.ok) {
        showMessage(await response.text())

        return
    }

    const responseBody = await response.json()
    const DOCUMENTS_PER_ROW = 3
    const container = document.querySelector('.pending-documents-container')
    const eyeIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" fill="currentColor"><path d="M320 144C254.8 144 201.2 173.6 160.1 211.7C121.6 247.5 95 290 81.4 320C95 350 121.6 392.5 160.1 428.3C201.2 466.4 254.8 496 320 496C385.2 496 438.8 466.4 479.9 428.3C518.4 392.5 545 350 558.6 320C545 290 518.4 247.5 479.9 211.7C438.8 173.6 385.2 144 320 144zM127.4 176.6C174.5 132.8 239.2 96 320 96C400.8 96 465.5 132.8 512.6 176.6C559.4 220.1 590.7 272 605.6 307.7C608.9 315.6 608.9 324.4 605.6 332.3C590.7 368 559.4 420 512.6 463.4C465.5 507.1 400.8 544 320 544C239.2 544 174.5 507.2 127.4 463.4C80.6 419.9 49.3 368 34.4 332.3C31.1 324.4 31.1 315.6 34.4 307.7C49.3 272 80.6 220 127.4 176.6zM320 400C364.2 400 400 364.2 400 320C400 290.4 383.9 264.5 360 250.7C358.6 310.4 310.4 358.6 250.7 360C264.5 383.9 290.4 400 320 400zM240.4 311.6C242.9 311.9 245.4 312 248 312C283.3 312 312 283.3 312 248C312 245.4 311.8 242.9 311.6 240.4C274.2 244.3 244.4 274.1 240.5 311.5zM286 196.6C296.8 193.6 308.2 192.1 319.9 192.1C328.7 192.1 337.4 193 345.7 194.7C346 194.8 346.2 194.8 346.5 194.9C404.4 207.1 447.9 258.6 447.9 320.1C447.9 390.8 390.6 448.1 319.9 448.1C258.3 448.1 206.9 404.6 194.7 346.7C192.9 338.1 191.9 329.2 191.9 320.1C191.9 309.1 193.3 298.3 195.9 288.1C196.1 287.4 196.2 286.8 196.4 286.2C208.3 242.8 242.5 208.6 285.9 196.7z"/></svg>';
    container.replaceChildren()

    // Fetch all docs in parallel
    const docs = await Promise.all(
        responseBody.map((v) => getDocument(v.document_id).catch(() => null))
    )

    for (let i = 0; i < docs.length; i += DOCUMENTS_PER_ROW) {
        const chunk = docs.slice(i, i + DOCUMENTS_PER_ROW).filter(Boolean)

        if (chunk.length === 0) continue

        const row = document.createElement('div')
        row.classList.add('pending-documents-row')

        for (const doc of chunk) {
            const documentContainer = document.createElement('div')
            documentContainer.classList.add('pending-document')

            const documentType = document.createElement('div')
            documentType.classList.add('pending-document-type')
            documentType.textContent = DocumentType.getName(doc.document_type_id)

            const documentView = document.createElement('div')
            documentView.classList.add('pending-document-view')
            documentView.setAttribute('aria-label', `Ver documento ${doc.id}`)
            documentView.innerHTML = eyeIcon

            documentView.addEventListener('click', () => {
                const content = document.createElement('div')
                content.textContent = `Documento ID: ${doc.id}`

                openPopup({
                    title: DocumentType.getName(doc.document_type_id),
                    content: renderDocumentNode(doc),
                    buttons: [
                        { label: 'Rejeitar', onClick: async () => await rejectDocument(doc.id) },
                        { label: 'Aceitar', onClick: async () => await acceptDocument(doc.id) },
                    ]
                })
            })

            documentContainer.append(documentType, documentView)
            row.appendChild(documentContainer)
        }

        container.appendChild(row)
    }
}
await listPendingValidations()
