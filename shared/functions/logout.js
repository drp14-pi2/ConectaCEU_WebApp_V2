import { storageKeys } from '/shared/constants/storage-keys.js'
import { pageRouting } from '/shared/constants/page-routing.js'

export function logout() {
    sessionStorage.removeItem(storageKeys.authToken)
    location.href = pageRouting.root
}
