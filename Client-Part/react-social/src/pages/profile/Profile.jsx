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
    /*const changeHandler=(e)=>{
        console.log(e)
        setNewProfilePicture(e.target.files[0])
        console.log(newProfilePicture)
    }*/
    const PF=process.env.REACT_APP_PUBLIC_FOLDER;
    const newProfilePicSubmitHandler = async(e)=>{
            e.preventDefault();
            /*if (newProfilePicture) {
              const data = new FormData();
              const fileName = newProfilePicture.name;
              data.append("name", fileName);
              data.append("file", newProfilePicture);
              user.profilePicture = fileName;
              console.log(user.profilePicture);
              try {
                await axios.post("/upload", data);
              } catch (err) {
                  console.log(err)
              }
            }*/
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
            onClick={()=>{setShowProfilePicture(true)}}
            />
            </div>
            <img 
            src={PF+user.coverPicture } 
            alt="" 
            className="profileCoverImg" /> 
            {showProfilePicture && (
                <div className="profilePictureContainer" >
                    <img className="profilePictureClicked" src={user.profilePicture?PF+user.profilePicture:PF+"NoProfile.png"} alt="" />
                    <Cancel className="closeLogo" onClick={()=>{setShowProfilePicture(false)}}/>
                   {/* <form encType="multipart/form-data" onSubmit={newProfilePicSubmitHandler}>
                        <label htmlFor="file"> <p className="uploadNewProfilePicture">Upload New profile Picture</p>
                        <input type="file"  accept=".png,.jpeg,.jpg" onChange={(e)=>{console.log(e)}} name="newProfilePicture" className="newProfilePicture" /></label>    
                    <button type="submit" className="submitButton" >Upload</button>
                    </form>*/}
                </div>
            )}
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
