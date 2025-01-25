const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError= require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const { isLoggedIn } = require("../middleware.js");


//joi for listings
const validateListing =((req, res, next)=>{
    let {error} =  listingSchema.validate(req.body);

    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
     throw new ExpressError(400,errMsg);
    }else{
        next();
    }
})



//index route
router.get("/", wrapAsync(async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}))

//new route
router.get("/new", isLoggedIn, (req,res)=>{
    res.render("listings/new.ejs")
})

//create route
router.post("/", validateListing ,wrapAsync( async (req, res, next)=>{
    const newListing =  new Listing(req.body.listing);
    await newListing.save();
    newListing.owner = req.user._id;
    req.flash("success","New Listing Created!" );
    res.redirect("/listings");  
}))

//show route //keep id at last .it will give error as everything after listings would be treated as id
router.get("/:id",wrapAsync(async (req,res)=>{
    let {id} = req.params;
   const listing =  await Listing.findById(id).populate("reviews").populate("owner");
   if(!listing){
    req.flash("error","Listing you requested for does not exists!");
    res.redirect("/listings")
   }
   console.log(listing);
   res.render("listings/show.ejs", {listing})
}))

//edit route
router.get("/:id/edit", isLoggedIn, wrapAsync(async(req,res)=>{
    let {id} = req.params;
   const listing =  await Listing.findById(id);
   if(!listing){
    req.flash("error","Listing you requested for does not exists!");
    res.redirect("/listings")
   }
   res.render("listings/edit.ejs", {listing})
}))
// update route
router.put("/:id", validateListing,  isLoggedIn ,wrapAsync(async (req, res)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"Send valid data for listing")
    }
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing Updated!" );

    res.redirect(`/listings/${id}`);

}))
//delete route
router.delete("/:id",  isLoggedIn ,wrapAsync( async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!" );

   res.redirect("/listings");

}))

module.exports = router;