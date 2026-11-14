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

const stack = []

export function openPopup({ title = '', content = '', buttons = [], onClose: cb } = {}) {
    const overlay = document.createElement('div')
    overlay.className = 'popup-overlay'
    overlay.style.zIndex = String(1000 + stack.length)

    const popup = document.createElement('div')
    popup.className = POPUP_CLASS
    popup.setAttribute('role', 'dialog')
    popup.setAttribute('aria-modal', 'true')
    popup.setAttribute('aria-labelledby', 'popup-title')
    popup.innerHTML = `
        <h2 id="popup-title"></h2>
        <div class="popup-body"></div>
        <div class="popup-btn-row">
        <button type="button" class="popup-close" aria-label="Fechar">Fechar</button>
        </div>
    `

    // populate title
    popup.querySelector('#popup-title').textContent = title

    // populate body
    const body = popup.querySelector('.popup-body')
    if (content instanceof Node) body.appendChild(content)
    else body.innerHTML = content

    // populate action buttons (before the close button, or after — your choice)
    const btnRow = popup.querySelector('.popup-btn-row')
    for (const { label, onClick, variants } of buttons) {
        const b = document.createElement('button')
        b.type = 'button'
        b.textContent = label
        b.classList.add('popup-action')

        if (variants) {
            for (const variant of variants) {
                b.classList.add(variant)
            }
        }

        b.addEventListener('click', async () => {
        if (b.disabled) return
        b.disabled = true
        try { await onClick?.() } finally { b.disabled = false }
        })
        btnRow.appendChild(b)
    }

    // wire close
    popup.querySelector('.popup-close').addEventListener('click', () => closePopup())
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closePopup() })
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closePopup() })

    const entry = { overlay, popup, onClose: cb ?? null }
    stack.push(entry)

    overlay.appendChild(popup)
    document.body.appendChild(overlay)

    popup.querySelector('.popup-close')?.focus()
    return entry
}

export function closePopup() {
    const entry = stack.pop()
    if (!entry) return
    entry.overlay.remove()
    entry.onClose?.()
}
