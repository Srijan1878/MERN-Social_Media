import {
  ContactSupport,
  Favorite,
  MoreVert,
  Send,
  ThumbUpAlt,
  StarBorderIcon,
  StarBorder,
} from "@material-ui/icons";
import StarIcon from '@material-ui/icons/Star';
import "./post.css";
import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
export default function Post({ post }) {
  const { user: currentUser } = useContext(AuthContext);
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(post.likes.includes(currentUser?._id));
  const [users, setUsers] = useState({});
  //const [commentTexts,setCommentTexts] = useState([])
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  const [showComments, setShowComments] = useState(false);
  const commentTextInput = useRef();

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await axios.get(`/users?userId=${post.userId}`);
      setUsers(res.data);
    /*console.log(res.data)*/
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
      });
    } catch (err) {
      console.log(err);
    }

    setLike(isLiked ? like - 1 : like + 1, setIsLiked(true));
    setIsLiked(!isLiked);
  };
  const fetchComments = async () => {
    try {
      const res = await axios.get("/posts/" + post._id + "/comments");
    } catch (err) {
      console.log(err);
    }
  };
const deletePost = async()=>{
try{
await axios.delete('/posts/'+post._id, { data: { userId: currentUser._id } });
window.location.reload()
}catch(err){
console.log(err)
}
}
  const postCommentHandler = async () => {
    await postComments();
  };
  useEffect(() => {
    fetchComments();
  }, [post]);
  const postComments = async () => {
    try {
      await axios.put("/posts/" + post._id + "/comment", {
        text: commentTextInput.current.value,
        username: currentUser.username,
      });
    } catch (err) {
      console.log(err);
    }

    window.location.reload();
  };
  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`profile/${users.username}`}>
              {" "}
              <img
                src={
                  users.profilePicture
                    ? PF + users.profilePicture
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
          <img src={PF + post.img} alt="" className="postImg" />
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            {isLiked?(<StarIcon className="star" onClick={likeCounter} style={{color:'#F1C40F',transform:"scale(1.2)"}} />):(<StarBorder className="star"  onClick={likeCounter} style={{color:'#F1C40F',transform:"scale(1.2)"}} />)}
            <span className="postLikeCounter">{like} people starred it</span>
          </div>
          <div className="postBottomRight"></div>
          <span className="postCommentText">
            {post.comments.length} comments
          </span>
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
            {post.comments.map((singleComment) => (
              <div className="singleCommentComponent">
                <h4 className="commentor">{singleComment.username}</h4>
                <p className="singleComment">{singleComment.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
