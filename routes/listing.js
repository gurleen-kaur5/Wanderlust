const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn , isOwner, validateListing} = require("../middleware.js");


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
    console.log(req.user);
  
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success","New Listing Created!" );
    res.redirect("/listings");  
}))
 
//show route //keep id at last .it will give error as everything after listings would be treated as id
router.get("/:id",wrapAsync(async (req,res)=>{
    let {id} = req.params;
const listing =  await Listing.findById(id)
    .populate({
        path : "reviews",
        populate:{
             path: "author",
            },
        })
         .populate("owner");
   if(!listing){
    req.flash("error","Listing you requested for does not exists!");
    res.redirect("/listings")
   }
   console.log(listing);
   res.render("listings/show.ejs", {listing})
}))

//edit route
router.get("/:id/edit", isLoggedIn,isOwner, wrapAsync(async(req,res)=>{
    let {id} = req.params;
   const listing =  await Listing.findById(id);
   if(!listing){
    req.flash("error","Listing you requested for does not exists!");
    res.redirect("/listings")
   }
   res.render("listings/edit.ejs", {listing})
}))
// update route
router.put("/:id", validateListing,  isLoggedIn , isOwner,wrapAsync(async (req, res)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"Send valid data for listing")
    }
    let {id} = req.params;
   await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing Updated!" );

    res.redirect(`/listings/${id}`);

}))
//delete route
router.delete("/:id",  isLoggedIn ,isOwner,wrapAsync( async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!" );

   res.redirect("/listings");

}))

module.exports = router;