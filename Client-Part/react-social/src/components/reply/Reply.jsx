import React from 'react'
import './reply.css'
const Reply = ({reply}) => {
    return (
        <div className="singleReplyComponent">
             <h5 style={{fontSize:"15px"}}>{reply.username}</h5> 
            <p style={{color:"black",opacity:"0.8",fontSize:"14px",marginTop:"3px"}}>{reply.text}</p>
        </div>
    )
}

export default Reply
