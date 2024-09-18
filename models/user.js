import mongoose from "mongoose"

mongoose.connect("mongodb://localhost:27017/authdb")


const userSchema=mongoose.Schema({
    username:String,
    email:String,
    password:String,
    age:Number
})

export const userModel=mongoose.model("user",userSchema)