export function setLoading(button, isLoading, replacementText = '') {
    if (isLoading) {
        if (!button.dataset.originalHtml) {
            button.dataset.originalHtml = button.innerHTML
        }

        if (replacementText) {
            button.textContent = replacementText
        }

        button.classList.add('button-loading')
        button.disabled = true
    } else {
        if (button.dataset.originalHtml != null) {
            button.innerHTML = button.dataset.originalHtml
            delete button.dataset.originalHtml
        }
        button.classList.remove('button-loading')
        button.disabled = false
    }
}
