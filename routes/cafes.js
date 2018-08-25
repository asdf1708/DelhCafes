var express = require('express');
var router = express.Router();
var cafe = require('../models/cafe'); 
//var middleware = require('../middleware');
router.get('/',(req,res)=>{
    cafe.find({},(err,allcafes)=>{
        if(err)
        res.status(400).send(err);
        res.render("/home/shubham/Documents/yelpcamp/views/cafes.ejs",{cafes:allcafes,currentUser:req.user});
    })
    
})

router.post('/',isLoggedIn,(req,res)=>{
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id:req.user._id,
        username:req.user.username
    }
    var newCafe = {name:name,image:image,description:desc,author:author};
    cafe.create(newCafe,(err,newly)=>{
        if(err) res.status(400).send(err);
        res.redirect('/cafes');
    })
    
})

router.get('/new',isLoggedIn,(req,res)=>{
    res.render('new.ejs');
})

router.get('/:id',(req,res)=>{
    
    cafe.findById(req.params.id).populate('comment').exec((err,foundCafe)=>{
        if(err || !foundCafe){
            req.flash('error', 'Sorry, that cafe does not exist!');
            return res.redirect('/cafes');
        }
        else{
            res.render("/home/shubham/Documents/yelpcamp/views/show.ejs",{cafe:foundCafe});
        }
    })
})
router.get('/:id/edit',checkCafeOwnership,(req,res)=>{
    cafe.findById(req.params.id,(err,foundCafe)=>{
        res.render('edit',{cafe:foundCafe});
    });   
})

router.post('/:id',checkCafeOwnership,(req,res)=>{
    cafe.findByIdAndUpdate(req.params.id,req.body.cafe,(err,updatedCafe)=>{
        if(err){
            req.flash("error", err.message);
            res.redirect('back');
        }else{
            req.flash("success","Successfully Updated!");
            res.redirect('/cafes/' + req.params.id)
        }

    })
})
function checkCafeOwnership(req,res,next){
    if(req.isAuthenticated()){
        cafe.findById(req.params.id,(err,foundCafe)=>{
            if(err) res.redirect('back');
            else{
                if(foundCafe.author.id.equals(req.user._id)){
                next();
                }else{
                    res.redirect('back');
                }
            }
        })    
    }else{
        res.redirect('back');
    }
    
}
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","Please Login First!");
    res.redirect('/login');
}


module.exports =router;