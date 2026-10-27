export class User {
    id
    name
    email
    userTypeId
    educationalUnitId

    constructor(id, name, email, userTypeId, educationalUnitId) {
        this.id = id
        this.name = name
        this.email = email
        this.userTypeId = userTypeId
        this.educationalUnitId = educationalUnitId
    }
}
