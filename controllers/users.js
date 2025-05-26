const User = require("../models/user.js")

module.exports.signUpUser =  async(req,res)=>{
    try{
        let {username, email, password}= req.body;
        let newUser =  new User({email, username});
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listings")
        })

    }catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.loginUser = async(req,res)=>{
        req.flash("success", "Welcome back to Wanderlust!");
        let redirectUrl = res.locals.redirectUrl || "/listings";

        res.redirect(redirectUrl);
};

module.exports.logoutUser = (req, res, next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    })
};

module.exports.renderLogin = (req, res)=>{
    res.render("users/login.ejs")
};

module.exports.renderSignup = (req,res)=>{
    res.render("users/signup.ejs")
};