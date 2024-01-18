const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError= require("./utils/ExpressError.js");


const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

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
app.use("/listings", listings)
app.use("/listings/:id/reviews", reviews)


app.get("/",(req,res)=>{
    res.send("hi i am root");
})

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

