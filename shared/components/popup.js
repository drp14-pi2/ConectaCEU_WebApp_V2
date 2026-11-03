const OVERLAY_CLASS = 'popup-overlay';
const POPUP_CLASS = 'popup';

let overlay = null;
let popup = null;
let onClose = null;

function ensurePopup() {
    if (overlay) return;

    overlay = document.createElement('div');
    overlay.className = OVERLAY_CLASS;
    overlay.hidden = true;

    popup = document.createElement('div')
    popup.className = POPUP_CLASS;
    popup.setAttribute('role', 'dialog')
    popup.setAttribute('aria-modal', 'true')
    popup.setAttribute('aria-labelledby', 'popup-title')

    popup.innerHTML = `
        <h2 id="popup-title"></h2>
        <div class="popup-body"></div>
        <div class="popup-btn-row">
            <button type="button" class="popup-close" aria-label="Fechar">Fechar</button>
        </div>
    `;

    overlay.appendChild(popup)
    document.body.appendChild(overlay)

    // Close: button
    popup.querySelector('.popup-close').addEventListener('click', () => closePopup())

    // Close: backdrop click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closePopup()
    })

    // Close: Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !overlay.hidden) closePopup()
    })
}

/**
 * @param {Object} options
 * @param {string} [options.title]
 * @param {string|Node} [options.content]   — HTML string or a DOM node
 * @param {Function} [options.onClose]
 */
export function openPopup({ title = '', content = '', buttons = [], onClose: cb } = {}) {
    ensurePopup()

    popup.querySelector('#popup-title').textContent = title

    const body = popup.querySelector('.popup-body')
    body.replaceChildren()
    if (content instanceof Node) body.appendChild(content)
    else body.innerHTML = content

    const btnRow = popup.querySelector('.popup-btn-row')

    // remove only the dynamic buttons, keep the static close button
    btnRow.querySelectorAll('.popup-action').forEach((el) => el.remove())

    for (const { label, onClick, variant } of buttons) {
        const b = document.createElement('button')
        b.type = 'button'
        b.textContent = label
        b.classList.add('popup-action')        // ← marker
        if (variant) b.classList.add(variant)
        b.addEventListener('click', () => onClick?.())
        btnRow.appendChild(b)
    }

    onClose = cb ?? null
    popup.parentElement.hidden = false
    popup.querySelector('.popup-close')?.focus()
}

export function closePopup() {
    if (!overlay || overlay.hidden) return;
    overlay.hidden = true;
    popup.querySelector('.popup-body').replaceChildren();
    onClose?.();
    onClose = null;
}
