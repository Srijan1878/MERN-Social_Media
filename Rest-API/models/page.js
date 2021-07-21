
const mongoose = require('mongoose')
const CommentSchema = require ('./Comments')

const PagePostsSchema = new mongoose.Schema({
    pageId:{
        type: String,
        required: true
    },
        desc:{
            type:String,
            max:500
        },
        img:{
            type:String
        },
        likes:{
            type:Array,
            default:[]
        },
        comments:[CommentSchema]
    })

const PageSchema = new mongoose.Schema({
  adminId:{
      type:String,
      required:true
  },
  members:{
      type:Array,
      default:[]
  },
title:{
      type:String,
      required:true
},
  desc:{
      type:String,
      max:500
  },
  profileImg:{
      type:String
  },
  coverImg:{
      type:String
  },
  post:[PagePostsSchema],
},
    { timestamps: true })
    module.exports = mongoose.model("Page", PageSchema)