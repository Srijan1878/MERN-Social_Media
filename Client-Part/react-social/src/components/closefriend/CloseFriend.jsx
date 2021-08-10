import React, { useContext,useState } from 'react'
import './closefriend.css'
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

export default function CloseFriend({suggestion}) {
    const [clicked,setClicked] = useState(false)
    const {user:currentUser, dispatch} = useContext(AuthContext)
    const PF=process.env.REACT_APP_PUBLIC_FOLDER;
    const handleClick = async () => {
        try {
            await axios.put(`/users/${suggestion._id}/follow`, {
              userId: currentUser._id,
            },{headers:{"auth-token":sessionStorage.getItem("token")}});
            dispatch({ type: "FOLLOW", payload: suggestion._id });
            setClicked(true)
          }
         catch (err) {
          console.log(err);
        }
    }
    return (
        <div className="listContainer">
            <li className="sidebarFriend">
            <img src={PF + suggestion.profilePicture} alt="" className="sidebarFriendImg" />
            <span className="sidebarFriendName">{suggestion.username}        </span>
                <div className="addContainer" onClick={handleClick}>                
                <div className={clicked?"clickedFirst":"first"}></div>    
                <div className={clicked?"clickedSecond":"second"}></div>   
              
                </div>     
        </li>

        </div>
        
    )
}
