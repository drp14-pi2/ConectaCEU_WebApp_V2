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

export class ListClasses {
    componentId
    active
    startDate
    endDate
    page
    pageSize

    constructor(
        componentId,
        active,
        startDate,
        endDate,
        page,
        pageSize) {
        this.componentId = componentId
        this.active = active
        this.startDate = startDate
        this.endDate = endDate
        this.page = page
        this.pageSize = pageSize
    }
}
