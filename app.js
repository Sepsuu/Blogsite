var express             = require("express"),
methodOverride      = require("method-override"),
//expressSanitizer    = require("express-sanitizer"),
bodyParser          = require("body-parser"),
routes              = require('./routes/index.js'),
passport            = require('passport');
app                 = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
//app.use(expressSanitizer());
app.use(methodOverride("_method"));
app.use(require("express-session")({
    secret: "snip snap doggerino",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());


app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

app.use('/', routes);




app.listen(4000, function() {
console.log("Server listening on port 4000");
});

module.exports = app;