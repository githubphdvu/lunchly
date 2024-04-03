const express = require("express")
const nunjucks = require("nunjucks")
const bodyParser = require("body-parser")
const routes = require("./routes")

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))//Parse body for urlencoded (non-JSON) data

nunjucks.configure("templates", {autoescape: true,express: app})
app.use(routes)

app.use((req, res, next)=>{//404 handler
    const err = new Error("Not Found")
    err.status = 404  
    return next(err)//pass error to next piece of middleware
})
app.use((err, req, res, next) => {//general error handler
    res.status(err.status || 500)
    return res.render("error.html", { err })
})
module.exports = app
