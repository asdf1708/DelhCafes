const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cafe= require('./models/cafe');
const comment = require('./models/comment'); 
const passport = require('passport');
const LocalStrategy = require('passport-local');
const user = require('./models/user');  
var commentRoutes = require('./routes/comments');
var cafeRoutes =require('./routes/cafes');
var authRoutes = require('./routes/auth');
const flash = require('connect-flash');
const methodOverride = require('method-override');
//const seedDB = require('./seeds');
//seedDB();
mongoose.Promise= global.Promise;
mongoose.connect('mongodb://localhost:27017/Delhicafes');
app.use(flash());
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(require('express-session')({
    secret:'SUPERSECRETPASSWORD',
    resave:false,
    saveUninitialized:false
}))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})
app.use(authRoutes);
app.use(commentRoutes);
app.use('/cafes',cafeRoutes);
app.use(methodOverride('_method'));



const port = process.env.PORT || 3001;
app.listen(port,()=>{
    console.log('SERVER HAS STARTED!!');
})