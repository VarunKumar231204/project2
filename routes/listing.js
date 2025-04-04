const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

//validation for schema
const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",")
      throw new ExpressError(400, errMsg);
    }
    next();
 };

 router.route("/")
 .get(wrapAsync(listingController.index))//index route
 .post(isLoggedIn, upload.single("listing[image]") ,validateListing, wrapAsync(listingController.createListing));//create route

//new route
router.get("/new",isLoggedIn, listingController.renderNewForm);

 router.route("/:id")
.get(wrapAsync(listingController.showListing))//show route
.put(isLoggedIn, isOwner,upload.single("listing[image]"), validateListing, wrapAsync(listingController.updateListing))//update route
.delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));//delete route

//edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;