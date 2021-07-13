import "./topbar.css";
import { Search, Person, Chat, Notifications } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import axios from "axios";
export default function Topbar() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user } = useContext(AuthContext);
  const [searchValue, setSearchvalue] = useState();
  const [userDetails, setUserDetails] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  let history = useHistory();
  const fetchSearchUers = (query) => {
    setSearchvalue(query);
    fetch("/users/search", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
      }),
    })
      .then((res) => res.json())
      .then((results) => {
        setUserDetails(results.user);
      });
  };
  const clickHandler=()=>{
      sessionStorage.clear()
      history.push('/')
      window.location.reload()
  }
  const deleteUser=async()=>{
    try{
      await axios.delete(`/users/${user._id}`,{headers:{"auth-token":sessionStorage.getItem("token")}},{ data: { userId: user._id }})
    }catch(err){
      console.log(err)
    }
  }
  const deletePosts=async()=>{
    try{
      await axios.delete(`/posts/delete/${user._id}`,{headers:{"auth-token":sessionStorage.getItem("token")}},{ data: { userId: user._id }})
    }catch(err){
      console.log(err)
    }
  }
  const deleteHandler=async()=>{
    try{
      await deletePosts()
      deleteUser()
      sessionStorage.clear()
      window.location.reload()
    }
 catch(err){
   console.log(err)
 }
  }
  return (
    <>
      <div className="topbarContainer">
        <div className="topbarLeft">
          <Link to="/" style={{ textDecoration: "none" }}>
            <span className="logo">WeShare</span>
          </Link>
        </div>
        <div className="topbarCenter">
          <form className="searchBar">
            <Search className="searchIcon" type="submit" />
            <input
              type="text"
              placeholder="Search for friends or posts"
              className="searchInput"
              onChange={(e) => fetchSearchUers(e.target.value)}
            />
          </form>
        </div>
        <div className="topbarRight">
          <div className="topbarLinks">
            <span className="topbarLink">Homebar</span>
            <span className="topbarLink">Timeline</span>
          </div>
          <div className="topbarIcons">
            <div className="topbarIconItem">
              <Person className />
              <span className="topbarIconBadge">1</span>
            </div>
            <div className="topbarIconItem">
              <Link to="/messenger">
                <Chat className="chatLogo" />
              </Link>
              <span className="topbarIconBadge">2</span>
            </div>
            <div className="topbarIconItem">
              <Notifications />
              <span className="topbarIconBadge">3</span>
            </div>
          </div>
          <Link to={`/profile/${user.username}`}>
            <img
              src={
                user.profilePicture
                  ? PF + user.profilePicture
                  : PF + "NoProfile.png"
              }
              alt="profile"
              className="topbarImg"
            />
          </Link>
          <span onMouseOver={()=>{setShowDropdown(true)}} onMouseLeave={()=>{setShowDropdown(false)}}>
            <ArrowDropDownIcon className="dropdownLogo"  />
          </span >
          {showDropdown && (
            <div className="dropdownMenu" >
              <ul className="dropdownList" onMouseEnter={()=>{setShowDropdown(true)}} onMouseLeave={()=>{setShowDropdown(false)}}>
                <li className="dropdownText" onClick={clickHandler}>Logout</li>
                <hr className="line"></hr>
                <li className="dropdownText" onClick={deleteHandler}>Delete Account</li>

               
              </ul>
            </div>
          )}
        </div>
      </div>
      {searchValue && (
        <div className="searchModal">
          <div className="searchListContainer">
            {userDetails.map((item) => (
              <Link to={"/profile/" + item.username}>
                <div
                  className="searchComponent"
                  onClick={(e) => {
                    setSearchvalue("");
                  }}
                >
                  <img
                    src={PF + item.profilePicture}
                    alt="Dp"
                    className="searchItemProfilePicture"
                  />
                  <span classname="searchItemUsename">{item.username}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
