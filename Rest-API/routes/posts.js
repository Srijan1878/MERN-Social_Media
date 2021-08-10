const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");
const verify = require("./verifyToken");


//reply to a comment
// router.put("/get-comments/:id/:commentId",async (req,res)=>{
//     const post =  await Post.findById(req.params.id)   
//     const comment = await post.comments.id(req.params.commentId)
//     let ee = await post.comments.indexOf(comment)
//     try{ 
//         //await Post.update({$push:{replies:{text:req.body.text,username:req.body.username}}})
//         //await comment.replies.push({text:req.body.text,username:req.body.username})
//         //await comments.save()
//         //const post = await Post.find({'comments._id':req.params.commentId}) 
    
//       Post.findOneAndUpdate({'comments._id':req.params.commentId,'comments.replies':{$exists:true}},{$push:{'comments.$[elem].replies': {text:req.body.text,username:req.body.username}}},{ arrayFilters: [{ elem:ee }] }, function(err, doc) {
//              if(!err){
//         res.status(200).json("done")
//              }else{
//             console.log(err) 
//             }
//         });
    
//             //res.status(200).json(post.comments)    
//     }catch(err){
//         res.status(500).json(err)
//     }
// })
router.put("/get-comments/:id/:commentId",(req, res) => {
    const id = req.params.id;
    const commentId = req.params.commentId;
    Post.findOneAndUpdate(
      { _id: id, comments: { $elemMatch: { _id: commentId } } },
      {
        $push: { "comments.$.replies": {text:req.body.text,username:req.body.username}},
      },
      (err, result) => {
        if (err) res.send(err);
        else if (result) res.send(result);
      }
    );
  });

//like a comment
router.put("/like/:id/:commentId",async(req, res) => {
    const id = req.params.id;
    const commentId = req.params.commentId;
    const post =  await Post.findById(id);
    const comment = post.comments.id(req.params.commentId)
    if(!comment.likes.includes(req.body.userId)){
        Post.findOneAndUpdate(
            { _id: id, comments: { $elemMatch: { _id: commentId } } },
            {
              $push: { "comments.$.likes": req.body.userId},
            },
            (err, result) => {
              if (err) res.send(err);
              else if (result) res.status(200).json("Thanks for liking the comment");
            }
          );
        }
          else{
            Post.findOneAndUpdate(
                { _id: id, comments: { $elemMatch: { _id: commentId } } },
                {
                  $pull: { "comments.$.likes": req.body.userId},
                },
                (err, result) => {
                  if (err) res.send(err);
                  else if (result) res.status(200).json("Thanks for disliking the comment");
                }
              ); 
          }
   
  });

//create a post
router.post("/",verify,async (req,res)=>{
    const newPost = new Post(req.body)
    try{
        const savedPost = await newPost.save()
        res.status(200).json(savedPost)
    }catch(err){
        res.status(500).json(err)
    }
})
//get posts
router.get("/get",verify,async (req,res)=>{
    const post = await Post.find({userId:req.body.userId})
    try{
        res.status(200).json(post)
    }catch(err){
        res.status(500).json(err)
    }
})
//Update a post
router.put("/:id",verify,async (req,res)=>{
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
router.delete("/:id",verify,async (req,res)=>{
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
 router.delete("/delete/:id",verify, async (req, res) => {

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
router.put("/:id/like",verify,async (req,res)=>{
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
        await post.update({$push:{comments:{text:req.body.text,username:req.body.username,likes:req.body.likes,replies:req.body.replies}}})
        //await post.updateOne({$push:{comments:{}}})
        res.status(200).json("Thanks for commenting on the post")
        }catch(err){
       res.status(500).json(err)
        }
    })
    //reply to a post
    router.get("/:id/comment/reply",async(req,res)=>{
        try{
            const post = await Post.findById(req.params.id)
            await post.comments.update
        }catch(err){
            console.log(err)
        }
    })
    //get comments of a post
    router.get("/:id/comments",verify,async(req,res)=>{
        try{
            const post = await Post.findById(req.params.id)
            res.status(200).json(post.comments)
        }catch(err){
res.status(500).json(err)
        }
    })
//get a post
router.get("/:id",verify,async(req,res)=>{
    try{ 
    const post = await Post.findById(req.params.id)
    res.status(200).json(post)
}catch(err){
    res.status(500).json(err)
}
})
//Timeline posts
router.get("/timeline/:userId",verify,async (req,res)=>{
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
router.get("/profile/:username",verify,async (req,res)=>{
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