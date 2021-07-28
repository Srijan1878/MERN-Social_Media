const router = require("express").Router();
const User = require("../models/User")
const bcrypt = require('bcrypt')
const saltRounds = 10
const jwt =require('jsonwebtoken')
const verify = require('./verifyToken')

router.post("/register", async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds)
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        })
        const user = await newUser.save()
        res.status(200).json(user)
    }
    catch (err) {
        console.log(err)
    }
})
router.post("/login", async (req, res) =>{
    try {
        const foundUser = await User.findOne({ email: req.body.email })
        !foundUser && res.status(404).json("User not found")

        const validPassword = await bcrypt.compare(req.body.password, foundUser.password)
        !validPassword && res.status(400).json("Wrong password")
        
        const token = jwt.sign({_id:foundUser._id},'secretkey')
        
        
        const {password,updatedAt,email,profilePicture,coverPicture,city,from,relationship,...user} = foundUser._doc
        res.status(200).json({user,token})
        
    }
    catch (err) {
        console.log(err)
    }
})
router.get("/test",verify,async(req,res)=>{
    res.send("you are autheticated")
})
module.exports = router

