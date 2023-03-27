const mongoose=require("mongoose")

const postSchema=mongoose.Schema({
    title:String,
    body:String,
    device:String,
    no_of_comments:Number,
    userId:String
},{
    versionKey:false
})

const PostModel=mongoose.model("Post",postSchema)

module.exports={PostModel}