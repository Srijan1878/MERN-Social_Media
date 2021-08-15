import React, { useContext, useEffect, useState,useRef} from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Topbar from "../../components/topbar/Topbar";
import PagePosts from "../../components/pagePosts/PagePosts";
import "./page.css";
import { AuthContext } from "../../context/AuthContext";
import {
  PermMedia,
  Label,
  Room,
  EmojiEmotions,
  Cancel,
} from "@material-ui/icons";
import { storage } from "../../firebsae";

const Page = () => {
  const { user } = useContext(AuthContext);
  let pages = useParams();
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [pageData, setPageData] = useState({});
  const [memberSuggestions, setMemberSuggestions] = useState([]);
  const [pagePostImage,setpagePostImage] = useState()
  const [pageMembers, setPageMembers] = useState([])
  const [newPagePostUploaded,setNewPagePostUploaded] = useState(false)

  const desc  = useRef()
  

  //Get page data according to page title in params
  useEffect(async () => {
    const res = await axios.get("/pages/get/" + pages.title);
    setPageData(res?.data);
    console.log(pageData?.profilePicture)
  }, [newPagePostUploaded]); 
  useEffect (async() => {
    const res = await axios.get("/pages/get/members/" + pages.title);
    setPageMembers(res?.data);
  },[])
  //Getting suggestions for members
  useEffect(async () => {
    const getFriends = async () => {
        let newArr = []
      try {
        const res = await axios.get("/users/followers/followings/" + user._id, {
          headers: { "auth-token": sessionStorage.getItem("token") },
        });
        res?.data.map(a=>{
            a?.map(aa=>{newArr?.push(aa)
            })
          })
          var filtered =await newArr?.filter((a) => !pageData?.members?.includes(a?._id));
          console.log(filtered)
          setMemberSuggestions(filtered)     
          console.log(memberSuggestions)
        } catch (err) {
        console.log(err);
      }
    };
    getFriends();
  }, [pageData.members]);
  
    const submitHandler = (e) => {
      e.preventDefault();
      const uploadTask = storage.ref(`pages/posts/${pagePostImage.name}`).put(pagePostImage);
      uploadTask.on(
        `state_changed`,
        function progress(snapshot) {
        //   const progress = (326.7256*((snapshot.bytesTransferred / snapshot.totalBytes)*100))/100;
        //   const offset =  326.7256 - progress;
        //   console.log(progress)
        //   console.log(offset)
        //   circularBar.current.style.strokeDashoffset = offset;
        //  if(progress>0) newImage.current.style.opacity="0.65"
        console.log(snapshot.bytesTransferred)
        },
        (error) => {
          console.log(error);
        },
        () => {
          storage
            .ref("pages/posts/")
            .child(pagePostImage.name)
            .getDownloadURL()
            .then((url) => {
              axios.post(
                "/pages/posts/create/"+pageData._id,
                {
                  pageId: pageData._id,
                  posterId: user.username,
                  desc: desc.current.value,
                  img: url,
                },
                { headers: { "auth-token": sessionStorage.getItem("token") } }
              );
              setNewPagePostUploaded(!newPagePostUploaded);
              setpagePostImage(null)
              desc.current.value =''
            });
        }
      );
  }
  return (
    <>
      <Topbar />
      <div>
        <div className="pageContainer">
          <div className="CoverImgContainer">
            <img
              className="CoverImg"
              src="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
            />
          </div>
          <div className="pageBodyContent">
            <div className="profileImg">
              <img
                className="pageProfileImg"
                src="https://images.unsplash.com/photo-1589487391730-58f20eb2c308?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1053&q=80"
              ></img>
            </div>
            <div className="PageInfoContainer">
              <h4 className="pageTitle">{pageData?.title}</h4>
            </div>
            <div className="MembersContainer">
              <div className="membersWrapper">

                 {memberSuggestions?.map((memberSuggestion) =>
                  (
                    <>
                      <div className="singleMember">
                        <img
                          className="memberImg"
                          src={memberSuggestion.profilePicture}
                          alt=""
                        />
                        <span style={{ fontWeight: "400" }}>
                          {memberSuggestion.username}
                        </span>
                        <button className="btnAdd" onClick={async()=>{
                         const res = await axios.put("/pages/add/members/"+pageData._id,{
                             userId:memberSuggestion._id
                         })
                         } }>Add</button>
                      </div>
                    </>
                  ))}           

                  </div>
              </div>
            <div className="shareComponent">
            <div className="share2">
      <div className="shareWrapper2">
        <div className="shareTop">
          <img
            className="shareProfileImg"
            src={pageData.profilePicture}
            alt=""
          />
          <input
            placeholder="Create a new post"
            className="shareInput"
            ref = {desc}
          />
        </div>
        <hr className="shareHr" />
        {pagePostImage && (
          <div className="shareImgContainer">
            <img className="shareImg" src={URL.createObjectURL(pagePostImage)} alt="" />
            <Cancel className="shareCancelImg" onClick={() => setpagePostImage(null)} />
            <svg className="progress-ring" width="120" height="120">
              <circle
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
          encType="multipart/form-data"
          onSubmit={submitHandler}
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
                onChange={(e)=>{setpagePostImage(e.target.files[0])}}
              />
            </label>
            <div className="shareOption">
              <Label htmlColor="blue" className="shareIcon" />
              <span className="shareOptionText">Tag</span>
            </div>
            <div className="shareOption">
              <Room htmlColor="green" className="shareIcon" />
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
      </div>
    </div>
            </div>
            
            
            </div>
            <div className="pageMembersAndPagePostsContainer" style={{display:"flex"}}>
            <div className="pageMembersContainer" style={{marginRight:"35px"}}>
              <>
              <h1>Members</h1>
              {pageMembers?.map((pageMember) =>(
                  <h4>{pageMember.username}</h4>
              ))}
              </>
            </div>
            <PagePosts pageData={pageData} />
            </div>
            <div className="AddMembersContainer"></div>
            <div className="postSectionContaine"></div>
          </div>
        </div>

    </>
  );
};

export default Page;
