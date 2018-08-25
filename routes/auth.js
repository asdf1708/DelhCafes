var express = require('express');
var router = express.Router();
var passport = require('passport');
var user =require('../models/user');
router.get('/',(req,res)=>{
    res.render('home.ejs');
})
router.get('/register',(req,res)=>{
    res.render('register');
})

router.post('/register',(req,res)=>{
    var newUser = new user({username:req.body.username});
    user.register(newUser,req.body.password,(err,user)=>{
        if(err){
            console.log(err);
            return res.render('register');
        } 
        passport.authenticate('local')(req,res,()=>{
            req.flash("success", "Successfully Signed Up! Nice to meet you " + req.body.username);
            res.redirect('/cafes');
        })
    });
})

router.get('/login',(req,res)=>{
    res.render('login');
})

router.post('/login',passport.authenticate('local',{successRedirect:'/cafes',failureRedirect:'/login',failureFlash: true,
successFlash: 'You successfully Logged in!'}),(req,res)=>{
})

router.get('/logout',(req,res)=>{
    req.logout();
    req.flash("success","Logged you out!")
    res.redirect('/cafes');
})

module.exports =router;