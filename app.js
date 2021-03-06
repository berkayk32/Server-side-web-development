const express = require("express")
const hbs = require("express-handlebars")
const bodyParser = require("body-parser")
var session = require('express-session')
var MySQLStore = require('express-mysql-session')(session);

var csrf = require('csurf');
var cookieParser = require('cookie-parser')

const app = express()

const dbInfo = require("./objects").databaseInfo

var options = {
    host: dbInfo.host,
    port: dbInfo.port,
    user: dbInfo.login,
    password: dbInfo.password,
    database: dbInfo.databaseName
};
 
var sessionStore = new MySQLStore(options);
const csrfProtection = csrf({ cookie: true  })

const MS = 1000
const SEC = 0
const MIN = 15
const HOUR = 0

app.set('trust proxy', 1) // trust first proxy
app.use(session({
    store: sessionStore,
    secret: 'keyboard cat',
    resave: false,
    rolling:true,
    saveUninitialized: true,
    cookie: {maxAge: 
        (MS * SEC) + 
        (MS * 60 * MIN) +
        (MS * 60 * 60 * HOUR)
    }
}))

app.use(express.static("public"))

app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(cookieParser())
app.use(csrfProtection)

app.use(function(req, res, next){
    res.locals.session = req.session
    next()
})

app.engine("hbs", hbs({
    defaultLayout: "main",
    extname: ".hbs",
    helpers: require(__dirname + "/pl/functionality/handlebar_helper"),
    layoutsDir: __dirname + "/pl/views/layouts",
    partialsDir:__dirname + "/pl/views/partials"
}))

app.set("views", __dirname + "/pl/views/")


// Setup req object
app.use(function(req, res, next) {
    if (!req.query) { req.query = { } }

    if (!req.query.searchString) { req.query.searchString = "" }

    if (!req.query.limit) { req.query.limit = 20 }

    if (!req.query.currentPage) { req.query.currentPage = 1 }

    if (!req.query.classification) { req.query.classification = "" }

    req.query.offset = (req.query.currentPage - 1) * req.query.limit

    var token = req.csrfToken();
    res.cookie('csrf-token', token);
    res.locals._csrf  = token;

    return next()
})

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
});
  
const startDelay = require("./dal/sequelize_settings")

setTimeout(function() {
    // delay this part, until db is done.
    const routerAccounts = require("./pl/routers/accounts-router")
    const routerBooks = require("./pl/routers/books-router")
    const routerAuthors = require("./pl/routers/authors-router")
    const routerClassifications = require("./pl/routers/classifications-router")
    const routerApiBooks = require("./pl/routers/api/books-router")

    app.use("/authors", routerAuthors)
    app.use("/accounts", routerAccounts)
    app.use("/books", routerBooks)
    app.use("/classifications", routerClassifications)
    app.use("/api/books", routerApiBooks)



    app.post("/accounts/logout", function(req, res) {
        req.session.destroy(function(err) { })
        res.redirect("./login")
    })

 
    app.get("/", function (req, res) {
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

    
    const port = process.env.PORT || 8080

    app.listen(port)

}, startDelay)
