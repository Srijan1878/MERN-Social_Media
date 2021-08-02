const Page = require('../models/page')
const router = require("express").Router();

//Create a page
router.post("/create", async(req, res) => {
    try{
    const newPage = new Page(req.body)
    await newPage.save()
    res.status(200).json(newPage)
    }catch(err){
        res.status(500).json(err)
    }
})

//find pages according to the given query user
router.get("/find/:adminId", async(req, res) => {
    try{
     const userPages = await Page.find({adminId:req.params.adminId})
    res.status(200).json(userPages)
    }
     catch(err){
        res.status(500).json(err)
    }
})

//get a page
router.get("/get/:title", async(req, res) => {
try{
const foundPage = await Page.findOne({title:req.params.title})
res.status(200).json(foundPage)
}catch(err){
console.log(err)
}
})

//Add a member
router.put("/add/members/:id", async(req, res) => { 
    try{
    const page = await Page.findById(req.params.id)  
        if(!page.members.includes(req.body.userId)){
    await page.updateOne({$push: {members:req.body.userId}})
    res.status(200).json("done")
        }
        else{
           res.status(403).json("Already a member of the page")
        }
    }catch(err){
        res.status(500).json(err)
    }
})

//remove a member
router.put("/remove/members/:id", async(req, res) => { 
    try{
    const page = await Page.findById(req.params.id)  
    if(req.body.removerId===page.adminId){
        if(page.members.includes(req.body.userToBeRemovedId)){
    await page.updateOne({$pull: {members:req.body.userToBeRemovedId}})
    res.status(200).json("User has been removed")
        }
        else{
           res.status(403).json("User is not added to the page")
        }
    }else{
        res.status(403).json("You don't have access to remove a member")
    }
    }catch(err){
        res.status(500).json(err)
    }
})

//create a post
router.post("/posts/create/:id",async(req, res) => {
try{
    const page = await Page.findById(req.params.id)
    await page.updateOne({$push: {post:req.body}})
    res.status(200).json("Post Created")
}catch(err){
    res.status(500).json(err)
}
})
module.exports = router;