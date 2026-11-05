export class CreateClass {
    courseComponentId
    startDate
    endDate
    daysOfWeek
    seatsToUse

    constructor(
        courseComponentId,
        startDate,
        endDate,
        daysOfWeek,
        seatsToUse) {
        this.courseComponentId = courseComponentId
        this.startDate = startDate
        this.endDate = endDate
        this.daysOfWeek = daysOfWeek
        this.seatsToUse = seatsToUse
    }
}
