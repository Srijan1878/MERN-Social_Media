import "./topbar.css";
import { Search, Chat, Notifications } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import HomeIcon from '@material-ui/icons/Home';
import PersonIcon from '@material-ui/icons/Person';
import axios from "axios";
import { useEffect } from "react";
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

export default function Topbar() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user } = useContext(AuthContext);
  const [searchValue, setSearchvalue] = useState();
  const [userDetails, setUserDetails] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [userData,setUserData] = useState({});
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
  const logoutHandler = () => {
    sessionStorage.clear();
    history.push("/");
    window.location.reload();
  };
  const deleteUser = async () => {
    try {
      await axios.delete(
        `/users/${user._id}`,
        { headers: { "auth-token": sessionStorage.getItem("token") } },
        { data: { userId: user._id } }
      );
    } catch (err) {
      console.log(err);
    }
  };
  const deletePosts = async () => {
    try {
      await axios.delete(
        `/posts/delete/${user._id}`,
        { headers: { "auth-token": sessionStorage.getItem("token") } },
        { data: { userId: user._id } }
      );
    } catch (err) {
      console.log(err);
    }
  };
  const deleteHandler = async () => {
    try {
      await deletePosts();
      deleteUser();
      sessionStorage.clear();
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };
useEffect(() => {
  const userData = async() =>{
    const res = await axios.get("/users?userId="+user._id)
    setUserData(res.data)
  }
  userData()
},[user])

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
            <span className="topbarLink">
            <HomeIcon/>
            </span>
          
          <span className="topbarLink">
          <Link to={`/profile/${user.username}`}>
              <PersonIcon style={{color:"white"}}/>
              </Link>
          </span>          
          <span className="topbarLink">
              <Link to="/messenger">
                <Chat className="chatLogo" />
              </Link>
              </span>
              <span className="topbarLink">
              <Notifications />
            </span>
            </div>
            <div className="profileEdit">
            
            
            <span className="topbarImgLink">
          <Link to={`/profile/${user.username}`}>
            <img
              src={
                userData.profilePicture
              }
              alt="profile"
              className="topbarImg"
            />
          </Link>
          
          </span>
          <div className="SettingsIconContainer">
          <ExitToAppIcon className="settingsIcon" onClick={logoutHandler}/>
          </div>
          
          </div>
          
          {/* {showDropdown && (
            <div className="dropdownMenu">
              <ul
                className="dropdownList"
                onMouseEnter={() => {
                  setShowDropdown(true);
                }}
                onMouseLeave={() => {
                  setShowDropdown(false);
                }}
              >
                <li className="dropdownText" onClick={clickHandler}>
                  Logout
                </li>
                <hr className="line"></hr>
                <li className="dropdownText" onClick={deleteHandler}>
                  Delete Account
                </li>
              </ul>
            </div>
          )} */}
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
