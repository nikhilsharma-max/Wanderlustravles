const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose").default;

const userSchema = new Schema({
    email:{
        type:String,
        required:true,
    }, 
});

userSchema.plugin(passportLocalMongoose);
//automatically username password field create kr deta hai with hashed value and salting
module.exports = mongoose.model('User',userSchema);
