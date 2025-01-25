const express = require("express");
const app = express();
const session = require("express-session");
const flash = require("connect-flash");
const path = require('path');

// app.set('trust proxy', 1) // trust first proxy
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


const  sessionOptions = {
    secret: 'secretstring',
    resave: false,
    saveUninitialized: true,
  }


app.use(session(sessionOptions));
app.use(flash());

app.get("/register",(req,res)=>{
    let {name="anonymous"} = req.query;
    req.session.name = name;
    console.log(  req.session.name );
    if(name ==="anonymous"){
        req.flash("error","user not registered");
    }else{
        req.flash("success","registered successfully");
    }
    res.redirect("/hello");

 
})
app.get("/hello",(req,res)=>{
    res.locals.errorMsg = req.flash("error");
    res.locals.successMsg = req.flash("success");

    res.render("page.ejs", {name:  req.session.name})
})

// app.get("/reqcount",(req,res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }else{
//         req.session.count = 1;
//     }
//     res.send(`you sent a req ${req.session.count} times`)
// } )
// app.get("/test",(req,res)=>{
//     res.send("test successful")
// } )

app.listen(3000, ()=>{
    console.log("server is listening to 3000")
 })