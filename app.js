const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");

const ejsMate = require("ejs-mate");
const ExpressError= require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");



const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js")

const mongo_url = "mongodb://127.0.0.1:27017/wanderlust";


main().then(()=>{
    console.log("connected to db");
}).catch(err=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(mongo_url);
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


const  sessionOptions = {
    secret: 'secretstring',
    resave: false,
    saveUninitialized: true,
    //time in milliseconds
    cookie: {
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true,
    }
  }
  
app.get("/",(req,res)=>{
    res.send("hi i am root");
})

//session and flash should be mentioned before routes
app.use(session(sessionOptions));
app.use(flash());




//passport uses session as each session has a user
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;


    // console.log(res.locals.success);
    next();
})

// app.get("/demouser", async (req, res)=>{
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username:"delta-student",
//     });
//     let registeredUser = await User.register(fakeUser, "helloworld");
//     res.send(registeredUser);
// })

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);


//if any other route except created route is searched : the following error will occur
app.all("*",(req, res, next)=>{
    next(new ExpressError(404, "Page Not Found!"))
} )

//error handling middleware
app.use((err, req, res,next)=>{
    let{ statusCode=500, message="SOMETHING WENT WRONG!!"} = err;
    res.status(statusCode).render("listings/error.ejs", {message});
    
})

app.listen(8080, ()=>{
    console.log("app listening on port 8080"); 
});

