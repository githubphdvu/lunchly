const db = require("../db")
const Reservation = require("./reservation")
class Customer {
    constructor({ id, firstName, lastName, phone, notes }) {
        this.id = id
        this.firstName = firstName
        this.lastName = lastName
        this.phone = phone
        this.notes = notes
    }
    set notes(val) {this._notes = val || ""}//methods for getting/setting notes (keep as empty string, not NULL)
    get notes() {return this._notes}
    set phone(val) {this._phone = val || null}//methods for getting/setting phone #
    get phone() {return this._phone}
    static async all() {//find all customers
        const results = await db.query(
           `SELECT id,first_name AS "firstName",last_name AS "lastName",phone,notes
            FROM customers
            ORDER BY last_name, first_name`
        )
        return results.rows.map(c => new Customer(c))
    }
    static async get(id) {//get a customer by ID
        const results = await db.query(
           `SELECT id,first_name AS "firstName",last_name AS "lastName",phone,notes 
            FROM customers WHERE id = $1`,[id]
        )
        const customer = results.rows[0]
        if (customer === undefined) {
            const err = new Error(`No such customer: ${id}`)
            err.status = 404
            throw err
        }
        return new Customer(customer)
    }
    get fullName() {return `${this.firstName} ${this.lastName}`}
    async getReservations(){return await Reservation.getReservationsForCustomer(this.id)}
    async save() {//save this customer
        if (this.id === undefined) {
            const result = await db.query(
                `INSERT INTO customers (first_name,last_name,phone,notes) VALUES ($1,$2,$3,$4) RETURNING id`,
                [this.firstName, this.lastName, this.phone, this.notes]
            )
            this.id = result.rows[0].id
        } 
        else {
            await db.query(
                `UPDATE customers SET first_name=$1,last_name=$2, phone=$3,notes=$4 WHERE id=$5`,
                [this.firstName, this.lastName, this.phone, this.notes, this.id]
            )
        }
    }
}
module.exports = Customer
