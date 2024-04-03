const express = require("express")
const Customer = require("./models/customer")
const Reservation = require("./models/reservation")
const router = new express.Router()

router.get("/", async (req, res, next)=>{
    try {
        const customers = await Customer.all()
        return res.render("customer_list.html", { customers })
    } 
    catch (err) {return next(err)}
})
router.get("/add/", async (req, res, next)=>{
    try {
        return res.render("customer_new_form.html")
    }
    catch (err) {return next(err)}
})
router.post("/add/", async (req, res, next)=>{//Handle add customer
    try {
        const firstName = req.body.firstName
        const lastName = req.body.lastName
        const phone = req.body.phone
        const notes = req.body.notes
        const customer = new Customer({ firstName, lastName, phone, notes })
        await customer.save()
        return res.redirect(`/${customer.id}/`)
    } 
    catch (err) {return next(err)}
})
router.get("/:id/", async (req, res, next)=>{
    try {
        const customer = await Customer.get(req.params.id)
        const reservations = await customer.getReservations()
        return res.render("customer_detail.html", { customer, reservations })
    }
    catch (err) {return next(err)}
})
router.get("/:id/edit/", async (req, res, next)=>{
    try {
        const customer = await Customer.get(req.params.id)
        res.render("customer_edit_form.html", { customer })
    } 
    catch (err) {return next(err)}
})
router.post("/:id/edit/", async (req, res, next)=>{//handle edit customer
    try {
        const customer = await Customer.get(req.params.id)
        customer.firstName = req.body.firstName
        customer.lastName = req.body.lastName
        customer.phone = req.body.phone
        customer.notes = req.body.notes
        await customer.save()
        return res.redirect(`/${customer.id}/`)
    }
    catch (err) {return next(err)}
})
router.post("/:id/add-reservation/", async (req, res, next)=>{//handle add reservation
    try {
        const customerId = req.params.id
        const startAt = new Date(req.body.startAt)
        const numGuests = req.body.numGuests
        const notes = req.body.notes
        const reservation = new Reservation({customerId,startAt,numGuests,notes})
        await reservation.save()
        return res.redirect(`/${customerId}/`)
    }
    catch (err) {return next(err)}
})
module.exports = router
