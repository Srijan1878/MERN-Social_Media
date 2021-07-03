import Topbar from '../../components/topbar/Topbar'
import Sidebar from '../../components/sidebar/Sidebar'
import Feed from '../../components/feed/Feed'
import Rightbar from '../../components/rightbar/Rightbar'
import {useState,useEffect, useContext} from 'react'
import axios from "axios"
import {useParams} from 'react-router'
import './profile.css'
import Update from '../update/Update'
import { AuthContext } from '../../context/AuthContext'


export default function Profile() {
    const [user,setUser] = useState({})
    const [showUpdate,setShowUpdate] = useState(true)
    const [showUpdateModal,setShowUpdateModal] = useState(false)
    const username=useParams().username
   const {user:currentUser} = useContext(AuthContext)
   
    useEffect(()=>{
        const fetchUsers=async()=>{
            const res= await axios.get(`/users?username=${username}`)
            setUser(res.data)
    } 
        fetchUsers();
    },[username])
    const PF=process.env.REACT_APP_PUBLIC_FOLDER;
    return (
        <>
         <Topbar/>
            <div className="profile">
            <Sidebar/>
            <div className="profileRight">   
            <div className="profileRightTop"> 
            <div className="profileCover">
            <img 
            src={user.profilePicture?PF+user.profilePicture:PF+"NoProfile.png"}
            alt="" 
            className="profileUserImg" />
            </div>
            <img 
            src={PF+user.coverPicture } 
            alt="" 
            className="profileCoverImg" /> 
            <div className="profileInfo">
                <h4 className="profileInfoName">{user.username}</h4>
                <span className="profileInfoDesc">{user.desc}</span>
            </div>
            {user.username===currentUser.username && (
                <div>
            <button className="update" onClick={()=>{setShowUpdateModal(!showUpdateModal)}}>Update</button>
            </div>
            )}
{showUpdateModal && (
                <div className="updateModal">
                   <Update showUpdateModal={showUpdateModal} setShowUpdateModal={setShowUpdateModal}/>
                   
                </div>
                )}
            </div>
            <div className="profileRightBottom">
            <Feed username={username}/>
            <Rightbar user={user}/> 
            </div>    
            </div>
            </div>
        </>
    )
}
