const mongoose=require("mongoose")
require("dotenv").config()

const connection = mongoose.connect(process.env.MongoURI)

// const connection = mongoose.connect("mongodb://localhost:27017/contactgullyDBS")
module.exports=connection