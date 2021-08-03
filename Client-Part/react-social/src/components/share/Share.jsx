import "./share.css";
import {
  PermMedia,
  Label,
  Room,
  EmojiEmotions,
  Cancel,
} from "@material-ui/icons";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { storage } from "../../firebsae";
import MyLocationIcon from '@material-ui/icons/MyLocation';
export default function Share({ setNewPostUploaded, newPostUploaded }) {
  const { user } = useContext(AuthContext);
  const desc = useRef();
  const circularBar = useRef();
  const newImage = useRef();
  const [image, setImage] = useState(null);
  const [userData, setUserData] = useState({});
  const [showLocationOptions, setShowLocationOptions] = useState(false);
  const [postUserLocation, setPostUserLocation] = useState();
  const [customLocationValue, setCustomLocationValue] = useState();
  const [userLocationAvailable,setUserLocationAvailable] = useState(false);
  const [finalCustomLocationValue, setFinalCustomLocationValue] = useState('');
 
  const submitHandler = (e) => {
    e.preventDefault();
    const uploadTask = storage.ref(`posts/${image.name}`).put(image);
    uploadTask.on(
      `state_changed`,
      function progress(snapshot) {
        const progress = (326.7256*((snapshot.bytesTransferred / snapshot.totalBytes)*100))/100;
        const offset =  326.7256 - progress;
        console.log(progress)
        console.log(offset)
        circularBar.current.style.strokeDashoffset = offset;
       if(progress>0) newImage.current.style.opacity="0.65"
      },
      (error) => {
        console.log(error);
      },
      () => {
        storage
          .ref("posts")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            axios.post(
              "/posts",
              {
                userId: user._id,
                desc: desc.current.value,
                location: postUserLocation || finalCustomLocationValue,
                img: url,
              },
              { headers: { "auth-token": sessionStorage.getItem("token") } }
            );
            setNewPostUploaded(!newPostUploaded);
            setImage(null)
            setPostUserLocation(null)
            setFinalCustomLocationValue('')
            setCustomLocationValue('')
            setShowLocationOptions(false)
            desc.current.value = '';
          });
      }
    );
  };
  useEffect(() => {
    const userData = async () => {
      const res = await axios.get("/users?userId=" + user._id);
      setUserData(res.data);
    };
    userData();
  }, [user]);
  
  const getLocationHandler =  () => {
    if ("geolocation" in navigator) {
      setUserLocationAvailable(true)
    } else {
      setUserLocationAvailable(false)
    }
    if(setUserLocationAvailable){
      navigator.geolocation.getCurrentPosition(async function(position) {
  
        const res =await axios.get (`http://api.positionstack.com/v1/reverse?access_key=8f30204be1e2e15a826c9753c9d4fbdf&query=${position.coords.latitude},${position.coords.longitude}`)
        setPostUserLocation(res.data.data[0].locality)
      });
    }
    }
  
    //data[0].locality
    const locationAddHandler = () =>{
      setFinalCustomLocationValue(customLocationValue)
    }
  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <img
            className="shareProfileImg"
            src={userData.profilePicture}
            alt=""
          />
          <input
            placeholder={"What's in your mind " + user.username + "?"}
            className="shareInput"
            ref={desc}
          />
          
          <h4 className="postDescLocation" style={{opacity:"0.7"}}>{postUserLocation?`-At ${postUserLocation}`:customLocationValue?`-At ${finalCustomLocationValue}`:''}</h4>
          
          
        </div>
        <hr className="shareHr" />
        {image && (
          <div className="shareImgContainer">
            <img className="shareImg" ref={newImage} src={URL.createObjectURL(image)} alt="" />
            <Cancel className="shareCancelImg" onClick={() => setImage(null)} />
            <svg className="progress-ring" width="120" height="120">
              <circle
              ref={circularBar}
                className="progress-ring__circle"
                stroke="#5b54fa"
                strokeWidth="4"
                strokeDasharray="326.7256 326.7256"
                strokeDashoffset="326.7256"
                fill="transparent"
                r="30"
                cx="60"
                cy="60"
              />
            </svg>
          </div>
        )}
        <form
          className="shareBottom"
          onSubmit={submitHandler}
          encType="multipart/form-data"
        >
          <div className="shareOptions">
            <label htmlFor="file" className="shareOption">
              <PermMedia htmlColor="tomato" className="shareIcon" />
              <span className="shareOptionText" style={{ color: "black" }}>
                Photo or Video
              </span>
              <input
                style={{ display: "none" }}
                type="file"
                id="file"
                name="file"
                accept=".png,.jpeg,.jpg"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </label>
            <div className="shareOption">
              <Label htmlColor="blue" className="shareIcon" />
              <span className="shareOptionText">Tag</span>
            </div>
            <div className="shareOption">
              <Room htmlColor="green" className="shareIcon" onClick={()=>{setShowLocationOptions(!showLocationOptions)}}/>
              <span className="shareOptionText">Location</span>
            </div>
            <div className="shareOption">
              <EmojiEmotions htmlColor="goldenrod" className="shareIcon" />
              <span className="shareOptionText">Feelings</span>
            </div>            
          </div>
          <button className="shareButton" type="submit">
            Share
          </button>
        </form>

              <div className={showLocationOptions?"locationOptionsModal":"HiddenLocationOptionsModal"}>
                <div className="LocationItemList" onClick={getLocationHandler}>
                <MyLocationIcon style={{color:"green",transform:"scale(0.8)"}}/>
                <h4 style={{fontSize:"13px",opacity:"0.7"}}>Current Location</h4>
                </div>
                <div className="CustomLocationEditorContainer">
                <input type="text" className="CustomLocationEditor" placeholder="Add Location" value={customLocationValue} onChange={(e)=>{setCustomLocationValue(e.target.value)}}/>
                <hr style={{width:"275px",border:"2px solid #5b54fa"}}/>
                <button className="addLocationBtn" onClick={locationAddHandler}>Save</button>
                </div>
                
              </div>                    
      </div>
    </div>
  );
}
