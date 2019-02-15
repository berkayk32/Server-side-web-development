const express = require("express")
const hbs = require("express-handlebars")
const bodyParser = require("body-parser")

const app = express()

app.use(express.static("public"))

app.use(bodyParser.urlencoded({
    extended: false
}))

app.engine("hbs", hbs({
    defaultLayout: "main",
    extname: ".hbs",
    layoutsDir: __dirname + "/pl/views/layouts",
    partialsDir:__dirname + "/pl/views/partials"
}))

app.set("views", __dirname + "/pl/views/")

// Setup req object
app.use(function(req, res, next) {
    if (!req.query) { req.query = { } }

    if (!req.query.searchString) {
        req.query.searchString = ""
    }
    if (!req.query.limit) {
        req.query.limit = 20
    }
    if (!req.query.currentPage) {
        req.query.currentPage = 1
    }
    req.query.offset = (req.query.currentPage - 1) * req.query.limit

    return next()
})

const resetDatabase = require("./dal/sequelize_settings")
let startDelay = 0;
if (resetDatabase) { startDelay = 3000 }

setTimeout(function() {
    // delay this part, until db is done.
    const routerAccounts = require("./pl/routers/accounts-router")
    const routerBooks = require("./pl/routers/books-router")
    const routerAuthors = require("./pl/routers/authors-router")
    
    app.use("/accounts", routerAccounts)
    app.use("/books", routerBooks)
    app.use("/authors", routerAuthors)
    
    app.get("/home", function (req, res) {
        res.render("home.hbs")
    })

    app.get("/about", function (req, res) {
        new Promise(function (resolve, reject) {
            if (true) {
                resolve()
            }
            else {
                reject()
            }
        }).then(function () {

            res.render("about.hbs")
        }).catch(result => {
            res.status(res.status).json(res)
        })
    })

    app.listen(8080)

}, startDelay)
