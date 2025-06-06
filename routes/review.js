const express = require("express");
const router = express.Router({mergeParams:true});
const  Review = require("../models/reviews.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError= require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js")
const reviewController = require("../controllers/reviews.js")


//Reviews - Post route
router.post("/",
    isLoggedIn, 
    validateReview , 
    wrapAsync( reviewController.postReview));


//reviews - delete route
router.delete("/:reviewId",
    isLoggedIn, 
    isReviewAuthor, 
    wrapAsync(
        reviewController.destroyListing
    ));

module.exports = router;
