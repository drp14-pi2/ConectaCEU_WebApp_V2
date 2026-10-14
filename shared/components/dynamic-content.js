class DynamicContent extends HTMLElement {
    connectedCallback() {
        const src = this.getAttribute('src');
        fetch(src)
            .then(response => response.text())
            .then(html => {
                this.innerHTML = html;
            });
    }
}
customElements.define('dynamic-content', DynamicContent);