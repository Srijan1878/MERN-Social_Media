const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

//create a post
router.post("/",async (req,res)=>{
    const newPost = new Post(req.body)
    try{
        const savedPost = await newPost.save()
        res.status(200).json(savedPost)
    }catch(err){
        res.status(500).json(err)
    }
})
//get posts
router.get("/get",async (req,res)=>{
    const post = await Post.find({userId:req.body.userId})
    try{
        res.status(200).json(post)
    }catch(err){
        res.status(500).json(err)
    }
})
//Update a post
router.put("/:id",async (req,res)=>{
    try{
        const post=await Post.findById(req.params.id)
      if(post.userId===req.body.userId){
          await post.updateOne({$set:req.body})
        res.status(200).json("You have successfully updated the post")
      }    
      else{
          res.status(403).json("You don't have access to this")
      }
    }catch(err){
        res.status(500).json(err)
    }
})
//delete a post
router.delete("/:id",async (req,res)=>{
    try{
        const post=await Post.findById(req.params.id)
          await post.deleteOne()
        res.status(200).json("You have successfully deleted the post")
      }    
    catch(err){
        res.status(500).json(err)
    }
})
 //delete all posts
 router.delete("/delete/:id", async (req, res) => {

        try {
     
        await Post.deleteMany({userId:req.params.id},function(err){
                if(!err){
                    res.status(200).json("Deleted")
                }
                else{
                    res.status(500).send("Error")
                }
            })
            
        } catch (err) {
            return res.status(500).json(err)
        }
    })

//Like a post
router.put("/:id/like",async (req,res)=>{
    try{
    const post = await Post.findById(req.params.id)
    if(!post.likes.includes(req.body.userId)){
    await post.updateOne({$push:{likes:req.body.userId}})
    res.status(200).json("Thanks for liking the post")
    }
    else{
       await post.updateOne({$pull:{likes:req.body.userId}})
        res.status(200).json("The post has been disliked")
    }
    }catch(err){
   res.status(500).json(err)
    }
})
//comment on a post
router.put("/:id/comment",async (req,res)=>{
    try{
        const post = await Post.findById(req.params.id)
        await post.update({$push:{comments:{text:req.body.text,username:req.body.username}}})
        //await post.updateOne({$push:{comments:{}}})
        res.status(200).json("Thanks for commenting on the post")
        }catch(err){
       res.status(500).json(err)
        }
    })
    //get comments of a post
    router.get("/:id/comments",async(req,res)=>{
        try{
            const post = await Post.findById(req.params.id)
            res.status(200).json(post.comments)
        }catch(err){
res.status(500).json(err)
        }
    })
//get a post
router.get("/:id",async(req,res)=>{
    try{ 
    const post = await Post.findById(req.params.id)
    res.status(200).json(post)
}catch(err){
    res.status(500).json(err)
}
})
//Timeline posts
router.get("/timeline/:userId",async (req,res)=>{
try{
    const currentUser = await User.findById(req.params.userId)
    const userPosts = await Post.find({userId:currentUser._id})
    const friendPosts = await Promise.all(
    currentUser.followings.map((friendId)=>{
        return Post.find({userId:friendId})
    })
    )
        res.status(200).json(userPosts.concat(...friendPosts))
}catch(err){
    res.status(500).json(err)
}
})
//get user's posts
router.get("/profile/:username",async (req,res)=>{
    try{
     const user=await User.findOne({username:req.params.username})
        const posts =await Post.find({userId:user._id}) 
        res.status(200).json(posts) 
    }
    catch(err){
        res.status(500).json(err)
    }
    })

   
module.exports=router