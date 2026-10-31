export class CreateEducationalUnit {
    name
    zipCode
    street
    number
    complement
    neighborhood

    constructor(
        name,
        zipCode,
        street,
        number,
        complement,
        neighborhood) {
        this.name = name
        this.zipCode = zipCode
        this.street = street
        this.number = number
        this.complement = complement
        this.neighborhood = neighborhood
    }
}
