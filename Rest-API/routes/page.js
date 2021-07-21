const Page = require('../models/page')
const router = require("express").Router();

//Create a page
router.post("/", async(req, res) => {
    try{
    const newPage = new Page(req.body)
    await newPage.save()
    res.status(200).json(newPage)
    }catch(err){
        res.status(500).json(err)
    }
})

//Add a member
router.put("/add/members/:id", async(req, res) => { 
    try{
    const page = await Page.findById(req.params.id)  
        if(!page.members.includes(req.body.userId)){
    await page.updateOne({$push: {members:{$each:req.body.userId}}})
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
module.exports = router;