const express = require("express")
const postRouter = express.Router()
const{PostModel} = require("../models/post.model")
const jwt =require("jsonwebtoken")


postRouter.post("/add",async(req,res)=>{
    const token =  req.headers.authorization.split(" ")[1]
    const decode = jwt.verify(token,"tesla")
    const payload = req.body
    try{
        if(decode){
            const post = new PostModel(payload)
            await post.save()
            res.status(200).json({"msg":"A new Post are Added"})
        }
    }catch(err){
        res.status(400).json({"message":err.message})
    }
})


postRouter.delete("/delete/:id",async(req,res)=>{
    const token = req.headers.authorization.split(" ")[1]
    const decode = jwt.verify(token,"tesla")
    const id = req.params.id
    const req_id = decode.userId
    const post = await PostModel.findOne({_id:id})
    const userId__in_post = post.userId

    try{
        if(req_id === userId__in_post){
            await PostModel.findByIdAndDelete({_id:id})
            res.status(200).json({"msg":"post is Deleted"})
        }else{
            res.status(400).json({"msg":"Not Authorized user"})
        }
    }catch(err){
        res.status(400).json({"msg":err.msg})
    }
})


postRouter.patch("/update/:id",async(req,res)=>{
    const id=req.params.id
    const data=req.body
    const userid=req.body.userId
    try{
        let payload=await PostModel.findByIdAndUpdate({_id:id,userId:userid},{$set:data})
        res.status(200).json(JSON.stringify(payload))
    }catch(err){
        res.status(400).json({"msg":err.message})

    }
})

postRouter.get("/top", async (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    const decode = jwt.verify(token, "tesla");

    try {
      if (decode) {
        let filter = { userId: decode.userId };

        if (req.query.device) {
          filter.device = req.query.device;
        }

        let pageNo = parseInt(req.query.pageNo) || 1;
        let pageSize = parseInt(req.query.pageSize) || 3;

        let posts = await PostModel.find(filter)
          .sort({ no_of_comments: -1 })
          .skip((pageNo - 1) * pageSize)
          .limit(pageSize);

        res.status(200).json(posts);
      }
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

  postRouter.get("/",async(req,res)=>{
    const token = req.headers.authorization.split(" ")[1];
    const decode = jwt.verify(token, "tesla");

    try {
        if (decode) {
          const userId = decode.userId;
          let query = { userId };
          const device = req.query.device;
          if (device) {
            query.device = device;
          }
          const author = req.query.author;
          if (author) {
            query.userId = author;
          }
          const min_comments = req.query.min_comments;
          const max_comments = req.query.maxComments;
          if (min_comments && max_comments) {
            query.no_of_comments = { $gte: min_comments, $lte:max_comments };
          } else if (min_comments) {
            query.no_of_comments = { $gte: min_comments };
          } else if (max_comments) { query.no_of_comments = { $lte: max_comments };
          }
          const page = req.query.page
          const limit = 3;
          const startIndex = (page - 1) * limit;
          const endIndex = page * limit;
          const total = await PostModel.countDocuments(query);

          const posts = await PostModel.find(query).sort({ no_of_comments: -1 }).limit(limit).skip(startIndex);
          res.status(200).json({ posts, currentPage: page,totalPages: Math.ceil(total / limit)});
        }
      } catch (err) {
        res.status(400).json({ message: err.message });
      }

  })

module.exports={postRouter}