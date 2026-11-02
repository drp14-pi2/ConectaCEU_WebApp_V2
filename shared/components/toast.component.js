export function showMessage(text, duration = 5000) {
    // Remove any existing toast so they don't stack
    document.getElementById('toast')?.remove()

    const html = '<div id="toast" class="toast" role="status" aria-live="polite"></div>'

    document.body.insertAdjacentHTML('beforeend', html)

    const toast = document.getElementById('toast')
    toast.innerHTML = text

    // Trigger the fade-in after the element is in the DOM
    requestAnimationFrame(() => toast.classList.add('toast--visible'))

    // Fade out, then remove
    return new Promise((resolve) => {
        setTimeout(() => {
            toast.classList.remove('toast--visible')
            const done = () => { toast.remove(); resolve() }
            toast.addEventListener('transitionend', done, { once: true })
            setTimeout(done, 400)  // Safety in case transition won't finish
        }, duration)
    })
}
