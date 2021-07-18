const mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema({
    username:{
        type:String
    },
    text:{
        type:String,
    } ,
    likes:{
        type:Array,
        default:[]
    },
    replies:{
        type:Array,
        default:[]
      }
    })
    module.exports =  CommentSchema
    /*module.exports = mongoose.model("Comment", CommentSchema)*/