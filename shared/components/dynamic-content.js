import { logout } from '/shared/functions/logout.js'
import { storageKeys } from '/shared/constants/storage-keys.js'

class DynamicContent extends HTMLElement {
    async connectedCallback() {
        const src = this.getAttribute('src')
        const response = await fetch(src)
        this.innerHTML = await response.text()

        const token = sessionStorage.getItem(storageKeys.authToken)
        const header = this.querySelector('header')

        if (token && header) {
            const button = document.createElement('button')
            button.textContent = 'Sair'
            button.id = 'logout-button'
            Object.assign(button.style, {
                position: 'absolute',
                right: '10px',
                top: '10px',
            })
            button.addEventListener('click', () => logout())
            header.appendChild(button)
        }
    }
}
customElements.define('dynamic-content', DynamicContent)