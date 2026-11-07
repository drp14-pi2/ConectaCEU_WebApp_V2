export class ApiHelper {
    static getResponseError(originalText) {
        const responseObj = JSON.parse(originalText)

        if (responseObj.detail) return responseObj.detail

        return originalText
    }
}
