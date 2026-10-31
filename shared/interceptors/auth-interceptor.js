import { storageKeys } from '/shared/constants/storage-keys.js'

const INSTALLED = Symbol.for('app.authInterceptorInstalled')

if (!window[INSTALLED]) {
    window[INSTALLED] = true

    const originalFetch = window.fetch.bind(window)

    window.fetch = (input, init = {}) => {
        const authToken = sessionStorage.getItem(storageKeys.authToken)

        if (authToken) {
            const headers = new Headers(init.headers)

            if (!headers.has('Authorization')) {
                headers.set('Authorization', `Bearer ${authToken}`)
            }

            init = { ...init, headers }
        }

        return originalFetch(input, init)
    }
}
