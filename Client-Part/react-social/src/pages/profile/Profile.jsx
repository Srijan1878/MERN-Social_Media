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
import { Cancel } from '@material-ui/icons'


export default function Profile() {
    const [user,setUser] = useState({})
    const [showUpdate,setShowUpdate] = useState(true)
    const [showUpdateModal,setShowUpdateModal] = useState(false)
    const username=useParams().username
   const {user:currentUser} = useContext(AuthContext)
   const [showProfilePicture,setShowProfilePicture] = useState(false)
   const [newProfilePicture,setNewProfilePicture] = useState()
   
    useEffect(()=>{
        const fetchUsers=async()=>{
            const res= await axios.get(`/users?username=${username}`)
            setUser(res.data)
            console.log(user?._id)
    } 
        fetchUsers();
    },[username])
    const PF=process.env.REACT_APP_PUBLIC_FOLDER;
    const newProfilePicSubmitHandler = async(e)=>{
            e.preventDefault();
            try {
              await axios.put("/users/profilePicture/"+currentUser._id, {
                  profilePicture:newProfilePicture?.name
              });
            } catch (err) {
                console.log(err)
            }
          };    
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
            className="profileUserImg" 
            onClick={()=>{setShowProfilePicture(!showProfilePicture)}}
            />
            </div>
            <img 
            src={PF+user.coverPicture } 
            alt="" 
            className="profileCoverImg" /> 

                <div className={showProfilePicture?"profilePictureContainer":"hiddenProfilePictureContainer"} >
                    <img className={showProfilePicture?"profilePictureClicked":"profilePictureNotClicked"} src={user.profilePicture?PF+user.profilePicture:PF+"NoProfile.png"} alt="" />
                    <Cancel className={showProfilePicture?"closeLogo":"hiddenCloseLogo"} onClick={()=>{setShowProfilePicture(!showProfilePicture)}}/>
 
                </div>

            <div className="profileInfo">
                <h4 className="profileInfoName">{user?.username}</h4>
                <span className="profileInfoDesc">{user.desc}</span>
            </div>
            {user.username===currentUser.username && (
                <div>
            <button className="update" onClick={()=>{setShowUpdateModal(!showUpdateModal)}}>Update</button>
            </div>
            )}
                <div className={showUpdateModal?"showupdateModal":"hiddenupdateModal"}>
                   <Update showUpdateModal={showUpdateModal} setShowUpdateModal={setShowUpdateModal}/>
                   
                </div>

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
