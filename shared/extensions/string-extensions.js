export class StringExtensions {
    static capitalize(str) {
        return str && typeof str === 'string' ? str[0].toUpperCase() + str.slice(1) : str;
    }
}
