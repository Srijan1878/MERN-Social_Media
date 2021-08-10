import './login.css'
import {useContext, useRef, useState} from 'react'
import {loginCall} from "../../apiCalls"
import { AuthContext } from '../../context/AuthContext'
import { CircularProgress } from '@material-ui/core';
import {Link} from 'react-router-dom'
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';

export default function Login() {
    const email =useRef()
    const [wrongPassword,setWrongPassword] = useState(false)
    const password =useRef()
    const {user, isFetching, error, dispatch} = useContext(AuthContext)
    const [passwordShown,setPasswordShown] = useState(false)
    const handleSubmit = (e) =>{
        e.preventDefault()
         loginCall({email:email.current.value,password:password.current.value},dispatch).then(()=>{
        setTimeout(()=>{
            if(window.location.href.includes('/login')){
            setWrongPassword(true)
            }
        },1000)
    })
}
const showPasswordHandler = () =>{
    if(password.current.value.length > 0){
        password.current.type = 'text'
        setPasswordShown(true)
}  
}
 const hidePasswordHandler = () =>{
    if(password.current.value.length > 0){
        password.current.type = 'password'
} 
setPasswordShown(false)
 } 
    return (
        <div className="login">
        <div className="loginWrapper">
            <div className="loginleft">
                <h3 className="loginLogo">WeShare</h3>
                <span className="loginDesc">Share stuffs with friends from all over the world!</span>
            </div>
            <div className="loginRight">
                <form className="loginBox" onSubmit={handleSubmit} >           
                    <input type="email" className="loginInput" placeholder="Email" ref={email} />
                   <div className="passwordInputContainer">
                   <input type="password" className="loginInputPassword" placeholder="password"  required ref={password}/>
                   {!passwordShown?<VisibilityIcon className="showPassword" style={{color:"black"}} onClick={showPasswordHandler}/>:<VisibilityOffIcon  className="hidePassword" style={{color:"black"}} onClick={hidePasswordHandler}/>}   
                       </div> 
                    
                    
                    <button type="submit" className="loginButton" disabled={isFetching}>{isFetching?<CircularProgress color="white" size="15px"/>:"Log In"}</button>
                    
                    <div className="loginProblemContainer">
                        <Link to="/reset-password">
                    <button id="btn2"className="loginForgot">Forgot Password?</button>
                    </Link>
                    <Link to="/register">
                    <button id="btn3" className="loginRegistration">Create a new account</button>
                    </Link>
                    </div>
                    <p className={wrongPassword?"showWrongPassword":"hideWrongPassword"}>Password or Email is wrong</p>
                </form>
            </div>
        </div>
        </div>
    )
}