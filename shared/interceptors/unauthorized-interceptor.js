import { AuthService } from '/shared/services/auth-service.js'
import { storageKeys } from '/shared/constants/storage-keys.js'

const INSTALLED = Symbol.for('app.unauthorizedInterceptorInstalled')

if (!window[INSTALLED]) {
    window[INSTALLED] = true

    const originalFetch = window.fetch.bind(window)
    const REFRESH_ENDPOINT = '/auth/refresh'
    let refreshPromise = null // Shared refresh

    function isRefreshCall(input) {
        const url = typeof input === 'string' ? input : input?.url ?? ''

        return url.includes(REFRESH_ENDPOINT)
    }

    async function refreshTokens() {
        const refreshToken = sessionStorage.getItem(storageKeys.refreshToken)
        if (!refreshToken) throw new Error('no refresh token')

        const response = await AuthService.refreshToken(refreshToken)
        if (!response.ok) throw new Error('refresh failed')

        const body = await response.json()
        sessionStorage.setItem(storageKeys.authToken, body.access_token)
        if (body.refresh_token) {
            sessionStorage.setItem(storageKeys.refreshToken, body.refresh_token)
        }
    }

    window.fetch = async (input, init = {}, _isRetry = false) => {
        // Clone Request bodies so the retry has a body to send
        const isRequest = input instanceof Request
        const firstInput = isRequest ? input.clone() : input
        const retryInput = isRequest ? input.clone() : input

        const response = await originalFetch(firstInput, init)

        // Pass through non-401s, retries, and the refresh call itself
        if (response.status !== 401 || _isRetry || isRefreshCall(input)) {
            return response
        }

        // Concurrent 401s share one refresh
        if (!refreshPromise) {
            refreshPromise = refreshTokens().finally(() => {
                refreshPromise = null
            })
        }

        try {
            await refreshPromise
        } catch {
            AuthService.logout()

            return response  // Return the original 401 to the caller
        }

        // Retry once, re-entering the chain so the auth interceptor
        // Attaches the new token
        return window.fetch(retryInput, init, true)
    }
}
