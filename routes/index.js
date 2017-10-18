var express         = require('express'),
    Router          = express.Router(),
    passport        = require('passport'),
    Blog            = require('../models/blogModel'),
    User            = require('../models/userModel'),
    LocalStrategy   = require('passport-local');



function isLoggedin(req, res, next) {
if (req.isAuthenticated()) {
    return next();
} 
res.redirect('/login');
}

Router.use((req, res, next) => {
res.locals.currentUser = req.user;
next();
});

Router.get("/", function(req, res) {
res.redirect("/blogs");
});

/**
* Register
*/
Router.get('/register', (req, res) => {
res.render("register");
});

Router.post('/register', (req, res) => {
var newUser = new User({username: req.body.username});
User.register(newUser, req.body.password, (err, user) => {
    if (err) {
        console.log(err);
        return res.render('register');
    }
    passport.authenticate('local')(req, res, () => {
        res.redirect('/blogs');
    });
});
});

/**
* login
*/
Router.get('/login', (req, res) => {
res.render('login');
});

Router.post('/login', passport.authenticate('local', {successRedirect: '/blogs',
                                                  failureRedirect: '/login'}), 
                                                  (req, res) => {
});

/**
* Logout
*/

Router.get('/logout', (req, res) => {
req.logout();
res.redirect('/blogs');
})

Router.get("/blogs", (req, res) => {

Blog.find({}, (err, blogs) => {

if (err) {

    console.log("Error.");

} else {

    res.render("index", {blogs: blogs});
}
});
});

// NEW
Router.get("/blogs/new", (req, res) => {

res.render("new");

});

// CREATE new post
Router.post("/blogs", isLoggedin, (req, res) => {
// create new blogpost
Blog.create(req.body.blog, (err, newBlog) => {

    if (err) {
        res.render("new");
    } else {
        // identifie post author
        newBlog.author.id = req.user._id;
        newBlog.author.username = req.user.username;
        newBlog.save();
        res.redirect("/blogs");
    }
});
});

// show selected blogpost
Router.get("/blogs/:id", (req, res, next) => {

Blog.findById(req.params.id, (err, foundBlog) => {
    if (err) {
        res.redirect("/blogs");
    } else {
        res.render("show", {blog: foundBlog});
    }
    
});
});

// Edit blogpost
Router.get("/blogs/:id/edit", (req, res) => {

Blog.findById(req.params.id, (err, foundBlog) => {
    if (err) {
        res.redirect("/blogs");
    } else {
        res.render("edit", {blog: foundBlog});
    }
    
});
});

// UPDATE blogpost route
Router.put("/blogs/:id", (req, res) => {
//req.body.blog.body = req.sanitize(req.body.blog.body);
db.Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
if (err) {
    res.redirect("/blogs");
} else {
    res.redirect("/blogs/" + req.params.id);
}
});
});

// DELETE blogpost
Router.delete("/blogs/:id", (req, res) => {
Blog.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
        res.redirect("/blogs");
    } else {
        res.redirect("/blogs");
    }
    
});

});



passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



module.exports = Router;