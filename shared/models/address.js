export class CreateAddress {
    zipCode
    street
    number
    complement
    neighborhood

    constructor(
        zipCode,
        street,
        number,
        complement,
        neighborhood) {
        this.zipCode = zipCode
        this.street = street
        this.number = number
        this.complement = complement
        this.neighborhood = neighborhood
    }
}
