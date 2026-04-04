const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {validateReview, isReviewAuthor} = require("../middleware.js");
const {isLoggedIn} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");


//Reviews--Post route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));
// Delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReview));

module.exports = router;