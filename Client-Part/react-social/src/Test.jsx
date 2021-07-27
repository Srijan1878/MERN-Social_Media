import axios from 'axios'
import React, { useContext, useState } from 'react'
import { storage } from './firebsae'
import { AuthContext } from './context/AuthContext'

export default function Test() {
    const {user} = useContext(AuthContext)
    const [image,setImage] = useState()
    const changeHandler = (e) => {
    if(e.target.files[0]){
        setImage(e.target.files[0])
    }
}
const uploadHandler = () => {
const uploadTask = storage.ref(`images/${image.name}`).put(image)
uploadTask.on(`state_changed`, (snapshot) => {},
error =>{
    console.log(error)
},
() => {
    storage
    .ref("images")
    .child(image.name)
    .getDownloadURL()
    .then(url=>{
         axios.put('/users/'+user._id,{
            profilePicture:url
    },{headers:{"auth-token":sessionStorage.getItem('token')}})
}
)}
)}
    return (
        <div>
            <input type="file" onChange={changeHandler} />
            <button onClick={uploadHandler}>upload</button>
        </div>
    )
}
