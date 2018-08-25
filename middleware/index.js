var middlewareObject = {}
middlewareObject.checkCafeOwnership = function(req,res,next){
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
middlewareObject.checkCommentOwnership = function(req,res,next){
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
middlewareObject.isLoggedIn=function(req,res,next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash("error","Please Login First!");
        res.redirect('/login');
}

module.exports = middlewareObject