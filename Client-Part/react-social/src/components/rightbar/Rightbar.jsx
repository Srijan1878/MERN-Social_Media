import "./rightbar.css";
import { Users } from "../../dummyData";
import Online from "../online/Online";
import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { Add, Remove } from "@material-ui/icons";
export default function Rightbar({ user }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [friends, setFriends] = useState([]);
  const { user: currentUser, dispatch } = useContext(AuthContext);
  const [isFollowed, setIsFollowed] = useState(
    currentUser.followings.includes(user?._id)
);
  useEffect(() => {
    console.log(user ? user._id : user);
    console.log(currentUser);
  }, []);

  useEffect(() => {
    const getFriends = async () => {
      try {
        const friendList = await axios.get("/users/friends/" + user?._id,{headers:{"auth-token":sessionStorage.getItem("token")}});
        setFriends(friendList.data);
      } catch (err) {
        console.log(err);
      }
    };
    getFriends();
  }, [user]);
  const handleClick = async () => {
    console.log(isFollowed);
    try {
      if (isFollowed) {
        await axios.put(`/users/${user?._id}/unfollow`,{
          userId: currentUser._id,
        },{headers:{"auth-token":sessionStorage.getItem("token")}});
        dispatch({ type: "UNFOLLOW", payload: user._id });
      } else {
        await axios.put(`/users/${user._id}/follow`, {
          userId: currentUser._id,
        },{headers:{"auth-token":sessionStorage.getItem("token")}});
        dispatch({ type: "FOLLOW", payload: user._id });
      }
    } catch (err) {
      console.log(err);
    }
    setIsFollowed(!isFollowed);
  };
  const HomeRightbar = () => {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;

    return (
      <>
        <div className="birthdayContainer">
          <img className="birthdayImg" src={PF + "gift.png"} alt="" />
          <span className="birthdayText">
            <b>Tapabrata Dutta</b> and <b>two other friends</b> have birthday
            today
          </span>
        </div>
        <div className="ad">
          <a
            href="https://www.zomato.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={PF + "zomato-logo.png"} alt="" className="rightbarAd" />
            <span className="AdTitle">
              <b>Order Food Online</b>
            </span>
          </a>
        </div>
        <h4 className="rightbarTitle">Online Friends</h4>
        <ul className="rightbarTitle">
          {Users.map((user) => (
            <Online key={user.id} user={user} />
          ))}
        </ul>
      </>
    );
  };
  const ProfileRightbar = () => {
    return (
      <>
        {user.username !== currentUser.username && (
          <button className="rightbarFollowButton" onClick={handleClick}>
            {currentUser.followings.includes(user?._id) ? "Unfollow" : "Follow"}
            {currentUser.followings.includes(user?._id) ? <Remove /> : <Add />}
          </button>
        )}
        <h4 className="rightbarTitle">User Information</h4>
        <div className="rightbarInfor">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">City:</span>
            <span className="rightbarInfoValue">{user.city}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">From:</span>
            <span className="rightbarInfoValue">{user.from}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Relationships:</span>
            <span className="rightbarInfoValue">{user.relationship}</span>
          </div>
        </div>
        <h4 className="rightbarTitle">User Friends</h4>
        <div className="rightbarFollowings">
          {friends.map((friend) => (
            <Link to={"/profile/" + friend.username}>
              <div className="rightbarFollowing">
                <img
                  src={
                    user.profilePicture
                      ? PF + friend.profilePicture
                      : PF + "noProfile.png"
                  }
                  alt=""
                  className="rightbarFollowingImg"
                />
                <div className="rightbarFollowingName">{friend.username}</div>
              </div>
            </Link>
          ))}
        </div>
      </>
    );
  };
  return (
    <div className="rightbar">
      <div className="righbarWrapper">
        {user ? <ProfileRightbar /> : <HomeRightbar />}
      </div>
    </div>
  );
}
