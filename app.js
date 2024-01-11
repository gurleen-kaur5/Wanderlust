const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js")
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const asyncWrap = require("./utils/wrapAsync.js");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError= require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js");


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


app.get("/",(req,res)=>{
    res.send("hi i am root");
})
//index route

app.get("/listings", wrapAsync(async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}))
//new route
app.get("/listings/new", (req,res)=>{
    res.render("listings/new.ejs")
})
const validateListing =((req, res, next)=>{
    let {error} =  listingSchema.validate(req.body);

    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
     throw new ExpressError(400,errMsg);
    }else{
        next();
    }
})

//create route
app.post("/listings", validateListing ,wrapAsync( async (req, res, next)=>{
  //joiii
  
        const newListing =  new Listing(req.body.listing);
        await newListing.save();
        console.log(newListing);
        res.redirect("/listings");
    
  
}))
//edit route
app.get("/listings/:id/edit", wrapAsync(async(req,res)=>{
    let {id} = req.params;
   const listing =  await Listing.findById(id);
   res.render("listings/edit.ejs", {listing})
}))
// update route
app.put("/listings/:id", validateListing ,wrapAsync(async (req, res)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"Send valid data for listing")
    }
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);

}))
//delete route
app.delete("/listings/:id",wrapAsync( async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
   res.redirect("/listings");

}))





// app.get("/testListing",async (req,res)=>{
//     let sampleListing = new Listing({
//         title: "My New Villa",
//         description:"By the beach",
//         price:1200,
//         location: "Calangute, Goa",
//         country:"India",
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful")
// })



//keep id at last .it will give error as everything after listings would be treated as id
app.get("/listings/:id",wrapAsync(async (req,res)=>{
    let {id} = req.params;
   const listing =  await Listing.findById(id);
   res.render("listings/show.ejs", {listing})
}))


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

