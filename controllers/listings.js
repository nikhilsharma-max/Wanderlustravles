const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
};

//new route form render

module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs");
};





//create route 
module.exports.createListing = async(req,res,next)=>{
  let response = await geocodingClient.forwardGeocode({
  query: req.body.listing.location,
  limit: 1
})
  .send();
  
    let url = req.file.path;
    let filename = req.file.filename;
    console.log(url)
    let new_Listing = new Listing(req.body.listing);
    console.log(req.user._id);

    new_Listing.owner = req.user._id;
    new_Listing.image = {url,filename};
    new_Listing.geometry = response.body.features[0].geometry;
    let savedListing = await new_Listing.save();
    console.log(savedListing);
    req.flash("success","New Listing created!!");
    res.redirect("/listings");
};







module.exports.showListing = async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id).populate({path: "reviews",populate:{path:"author",},}).populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing});
};

//update route
module.exports.updateListing = async(req,res)=>{
    let {id} = req.params; 
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename};
        await listing.save();
    }

    req.flash("success","Listing updated!!");
    res.redirect(`/listings/${id}`);
};

//edit route
module.exports.editListing = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs",{listing, originalImageUrl });   
};

//delete route
module.exports.deleteListing = async (req,res)=>{
    let {id} = req.params;
    let deleatedListing = await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleated!!");
    console.log(deleatedListing);
    res.redirect("/listings");
};