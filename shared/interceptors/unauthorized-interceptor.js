import { AuthService } from '/shared/services/auth-service.js'

const INSTALLED = Symbol.for('app.unauthorizedInterceptorInstalled')

if (!window[INSTALLED]) {
    window[INSTALLED] = true

    const originalFetch = window.fetch.bind(window)

    window.fetch = async (input, init = {}) => {
        const response = await originalFetch(input, init)

        if (response.status === 401) AuthService.logout()

        return response
    }
}
