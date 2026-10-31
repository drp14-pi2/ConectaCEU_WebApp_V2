import { AuthService } from '/shared/services/auth-service.js'
import { storageKeys } from '/shared/constants/storage-keys.js'

const authToken = sessionStorage.getItem(storageKeys.authToken)

if (!authToken) AuthService.logout()
