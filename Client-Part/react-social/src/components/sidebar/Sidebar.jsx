import { Bookmarks, Group, RssFeed, VideoLibrary } from "@material-ui/icons";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import CloseFriend from "../closefriend/CloseFriend";
import "./sidebar.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";

export default function Sidebar() {
  const { user } = useContext(AuthContext);
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [userPages, setUserPages] = useState([]);
  useEffect(() => {
    let allUsers = [];
    let frnds = [];
    let suggest = [];
    let userMatch = false;

    async function getFetchData() {
      await axios
        .get("/users/friends", {
          headers: { "auth-token": sessionStorage.getItem("token") },
        })
        .then((res) => (allUsers = res.data))
        .catch((err) => console.log(err));
      await axios
        .get("/users/friends/" + user._id, {
          headers: { "auth-token": sessionStorage.getItem("token") },
        })
        .then((res) => (frnds = res.data))
        .catch((err) => console.log(err));
      allUsers?.map((u) => {
        frnds?.map((friend) => friend._id === u._id && (userMatch = true));
        if (!userMatch) {
          suggest.push(u);
        } else {
          userMatch = false;
        }
      });
      setSuggestions(suggest);
    }
    getFetchData();
  }, []);
  useEffect(async () => {
    const res = await axios.get("/pages/find/" + user._id);
    setUserPages(res.data);
  }, []);

  return (
    <motion.div
      className="sidebar"
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="sidebarWrapper">
        <ul className="sidebarList">
          <li className="sidebarListItem">
            <RssFeed className="sidebarIcon" />
            <Link to="/pages">
              <span
                className="sidebarListItemText"
                style={{ textDecoration: "none" }}
              >
                Pages
              </span>
            </Link>
          </li>
          <li className="sidebarListItemWithDropDown">
            <div style={{ display: "flex", alignItems: "center" }}>
              <Bookmarks className="sidebarIcon" />
              <span className="sidebarListItemText">My Pages</span>
            </div>
            {showDropdown ? (
              <ExpandLessIcon
                style={{ marginRight: "50px" }}
                onClick={() => {
                  setShowDropdown(false);
                }}
              />
            ) : (
              <ExpandMoreIcon
                style={{ marginRight: "50px" }}
                onClick={() => {
                  setShowDropdown(true);
                }}
              />
            )}
          </li>
          {userPages.map((userPage) => (
            <ul
              className={
                showDropdown ? "sidebarDropdownList" : "hiddenDropdownList"
              }
            >
              <Link to  = {"/pages/get/"+userPage.title} >
              <li className="ExpandedList">{userPage.title}</li>
              </Link>
            </ul>
          ))}
          <li className="sidebarListItem">
            <VideoLibrary className="sidebarIcon" />
            <span className="sidebarListItemText">Videos</span>
          </li>
          <li className="sidebarListItem">
            <Bookmarks className="sidebarIcon" />
            <span className="sidebarListItemText">Bookmarks</span>
          </li>
          <li className="sidebarListItem">
            <Group className="sidebarIcon" />
            <span className="sidebarListItemText">Groups</span>
          </li>
        </ul>
        <button className="sidebarButton">Show more</button>
        <hr className="sidebarHr" />
        <h3 style={{ marginBottom: "10px" }} className="suggestionTitle">
          {" "}
          Suggestions
        </h3>
        <ul className="sidebarFriendlist">
          {suggestions.map(
            (suggestion) =>
              suggestion._id !== user._id && (
                <CloseFriend key={suggestion?._id} suggestion={suggestion} />
              )
          )}
        </ul>
      </div>
    </motion.div>
  );
}
