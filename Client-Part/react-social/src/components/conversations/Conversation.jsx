import axios from "axios";
import React, { useEffect, useState } from "react";
import "./conversation.css";
export default function Conversation({ conversation, currentUser }) {
  const PF=process.env.REACT_APP_PUBLIC_FOLDER
    const [user, setUser] = useState();
    //const [isLoading,setIsLoading] = useState(true)
    const getUser = async () => {
        const friendId = conversation.member.find((m) => m !== currentUser._id);
        try {
          const res = await axios.get("users?userId=" + friendId);
          setUser(res.data)
         //setIsLoading(false)
        } catch (err) {
          console.log(err);
        }
      };
useEffect(() => {
getUser();
},[conversation,currentUser]);
/*if(isLoading){
    return(
        <>
        </>
    )
}*/ 
return (
    <div className="conversation">
    
      <img
        src={user?.profilePicture?PF+user.profilePicture:PF+"NoProfile.png"}
        alt=""
        className="conversationImg"
      />
     <span className="ConversationName">{user?.username}</span>
     </div>
  );
}
