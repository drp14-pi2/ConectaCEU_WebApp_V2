export function showMessage(text, duration = 5000) {
    // Remove any existing toast so they don't stack
    document.getElementById('toast')?.remove();

    const html = `
        <style>
            .toast {
                position: fixed;
                bottom: 24px;
                left: 50%;
                transform: translateX(-50%);
                background-color: var(--medium-blue);
                color: var(--white);
                padding: 12px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                z-index: 2000;
                opacity: 0;
                transition: opacity 0.3s ease;
                pointer-events: none;
                max-width: 90vw;
            }

            .toast.toast--visible {
                opacity: 1;
            }
        </style>
        <div id="toast" class="toast" role="status" aria-live="polite"></div>
    `;

    document.body.insertAdjacentHTML('beforeend', html);

    const toast = document.getElementById('toast');
    toast.innerHTML = text;

    // Trigger the fade-in after the element is in the DOM
    requestAnimationFrame(() => toast.classList.add('toast--visible'));

    // Fade out, then remove
    return new Promise((resolve) => {
    setTimeout(() => {
        toast.classList.remove('toast--visible');
        toast.addEventListener('transitionend', () => {
        toast.remove();
        resolve();
        }, { once: true });
    }, duration);
    });
}
