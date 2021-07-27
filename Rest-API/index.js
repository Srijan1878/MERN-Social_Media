const express=require('express')
const dotenv=require('dotenv')
dotenv.config()
const helmet=require('helmet')
const cors=require('cors')
const mongoose= require('mongoose')
const morgan=require('morgan')
const userRoute=require("./routes/users.js")
const authRoute=require("./routes/auth.js")
const postRoute=require("./routes/posts.js")
const pageRoute=require("./routes/page.js")
const conversationRoute=require("./routes/conversations.js")
const messageRoute=require("./routes/messages.js")
const multer= require('multer')
const path = require('path')
const app=express()
app.use(express.json())
app.use(helmet())
app.use(morgan("common"))
app.use(cors())
//mongoose.connect("mongodb://localhost:27017/SocialDB",{useNewUrlParser:true,useUnifiedTopology:true})
mongoose.connect(process.env.MONGO_URI,{useNewUrlParser:true,useUnifiedTopology:true})
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
app.use("/api/users",userRoute)
app.use("/api/auth",authRoute)
app.use("/api/posts",postRoute)
app.use("/api/pages",pageRoute)
app.use("/api/conversations",conversationRoute)
app.use("/api/messages",messageRoute)
app.use("/images", express.static(path.join(__dirname, "public/images")))
app.get("/",(req,res)=>{
    res.send("So you are finally here")
})

//multer implementation for image upload
const storage= multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null, 'public/images/')
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname)
    },
})
const upload = multer({storage})
app.post("/api/upload",upload.single('file'),(req,res)=>{
    try{
    res.status(200).json("Done")
    }catch(err){
req.status(500).json(err)
    }
})
app.listen(5000,function(){
    console.log("Server is also up and running")
})
