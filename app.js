if(process.env.NODE_ENV != "production"){
    require('dotenv').config();//for production phase
}
console.log(process.env.SECRET);
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const Listing = require("./models/listing.js");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverrided = require("method-override")
app.use(methodOverrided("_method"));
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./schema.js"); 
const Review = require("./models/review.js");
const passport = require('passport');
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require('express-session');
// const MongoStore = require('connect-mongo');
const MongoStore = require('connect-mongo').default || require('connect-mongo');
const flash = require('connect-flash');

// main().catch(err => console.log(err));
app.use(express.static(path.join(__dirname,'public')));
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlustravels";
const dbUrl = process.env.ATLASDB_URL;
main()
    .then(()=>{
        console.log("Connected to DB");
    })
    .catch((err)=>{
        console.log(err);
    });
async function main(){
    await mongoose.connect(dbUrl);
}
app.engine("ejs",ejsMate);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));

const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto: {
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,//in seconds 
});

store.on("error",(err)=>{
    console.log("Error on mongo session store",err);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge : 7*24*60*60*1000,
    }
};



// app.get("/",(req,res)=>{
//     res.send("Working");
// });
app.use(session(sessionOptions));
app.use(flash());

//implementing passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//creating middleware 
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    console.log(res.locals.success);
    next();
});

// app.get("/demouser",async (req,res)=>{
//     let fakeuser = new User({
//         email:"student@gmail.com",
//         username:"Delta student",
//     });
//    let registeredUser = await User.register(fakeuser,"helloworld");
//    res.send(registeredUser);
// }); 
// //Middleware to check schema validation
// const validateListing = (req,res,next)=>{
//     let {error} = listingSchema.validate(req.body);
//     console.log(result);
//     if(error)    {
//         let errMsg = error.details.map((el)=>el.message).join(",");
//         throw new ExpressError(400,errMsg);
//     }
//     else{
//         next();
//     }
// };




// Redirect root URL to your homepage
app.get('/', (req, res) => {
    res.redirect('/listings');
});
app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);

// app.get("/force-test", async (req, res) => {
//     try {
//         const doc = new Listing({
//             title: "Test " + Date.now(),
//             description: "forced test",
//             price: 9999,
//             location: "Delhi",
//             country: "India"
//         });
//         await doc.save();
//         res.send("Forced save OK - id: " + doc._id);
//     } catch (e) {
//         res.send("Forced save failed: " + e.message);
//     }
// });

// //Delete review route
// app.delete("listings/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
//     let {id,reviewId} = req.params;
//     await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
//     await Review.findByIdAndDelete(reviewId);
//     res.redirect(`/listings/${id}`);
// }));


//Error handeler
app.use((err,req,res,next)=>{
     let {statusCode=500,message="Something went wrong!"} = err;
    // res.send("Something went wrong");
    res.status(statusCode).render("error.ejs",{err});
    // res.status(statusCode).send(message);
});

app.get("/testlisting",async (req,res)=>{
    let sampleListing = new Listing({
        title:"My new Villa",
        description: "By the beach",
        price:1200,
        location:"Calangute,Goa",
        country: "India",
    });

    await sampleListing.save();
    console.log("Successful testing");
});

app.listen(port,()=>{
    console.log("server is working");
}); 



