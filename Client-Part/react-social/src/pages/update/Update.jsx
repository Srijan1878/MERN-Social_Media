import React from 'react'
import './update.css'
import { useState,useContext } from 'react' 
import { AuthContext } from '../../context/AuthContext'
import axios from 'axios'
import CancelIcon from '@material-ui/icons/Cancel';

export default function Update({showUpdateModal,setShowUpdateModal}) {
    const { user: currentUser } = useContext(AuthContext)
    const [updateValue,setUpdateValue] = useState({
        desc:"",
        city:"",
        from:"",
        relationship:""
    })
    //posting updated values on submit
    const submitHandler = async(e) =>{
        e.preventDefault()
        try{
            console.log(updateValue)
            await axios.put("/users/"+currentUser._id,{
                desc:updateValue.desc,
                city:updateValue.city,
                from:updateValue.from,
                relationship:updateValue.relationship
            })
            console.log("updated")
           window.location.reload()
        }catch(err){
            console.log(err)
        }
        console.log(updateValue.relationship)
        }
    return (
        <div>          
           <form onSubmit={submitHandler} className="updateForm">
           <h2 className="updateTitle">Update Your About Section</h2>
               <label htmlFor="desc">Description:</label>
                       <input className="updateInput"type="text" onChange={e =>setUpdateValue({...updateValue,desc:e.target.value})} value={updateValue.desc} name="desc"/>                            
                       <label htmlFor="desc"> City:</label>
                       <input className="updateInput"type="text" onChange={e =>setUpdateValue({...updateValue,city:e.target.value})} value={updateValue.city} name="city"/> 
                       <label htmlFor="desc"> From:</label>
                       <input className="updateInput"type="text" onChange={e =>setUpdateValue({...updateValue,from:e.target.value})} value={updateValue.from} name="from"/> 
                       <label htmlFor="desc"> Relationship Status:</label>
                       <input className="updateInput"type="text" onChange={e =>setUpdateValue({...updateValue,relationship:e.target.value})} value={updateValue.relationship} name="relationship"/> 
                      <div className="btnContainer">
                      <button type="submit" id="btn">update</button>
                      <CancelIcon className="cancelLogo" style={{marginTop:"18px"}} onClick={()=>{setShowUpdateModal(false)}}/>
                      </div>
                     
                   </form>
        </div>
    )
}
