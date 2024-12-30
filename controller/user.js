const User = require('../models/user')

module.exports.signUpFrom=(req,res)=>{
    res.render('user/register')
}

module.exports.signUp = async(req,res)=>{
    try{
        const {username , email, password}= req.body;
        const user = await new User({username,email})
        const newUser = await User.register(user,password)
        req.logIn(newUser, function(err) {
            if (err) { throw err; }
            req.flash('success', 'Welcome to Yelp Camp!'); 
            res.redirect('/campground'); 
          });          
      
    }catch(e){
        req.flash('error',e.message)
        res.redirect('/login')
    }
    
}

module.exports.signInFrom =(req, res) => {
    res.render('user/login'); 
}
module.exports.signIn=(req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = res.locals.returnTo || '/campground'; 
    res.redirect(redirectUrl);
}

module.exports.logout =(req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campground');
    });
}