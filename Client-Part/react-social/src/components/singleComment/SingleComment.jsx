import React,{useState,useContext,useEffect} from 'react'
import SendIcon from '@material-ui/icons/Send';
import './singleComment.css'
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import Reply from '../reply/Reply';

export const SingleComment = ({singleComment,post,fetchComments}) => {
    const [showReply, setShowReply] = useState();
    const [replyText, setReplyText] = useState();
    const {user:currentUser} = useContext(AuthContext);
    const [isStarred,setIsStarred] = useState(singleComment.likes.includes(currentUser._id))
    const submitHandler =async() =>{
        try{
       await axios.put("posts/get-comments/"+post._id+"/"+singleComment._id,{
           text:replyText,
           username:currentUser.username
       })
        }
        catch(err){
            console.log(err)
        } 
        fetchComments() 
}
const commentStarCounter = async() => {
  try{
    await axios.put("posts/like/"+post._id +"/"+ singleComment._id,{
      userId:currentUser._id
    })
    setIsStarred(!isStarred)
  }catch(err){
    console.log(err)
  }
}
    return (
            <>
              <div className="singleCommentComponent" >
                <h4 className="commentor">{singleComment.username}</h4>
                <p className="singleComment">{singleComment.text}</p>
              </div>
              <div className="commentReactionContainer">
                <p className={isStarred?"starredComment":"starComment"} onClick={commentStarCounter}>{isStarred?"Starred":"Star"}</p>
                <p className="replyComment" style={{color:"black",opacity:0.8,cursor:"pointer",fontSize:"13px"}} onClick={()=>{setShowReply(!showReply)}}>Reply</p>
              </div>
              {singleComment.replies.map((reply)=>(
              <Reply  reply={reply}/>
              ))}
             
              <div className="commentReply">
              {showReply && (
                  <form className="replyComponent" >                 
             <input
              type="text"
              className="replyCommentInput"
              placeholder="Reply"
              onChange={(e)=>{setReplyText(e.target.value)}}
              value={replyText}
              />
              <SendIcon onClick={submitHandler} style={{transform:'translateY(-2px)'}}/>
              </form>
              )}           
                </div>
              </>
    )
}
