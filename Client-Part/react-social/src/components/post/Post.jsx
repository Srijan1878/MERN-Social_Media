import {
  Send,
  StarBorder,
} from "@material-ui/icons";
import StarIcon from '@material-ui/icons/Star';
import "./post.css";
import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { v4 as uuidv4 } from 'uuid';
import { SingleComment } from "../singleComment/SingleComment";
import { motion } from "framer-motion";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

export default function Post({ post,setNewPostUploaded,newPostUploaded }) {
  const { user: currentUser } = useContext(AuthContext);
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(post.likes.includes(currentUser?._id));
  const [users, setUsers] = useState({});
  const [comments,setComments] = useState([]);

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  const [showComments, setShowComments] = useState(false);
  const commentTextInput = useRef();
  useEffect(() => {
    const fetchUsers = async () => {
      const res = await axios.get(`/users?userId=${post.userId}`,{headers:{
        "auth-token":sessionStorage.getItem("token")
      }});
      setUsers(res.data);

    };
    fetchUsers();
  }, [post.userId]);
  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser._id));
  }, [currentUser._id, post.likes]);

  const likeCounter = async () => {
    try {
      await axios.put("/posts/" + post._id + "/like", {
        userId: currentUser._id,
      },{headers:{"auth-token":sessionStorage.getItem("token")}});
    } catch (err) {
      console.log(err);
    }

    setLike(isLiked ? like - 1 : like + 1, setIsLiked(true));
    setIsLiked(!isLiked);
  };


  //deleting a post
const deletePost = async()=>{
try{
await axios.delete('/posts/'+post._id, {headers:{"auth-token":sessionStorage.getItem("token")}},{ data: { userId: currentUser._id } });
setNewPostUploaded(!newPostUploaded)
}catch(err){
console.log(err)
}

}

//Fetching comments 
const fetchComments = async () => {
  try {
    const res = await axios.get("/posts/" + post._id + "/comments",{headers:{"auth-token":sessionStorage.getItem("token")}});
    setComments(res.data)
  } catch (err) {
    console.log(err);
  }
};
useEffect(() =>{
  fetchComments()
},[])

//posting a comment
  const postCommentHandler = async () => {
    await postComments();
     fetchComments()
  };

  //posting a comments
  const postComments = async () => {
    try {
      await axios.put("/posts/" + post._id + "/comment",{
        id:uuidv4(),
        text: commentTextInput.current.value,
        username: currentUser.username,
      },{headers:{"auth-token":sessionStorage.getItem("token")}});
    } catch (err) {
      console.log(err);
    }
    commentTextInput.current.value = "";
    //window.location.reload();
  };


  return (
    <motion.div className="post" initial={{opacity:0,skew:'2deg'}} animate={{opacity:1,skew:'0deg'}} transition={{duration:0.5,staggerChildren:0.25}} >
      <div className="postWrapper">
        <div className="postTop" >
          <div className="postTopLeft">
            <Link to={`profile/${users.username}`}>
              {" "}
              <img
                src={
                  users.profilePicture
                    ?users.profilePicture
                    : PF + "NoProfile.png"
                }
                alt=""
                className="postProfileImg"
              />
            </Link>

            <span className="postUsername">{users.username}</span>
            <span className="postDate">{format(post.createdAt)}</span>
          </div>
          <div className="postTopRight">
            {post.userId===currentUser._id&&(
                <p className="delete" onClick={deletePost}>Delete</p>
            )}
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">{post?.desc}</span>
          {post.location?<p className="postLocation" style={{color:"black,opacity:0.7"}}>{`-At ${post?.location}`}</p>:''}
          <LazyLoadImage src={post.img} alt="" className="postImg" effect="blur"/>
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            {isLiked?(<StarIcon className="star" onClick={likeCounter} style={{color:'#F1C40F',transform:"scale(1.3)"}} />):(<StarBorder className="star"  onClick={likeCounter} style={{color:'#F1C40F',transform:"scale(1.3)"}} />)}
            <span className="postLikeCounter">{like} people starred it</span>
          </div>
          <div className="postBottomRight">
          <span className="postCommentText">
            {comments.length} comments
          </span>
          </div>
        </div>
        <div className="commentInputField">
          <input
            type="text"
            className="commentInput"
            placeholder="Comment here"
            ref={commentTextInput}
          />
          <Send className="sendlogo" onClick={postCommentHandler} />
        </div>
        <button
          className="showComments"
          onClick={() => {
            setShowComments(!showComments);
          }}
        >
          {showComments ? "Hide Comments" : "Show Comments"}
        </button>
        {showComments && (
          <div className="comments">
            {comments.map((singleComment) => (
              <SingleComment singleComment = {singleComment} post={post} key={singleComment.id} fetchComments={fetchComments}/>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
