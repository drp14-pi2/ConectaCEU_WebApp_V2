export class CreateComponent {
    name
    description
    courseId

    constructor(
        name,
        description,
        courseId) {
        this.name = name
        this.description = description
        this.courseId = courseId
    }
}
