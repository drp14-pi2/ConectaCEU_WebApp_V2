import { DocumentType } from '/shared/constants/document-type.js'

export class FileHelper {
    static fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(file);
        });
    }

    static renderDocumentNode(doc) {
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
            iframe.title = doc.document_type_id ? DocumentType.getName(doc.document_type_id) : ''
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
}
