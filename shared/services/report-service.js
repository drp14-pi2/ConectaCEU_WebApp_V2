import { config } from '/config.js'

export class ReportService {
    static async getStudentsByCourse(courseId, educationalUnitId){
        const params = new URLSearchParams();

        if (courseId) {
            params.set('course_id', courseId);
        }

        if (educationalUnitId) {
            params.set('educational_unit_id', educationalUnitId);
        }

        let resource = `${config.apiUrl}/report/students-by-course` 

        if (params.size) resource += `?${params}`

        return await fetch(resource)
    }

    static async getStudentsByCourseXlsx(courseId, educationalUnitId){
        const params = new URLSearchParams();

        if (courseId) {
            params.set('course_id', courseId);
        }

        if (educationalUnitId) {
            params.set('educational_unit_id', educationalUnitId);
        }

        let resource = `${config.apiUrl}/report/students-by-course/xlsx` 

        if (params.size) resource += `?${params}`

        return await fetch(resource)
    }

    static async getCourseVacancies(courseId, educationalUnitId){
        const params = new URLSearchParams();

        if (courseId) {
            params.set('course_id', courseId);
        }

        if (educationalUnitId) {
            params.set('educational_unit_id', educationalUnitId);
        }

        let resource = `${config.apiUrl}/report/course-vacancies` 

        if (params.size) resource += `?${params}`

        return await fetch(resource)
    }

    static async getCourseVacanciesXlsx(courseId, educationalUnitId){
        const params = new URLSearchParams();

        if (courseId) {
            params.set('course_id', courseId);
        }

        if (educationalUnitId) {
            params.set('educational_unit_id', educationalUnitId);
        }

        let resource = `${config.apiUrl}/report/course-vacancies/xlsx` 

        if (params.size) resource += `?${params}`

        return await fetch(resource)
    }

    static async getUserEnrollments(userId) {
        return await fetch(`${config.apiUrl}/report/user/${userId}/enrollments`)
    }
}
