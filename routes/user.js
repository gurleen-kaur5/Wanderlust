const express = require("express");
const router = express.Router();
const User = require("../models/user.js")
const wrapAsync = require("../utils/wrapAsync.js");
// const ExpressError= require("../utils/ExpressError.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");


router
    .route("/signup")
    .get( userController.renderSignup)
    .post( wrapAsync(userController.signUpUser));

router
    .route("/login")
    .get(userController.renderLogin)
    .post(
        saveRedirectUrl,
        //middleware passport.authenticate
        passport.authenticate("local", 
            {failureRedirect: "/login", 
            failureFlash: true,
        }) ,
        (userController.loginUser)
);

router.get("/logout", 
    userController.logoutUser)


module.exports = router;
