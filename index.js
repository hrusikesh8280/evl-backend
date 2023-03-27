const express = require("express")
const{connection} = require("./db")
const { auth } = require("./middleware/auth.middleware")
const { postRouter } = require("./routes/post.routes")
const { userRoute } = require("./routes/user.routes")



require("dotenv").config()
const cors = require("cors")


const app = express()
app.use(express.json())
app.use(cors())

app.use("/users",userRoute)
app.use(auth)
app.use("/posts",postRouter)




app.listen(process.env.port,async()=>{
    try{
        await connection
        console.log("server is Connected to Mongoose");
    }catch(err){
        console.log(err);

    }
    console.log(`server is Running at ${process.env.port}`);
})