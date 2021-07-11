import { Bookmarks, Group, RssFeed, VideoLibrary } from '@material-ui/icons'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import CloseFriend from '../closefriend/CloseFriend'
import  './sidebar.css'
import axios from 'axios'


export default function Sidebar() {
const {user} = useContext(AuthContext)
const [suggestions, setSuggestions ] = useState([])
console.log(user._id)
useEffect(()=>{
    let allUsers = []
    let frnds =[]
    let suggest =[]
    let userMatch = false
   
    async function getFetchData(){
        await axios.get("/users/friends").then(res=>allUsers=res.data).catch(err=>console.log(err));
        await  axios.get("/users/friends/"+user._id).then(res=>frnds=(res.data)).catch(err=>console.log(err));
        allUsers?.map((u) => {
            frnds?.map(
                  (friend) => (friend._id===u._id) && (userMatch = true)
                );
                if (!userMatch) {
                  suggest.push(u);
                } else {
                  userMatch = false;
                }
                
              });
              setSuggestions(suggest)
    }
        getFetchData()

        console.log("suorer bach")

  },[])   

    return (
        <div className="sidebar">
            <div className="sidebarWrapper">
            <ul className="sidebarList">
                <li className="sidebarListItem">
                    <RssFeed className="sidebarIcon"/>
                    <span className="sidebarListItemText">
                     Feed
                    </span>
                </li>
                <li className="sidebarListItem">
                    <VideoLibrary className="sidebarIcon"/>
                    <span className="sidebarListItemText">
                     Videos
                    </span>
                </li>
                <li className="sidebarListItem">
                    <Bookmarks className="sidebarIcon"/>
                    <span className="sidebarListItemText">
                    Bookmarks
                    </span>
                </li>
                <li className="sidebarListItem">
                    <Group className="sidebarIcon"/>
                    <span className="sidebarListItemText">
                    Groups
                    </span>
                </li>
            </ul>
            <button className="sidebarButton">Show more</button>
                <hr className="sidebarHr" />
                <h3 style={{marginBottom:"10px"}}> Suggestions</h3>
                <ul className="sidebarFriendlist">   
       {suggestions.map((suggestion)=>(
           suggestion._id!==user._id && <CloseFriend key={suggestion?._id} suggestion={suggestion}/>
        ))}
        </ul>

                
            </div>
        </div>
    )
}
