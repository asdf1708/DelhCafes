var express = require('express');
var router = express.Router();
var cafe = require('../models/cafe');
var comment = require('../models/comment');
//var middleware = require('../middleware');
router.get('/cafes/:id/comment/new',isLoggedIn,(req,res)=>{
    cafe.findById(req.params.id,(err,xcafe)=>{
        if(err) console.log(err);
        else{
            res.render('comments/new.ejs',{cafe:xcafe});
        }
    })
    
})

router.post('/cafes/:id/comment',isLoggedIn,(req,res)=>{
    cafe.findById(req.params.id,(err,cafe)=>{
        if(err){
            console.log(err)
            res.redirect('/cafes');
        } 
        else{
            comment.create(req.body.comment,(err,comment)=>{
                if(err) console.log(err)
                else{
                    comment.author.id= req.user._id;    
                    comment.author.username = req.user.username;
                    comment.save();
                     cafe.comment.push(comment);
                     cafe.save();
                     req.flash('success', 'Created a comment!');
                     res.redirect('/cafes/'+ cafe._id);
                }
            })
        }   
    })
})

router.get('/cafes/:id/comment/:comment_id/edit',checkCommentOwnership,(req,res)=>{
    comment.findById(req.params.comment_id,(err,foundComment)=>{
        if(err){
            res.redirect('back');
        } else{
            res.render('comments/edit',{cafe_id:req.params.id,comment:foundComment});
        }
    })
    
})

router.post('/cafes/:id/comment/:comment_id',checkCommentOwnership,(req,res)=>{
    comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,(err,updatedComment)=>{
        if(err) res.redirect('back');
        else{
            res.redirect('/cafes/'+req.params.id);
        }
    })
})
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","Please Login First!");
    res.redirect('/login');
}
function checkCommentOwnership(req,res,next){
    if(req.isAuthenticated()){
        comment.findById(req.params.comment_id,(err,foundComment)=>{
            if(err) res.redirect('back');
            else{
                if(foundComment.author.id.equals(req.user._id)){
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
module.exports =router;