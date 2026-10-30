export class ArrayHelper {
    static arrayToString(array) {
        let result = ''

        if (!array) return result

        for (let i; i < array.length; i++) {
            const item = array[i]

            if (typeof item == 'object') {
                result += JSON.stringify(item)
            }
            else if (typeof item == 'string') {
                result += item
            }
            else {
                result += String(item)
            }

            if (result.length != 0 && i < array.length - 1) {
                result += '\n'
            }
        }

        return result
    }
}
