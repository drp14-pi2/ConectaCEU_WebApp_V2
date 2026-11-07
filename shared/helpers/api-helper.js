export class ApiHelper {
    static async getResponseError(response) {
        const originalText = await response.text()
        const responseObj = JSON.parse(originalText)

        if (responseObj.detail) return responseObj.detail
        else if (response.status === 429) return "Número excessivo de requisições feitas. Tente novamente mais tarde"

        return originalText
    }
}
