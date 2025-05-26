const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn , isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js")

//index route
//from listing.js in controllers
router
    .route("/")
    .get(
        wrapAsync(listingController.index))
    .post(
        validateListing ,
        wrapAsync( listingController.createListing));


//new route
router.get("/new",
    isLoggedIn,
    listingController.renderNewForm);

//edit route
router.get("/:id/edit", 
    isLoggedIn,
    isOwner, 
    wrapAsync(listingController.editListing));


//show route //keep id at last .it will give error as everything after listings would be treated as id

router
    .route("/:id")
    .get(
        wrapAsync(listingController.showListing)) 
    .put(
        validateListing,
        isLoggedIn , 
        isOwner,
        wrapAsync(listingController.updateListing))
    .delete(
        isLoggedIn ,
        isOwner,
        wrapAsync( listingController.deleteListing )
    );

module.exports = router;