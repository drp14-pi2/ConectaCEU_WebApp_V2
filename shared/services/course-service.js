import { config } from '/config.js'

export class CourseService {
    static async create(createCourseBody) {
        return fetch(`${config.apiUrl}/course`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                name: createCourseBody.name,
                total_seat_limit: createCourseBody.totalSeatLimit,
                workload: createCourseBody.workload,
                min_student_age: createCourseBody.minStudentAge,
                max_student_age: createCourseBody.maxStudentAge,
                shift_type_id: createCourseBody.shiftTypeId,
                responsible_educator_1: createCourseBody.responsibleEducator1,
                responsible_educator_2: createCourseBody.responsibleEducator2,
                educational_unit_id: createCourseBody.educationalUnitId,
                components: createCourseBody.components?.length > 0 ? createCourseBody.components : null
            })
        })
    }
}
