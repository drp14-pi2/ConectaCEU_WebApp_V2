export class DateHelper {
    static toDateInputValue(date) {
        const y = date.getFullYear()
        const m = String(date.getMonth() + 1).padStart(2, '0')
        const d = String(date.getDate()).padStart(2, '0')

        return `${y}-${m}-${d}`
    }

    static diffInYears(a, b) {
        let years = b.getFullYear() - a.getFullYear();
        const monthDiff = b.getMonth() - a.getMonth();
        const dayDiff = b.getDate() - a.getDate();

        // If the b's month/day hasn't reached a's yet, subtract a year
        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
            years--;
        }
        
        return years;
    }

    static isMinor(date) {
        const today = new Date()
        const parsedBirthdate = new Date(`${date}T00:00:00`)
        const diffInYears = DateHelper.diffInYears(parsedBirthdate, today)

        return diffInYears < 18
    }
}
