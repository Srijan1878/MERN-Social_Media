import { Send, StarBorder } from '@material-ui/icons'
import React from 'react'
import './PagePosts.css'
const PagePosts = ({pageData}) => {
    return (
        <div className="postsContainer">
           {pageData?.post?.map(pagePost => ( 
            <div className="pagePostComponent">
              <div className="postTop">
                  <div className="posterInfoContainer">                
              <img className="posterProfileImg" src="https://images.unsplash.com/photo-1627244714766-94dab62ed964?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=701&q=80" alt="" />
              <span className="posterName">Hello</span>  
              </div>
            </div>
              <div className="pagePostImgContainer">
                <h5 className="pagePostDescription" style={{fontSize:"15px",fontWeight:"400"}}>{pagePost.desc}</h5>
              <img className="pagePostImg" src="https://images.unsplash.com/photo-1627241384307-085049264cc1?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80" alt="" />
              </div>
              <div className="postBottom">
              <div className="pagePostLikesContainer">
                <div className="pageStarsContainer">
                <StarBorder style={{transform:"scale(1.3)"}}/>
                <p style={{color:"black",marginLeft:"5px",marginTop:"1px"}}>2 people starred it</p>
                </div>
                <p className="commentCounter">3 comments</p>

              </div>
              <div className="commentContainer">
                  <input type="text" placeholder="comment here" className="pagePostCommentTextInput"/>
                  <Send style={{transform:"scale(1.2)",marginBottom:"4.5px"}}/>
              </div>
              <button className= "showCommentsButton" >Show Comments</button>
              </div>
            </div>
           ))} 
      
        </div>
    )
}

export default PagePosts
