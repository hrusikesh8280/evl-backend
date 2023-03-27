const express = require("express")
const{UserModel} = require("../models/user.model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const userRoute = express.Router()


userRoute.post("/register",async(req,res)=>{
    const {name,email,gender,password,age,city,is_married}=req.body
    try{
        const user_present = await UserModel.exists({email})
        if(user_present){
            res.json("User already exist, please login")
        }else{
            bcrypt.hash(password,5,async(err,hash)=>{
                const newuser = new UserModel({name,email,gender,password:hash,age,city,is_married})
                await newuser.save()
                res.status(200).json({"msg":newuser})
            })
        }
    }catch(err){
        res.status(400).json({"msg":err.message})
    }
})


userRoute.post("/login",async(req,res)=>{
    const{email,password}=req.body
    try{
        const user = await UserModel.findOne({email})
        if(user){
            bcrypt.compare(password,user.password,(err,result)=>{
                if(result){
                    res.status(200).json({"msg":"Login sucessfull!","token":jwt.sign({"userId":user._id},"tesla")})
                }else{
                    res.status(400).json({"msg":"Wrong Credentila"})
                }
            })
        }else{
            res.status(200).json({"message":"No such user Exist"})
        }
    }catch(err){
        res.status(400).json({"msg":err.messgae})
    }
})


module.exports={userRoute}