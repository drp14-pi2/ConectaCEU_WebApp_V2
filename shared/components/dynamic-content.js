import { AuthService } from '/shared/services/auth-service.js'
import { storageKeys } from '/shared/constants/storage-keys.js'

class DynamicContent extends HTMLElement {
    async connectedCallback() {
        const src = this.getAttribute('src')
        const response = await fetch(src)
        this.innerHTML = await response.text()

        // Re-run any <script> tags — innerHTML-inserted scripts don't execute
        this.querySelectorAll('script').forEach((oldScript) => {
            const newScript = document.createElement('script');
            for (const { name, value } of oldScript.attributes) {
                newScript.setAttribute(name, value);
            }
            newScript.textContent = oldScript.textContent;
            oldScript.replaceWith(newScript);
        });

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
            button.addEventListener('click', () => AuthService.logout())
            header.appendChild(button)
        }
    }
}
customElements.define('dynamic-content', DynamicContent)
