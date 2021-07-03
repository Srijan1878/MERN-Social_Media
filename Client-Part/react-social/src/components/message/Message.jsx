import React from "react";
import './message.css'
import {format} from 'timeago.js'
export default function Message({message,own}) {
  return (
    <div className={own?"message own":"message"}>
      <div className="messageTop">
        <img
          src="https://images.pexels.com/photos/8205218/pexels-photo-8205218.jpeg?cs=srgb&dl=pexels-ye%C5%9F-8205218.jpg&fm=jpg"
          alt=""
          className="messageImg"
        />
        <p className="messageText">{message.text}</p>
      </div>
      <div className="messageBottom">{format(message.createdAt)}</div>
    </div>
  );
}
