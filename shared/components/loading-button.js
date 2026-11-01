export function setLoading(button, isLoading) {
    if (isLoading) {
        if (!button.dataset.originalText) {
            button.dataset.originalText = button.textContent
        }
        
        button.textContent = 'Carregando...'
        button.classList.add('button-loading')
        button.disabled = true
    } else {
        button.textContent = button.dataset.originalText ?? button.textContent
        button.classList.remove('button-loading')
        button.disabled = false
    }
}
