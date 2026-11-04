export class CreateCourse {
    name
    totalSeatLimit
    workload
    minStudentAge
    maxStudentAge
    shiftTypeId
    responsibleEducator1
    responsibleEducator2
    educationalUnitId
    components

    constructor(
        name,
        totalSeatLimit,
        workload,
        minStudentAge,
        maxStudentAge,
        shiftTypeId,
        responsibleEducator1,
        responsibleEducator2,
        educationalUnitId,
        components) {
        this.name = name
        this.totalSeatLimit = totalSeatLimit
        this.workload = workload
        this.minStudentAge = minStudentAge
        this.maxStudentAge = maxStudentAge
        this.shiftTypeId = shiftTypeId
        this.responsibleEducator1 = responsibleEducator1
        this.responsibleEducator2 = responsibleEducator2
        this.educationalUnitId = educationalUnitId
        this.components = components
    }
}
