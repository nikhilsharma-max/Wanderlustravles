const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async (req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","New review added!!");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;

    // 1. Remove review reference from listing
    await Listing.findByIdAndUpdate(
        id,
        { $pull: { reviews: reviewId } }
    );

    // 2. Delete the review document itself
    await Review.findByIdAndDelete(reviewId);

    // Optional but recommended: flash message + redirect
    // req.flash("success", "Review deleted successfully!");
    req.flash("success","Review deleted!!");
    res.redirect(`/listings/${id}`);
};
