export class StringHelper {
    static capitalize(str) {
        return str && typeof str === 'string' ? str[0].toUpperCase() + str.slice(1) : str
    }

    static removeNotNumber(str) {
        if (typeof str !== 'string') return str

        return str.replace(/\D/g, '');
    }
}
