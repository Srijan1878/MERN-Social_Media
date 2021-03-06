const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Post = require("../models/Post");
const { response } = require("express");
const saltRounds = 10
const verify = require ('./verifyToken')

//resetting userpassword
router.put("/reset",async(req,res)=>{
    try{
        const hashedPassword =await bcrypt.hash(req.body.password,saltRounds)
        const user = await User.updateOne({ email: req.body.email }, { password:hashedPassword });
    res.status(200).json("Password has been reset")
}catch(err){
    res.status(500).json(err)
}
})
//Update a user
router.put("/:id",verify, async (req, res) => {
    /* if (req.body.userId === req.params.id || req.body.isAdmin) {
         if (req.body.password) {
             try {
                 req.body.password = await bcrypt.hash(req.body.password, saltRounds)
             }
             catch (err) {
                 return res.status(500).json(err)
             }
         }*/
         try {
             const user = await User.findByIdAndUpdate(req.params.id, {
                 $set: req.body
             })
             res.status(200).send("Account has been updated")
         } catch (err) {
             return res.status(500).json(err)
         }
     }
     /*else {
         return res.status(403).json("You don't have access to this")
     }*/
 )
//delete a user and his posts
router.delete("/:id",verify, async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            const user = await User.findByIdAndDelete(req.params.id)
            res.status(200).send("Account has been deleted")
        } catch (err) {
            return res.status(500).json(err)
        }
    }
    else {
        return res.status(403).json("You don't have access to this")
    }
})

//get a user
router.get("/", async (req, res) => {
    const userId=req.query.userId
    const username=req.query.username
    try {
      const user= userId?await User.findById(userId):await User.findOne({username:username})
      const {password,updatedAt,...other} = user._doc
        return res.status(200).json(other)
    }
    catch (err){
        console.log(err)
        return res.status(500).json(err)
    }
})
//search users
router.post("/search",(req,res)=>{
    let userPattern = new RegExp("^"+req.body.query)
    User.find({email:{$regex:userPattern}})
    .then(user=>{
        res.json({user})
        .select("username profilePicture _id")
    }).catch(err=>{
        console.log(err)
    })
})
//get friends
router.get("/friends/:userId",verify,async(req,res)=>{

    try{
    const user = await User.findById(req.params.userId)
    const friends= await Promise.all(user.followings.map((friendId)=>{
    return User.findById(friendId)
    })
    )
    let friendList=[]
    friends.map((friend)=>{
        const {_id,username,profilePicture} = friend;
        friendList.push({_id,username,profilePicture}) 
    })
    res.status(200).json(friendList)
}
    catch(err){
res.status(500).json(err)
    }
})
//get all users
router.get("/friends",verify,async(req,res)=>{
    try{
       const user= await User.find({})
        res.status(200).json(user)
    }
    catch(err){
        console.log(err)
    }
    
})

//get followers and followings
router.get("/followers/followings/:userId",async(req,res)=>{
    
try{
    let a=[] ;
    const users = await User({})
    const user = await User.findById(req.params.userId)
    const followers= await Promise.all(user.followers.map((followerId)=>{
        return User.findById(followerId)
    })
    )
    const friends = await Promise.all(user.followings.map((friendId)=>{
        return User.findById(friendId)
        })
    )
    const result =  [...followers,...friends]
    a = [...new Set(result.map(m => m.username))];
    const memberSuggestions = await Promise.all(a.map((memberName)=>{
        return User.find({username:memberName})
        })
    )
    
    res.status(200).json(memberSuggestions)
    
    
        

      
}catch(err){
    res.status(500).json(err)
}
})


//finding user suggestion
router.get("/suggest/:id",verify,async(req,res)=>{
    try{
const user = await User.findById(req.params.id)
res.status(200).json(user)
}catch(err){
    console.log(err)
}
})

//follow a user
router.put("/:id/follow",verify,async(req,res)=>{
    
        if(req.body.id!==req.params.id){
            try{
const user= await User.findById(req.params.id)
const currentUser=await User.findById(req.body.userId)
if(!user.followers.includes(req.body.userId)){
    await user.updateOne({$push:{followers:req.body.userId}})
    await currentUser.updateOne({$push:{followings:req.params.id}})
    res.status(200).json("You have successfully followed the user")
}else{
    res.status(403).json("you already follow this user")
}
        }catch(err){
            res.status(500).json(err)
        }
    }else{res.status(403).json("you can't follow yourself")}
        
    })
     //updating profilePicture
     router.put("/profilePicture/:id",verify,async(req,res)=>{
        try {
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: {profilePicture:req.body.profilePicture}
            })
            res.status(200).send("Profile picture has been updated")
        } catch (err) {
            return res.status(500).json(err)
        }
    })
    //unfollow a user

    router.put("/:id/unfollow",verify,async(req,res)=>{
    
        if(req.body.id!==req.params.id){
            try{
const user= await User.findById(req.params.id)
const currentUser=await User.findById(req.body.userId)
if(user.followers.includes(req.body.userId)){
    await user.updateOne({$pull:{followers:req.body.userId}})
    await currentUser.updateOne({$pull:{followings:req.params.id}})
    res.status(200).json("You have unfollowed the user")
}else{
    res.status(403).json("you don't follow the user")
}
        }catch(err){
            res.status(500).json(err)
        }
    }else{res.status(403).json("you can't unfollow yourself")}
        
    })
    
module.exports = router