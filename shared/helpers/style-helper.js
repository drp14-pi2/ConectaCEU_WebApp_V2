export class StyleHelper {
    static setDisplay(element, displayType) {
        if (getComputedStyle(element).display != displayType) {
            element.style.display = displayType
        }
    }
}
