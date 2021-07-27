import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import Topbar from '../../components/topbar/Topbar'
import PagePosts from '../../components/pagePosts/PagePosts'
import './page.css'
const Page = () => {
    let pages = useParams()
    const [pageData,setPageData] = useState([])
    useEffect(async()=>{
    const res = await axios.get("/pages/get/" + pages.title)
    console.log(res.data)
    setPageData(res?.data)
    },[])
    return (
        <>
        <Topbar/>
        <div>
        <div className="pageContainer">
            <div className="CoverImgContainer">
                <img className="CoverImg" src="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"/>
            </div>
            <div className="pageBodyContent">
                <div className="profileImg">
                <img className = "pageProfileImg" src="https://images.unsplash.com/photo-1589487391730-58f20eb2c308?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1053&q=80"></img>
                </div>
                <div className = "PageInfoContainer" >
                    <h4 className="pageTitle">{pageData[0]?.title}</h4>
                </div>
                
               <PagePosts/>
                <div className="AddMembersContainer">
                
                </div>
                <div className="postSectionContaine">

                </div>
            </div>
        </div>
        </div>
        </>
    )
}

export default Page
