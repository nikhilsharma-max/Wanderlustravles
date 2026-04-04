const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });
// const upload = multer({ dest: 'uploads/' })
const { isLoggedIn } = require("../middleware.js");
const { isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
// Middleware to validate listing data using Joi schema

router
  .route("/")
  //All listings route, Index route
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    wrapAsync(listingController.createListing),
    // (req,res)=>{res.send(req.file);}
    );


//New listing route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
  .route("/:id")
  //Update route
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing),
  )
  // Show individual id's data
  .get(wrapAsync(listingController.showListing))
  //DELETE ROUTE
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

// //Create route
// router.post("/",validateListing,wrapAsync(async(req,res,next)=>{

//     let new_Listing = new Listing(req.body.listing);
//     await new_Listing.save();
//     res.redirect("/listings");
//     console.log(req.body);
// })
// );

//Edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editListing),
);
module.exports = router;
