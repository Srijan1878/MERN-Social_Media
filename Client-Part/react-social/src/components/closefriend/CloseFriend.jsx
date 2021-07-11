import React, { useContext } from 'react'
import './closefriend.css'
import AddSharpIcon from '@material-ui/icons/AddSharp';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

export default function CloseFriend({suggestion}) {
    const {user:currentUser, dispatch} = useContext(AuthContext)
    const PF=process.env.REACT_APP_PUBLIC_FOLDER;
    const handleClick = async () => {
        try {
            await axios.put(`/users/${suggestion._id}/follow`, {
              userId: currentUser._id,
            });
            dispatch({ type: "FOLLOW", payload: suggestion._id });
          }
         catch (err) {
          console.log(err);
        }
    }
    return (
        <div className="listContainer">
            <li className="sidebarFriend">
            <img src={PF + suggestion.profilePicture} alt="" className="sidebarFriendImg" />
            <span className="sidebarFriendName">{suggestion.username}</span>
                <AddSharpIcon style={{position:'absolute',left:'235px'}} className="followIcon" onClick={handleClick}/>     
        </li>

        </div>
        
    )
}
