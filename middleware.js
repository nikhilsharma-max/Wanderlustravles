const Listing = require("./models/listing");
const Review = require("./models/review.js");
const {listingSchema,reviewSchema} = require("./schema.js"); 
const ExpressError = require("./utils/ExpressError.js");

module.exports.isLoggedIn = (req,res,next)=>{
        if(!req.isAuthenticated()){
            //redirect
            req.session.redirectUrl = req.originalUrl;
            req.flash("error","You must be logged in to create listing!");
            return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async(req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req, res, next) => {
    // 1. Actually run validation and get the result
    const { error } = listingSchema.validate(req.body, { abortEarly: false });

    // 2. Remove or fix the console.log — 'result' was never defined
    // console.log(result);   ← this was wrong — delete or replace with:
    // console.log(error);    // useful during development

    if (error) {
        // Join all validation error messages into one string
        const errMsg = error.details
            .map((el) => el.message)
            .join(", ");

        // Option A: Throw error (good when you have global error handler)
        throw new ExpressError(400, errMsg);

        // Option B: More common in many tutorials — flash + redirect
        // req.flash("error", errMsg);
        // return res.redirect("back");   // or "/listings/new"
    }

    // If no error → continue
    next();
};

module.exports.validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message.join(","));
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};
module.exports.isReviewAuthor = async(req,res,next)=>{
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}   