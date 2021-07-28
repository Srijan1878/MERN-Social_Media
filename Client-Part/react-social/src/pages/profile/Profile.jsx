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
import MonochromePhotosIcon from '@material-ui/icons/MonochromePhotos';
import { storage } from '../../firebsae'

export default function Profile() {
    const [user,setUser] = useState({})
    const [showUpdateModal,setShowUpdateModal] = useState(false)
    const username=useParams().username
   const {user:currentUser} = useContext(AuthContext)
   const [showProfilePicture,setShowProfilePicture] = useState(false)
   const [onProfilePicUpdate,setOnProfilePicUpdate] = useState(false)
   const [newProfilePictureSelected,setNewProfilePictureSelected] = useState(false)
   
    useEffect(()=>{
        const fetchUsers=async()=>{
            const res= await axios.get(`/users?username=${username}`,{headers:{"auth-token":sessionStorage.getItem("token")}})
            setUser(res.data)
            console.log(user?._id)
    } 
        fetchUsers();
    },[username,onProfilePicUpdate])
    const PF=process.env.REACT_APP_PUBLIC_FOLDER;
    console.log(user)
          const newProfilePicUploadHandler = () =>{
            const uploadTask = storage.ref(`images/${newProfilePictureSelected.name}`).put(newProfilePictureSelected)
            uploadTask.on(`state_changed`, (snapshot) => {
                console.log(snapshot.bytesTransferred)
            },
            error =>{
                console.log(error)
            },
            () => {
                storage
                .ref("images")
                .child(newProfilePictureSelected.name)
                .getDownloadURL()
                .then(url=>{
                     axios.put('/users/'+user._id,{
                        profilePicture:url
                },{headers:{"auth-token":sessionStorage.getItem('token')}})
                setNewProfilePictureSelected(null)
                setShowProfilePicture(false)
                setOnProfilePicUpdate(!onProfilePicUpdate)
            }
            )}
            )
          } 
    return (
        <>
         <Topbar />
            <div className="profile">
            <Sidebar/>
            <div className="profileRight" >   
            <div className="profileRightTop"> 
            <div className="profileCover">
            <img 
            src={user.profilePicture?user.profilePicture:PF+"NoProfile.png"}
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
                    <img className={showProfilePicture?"profilePictureClicked":"profilePictureNotClicked"} src={newProfilePictureSelected?URL.createObjectURL(newProfilePictureSelected): user.profilePicture?user.profilePicture:"NoProfile.png"} alt="" />
                    <Cancel className={showProfilePicture?"closeLogo":"hiddenCloseLogo"} onClick={()=>{setShowProfilePicture(!showProfilePicture)}}/>
                    <h5 className={showProfilePicture?"UpdateNewProfilePictureShown":"UpdateNewProfilePictureHidden"}>Have a better Picture? Change it here!</h5>
                    <label for="uploader">
                    <MonochromePhotosIcon className={showProfilePicture?"UpdateNewProfilePictureSelectorShown":"UpdateNewProfilePictureSelectorHidden"}/>
                   <input type="file" name="uploader" className="newProfilePictureUploader" id="uploader" onChange={(e)=>{setNewProfilePictureSelected(e.target.files[0])}} style={{display:"none"}}/>
                 </label>
                 {newProfilePictureSelected && (
                     <>
                     <button className="CancelBtn" onClick={()=>{setNewProfilePictureSelected(null)}}>Cancel</button>
                     <button className="UploadBtn" onClick={newProfilePicUploadHandler}>Upload</button>
                    </>
                 )}
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
                <div className={showUpdateModal?"showupdateModal":"hiddenupdateModal"} >
                   <Update showUpdateModal={showUpdateModal} setShowUpdateModal={setShowUpdateModal} />
                   
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
