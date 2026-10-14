import { storageKeys } from '/shared/constants/storage-keys.js'
import { logout } from '/shared/functions/logout.js'

const authToken = sessionStorage.getItem(storageKeys.authToken)

if (!authToken) logout()
