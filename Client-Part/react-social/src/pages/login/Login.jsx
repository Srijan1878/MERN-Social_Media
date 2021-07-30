import './login.css'
import {useContext, useRef, useState} from 'react'
import {loginCall} from "../../apiCalls"
import { AuthContext } from '../../context/AuthContext'
import { CircularProgress } from '@material-ui/core';
import {Link} from 'react-router-dom'
export default function Login() {
    const email =useRef()
    const [wrongPassword,setWrongPassword] = useState(false)
    const password =useRef()
    const {user, isFetching, error, dispatch} = useContext(AuthContext)
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
                    <input type="password" className="loginInput" placeholder="password"  required ref={password}/>
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