export class ArrayHelper {
    static arrayToString(array) {
        let result = ''
        
        if (!array) return result

        function processItem(item, index) {
            if (typeof item == 'object') {
                result += JSON.stringify(item)
            }
            else if (typeof item == 'string') {
                result += item
            }
            else {
                result += String(item)
            }

            if (result.length != 0 && index < array.length - 1) {
                result += '<br>'
            }
        }

        for (let i = 0; i < array.length; i++) {
            const item = array[i]

            if (Array.isArray(item)) {
                for (let j = 0; j < item.length; j++) {
                    const subItem = item[j]
                    processItem(subItem, j)
                }
            }
            else {
                processItem(item, i)
            }
        }

        return result
    }
}
