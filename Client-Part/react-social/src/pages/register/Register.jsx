import axios from "axios";
import { useRef } from "react";
import { useHistory } from "react-router";
import "./register.css";
import { Link } from "react-router-dom";

export default function Register() {
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const passwordAgain = useRef();
  const history=useHistory()
  //registration of users
  const handleClick = async (e)=>{
    e.preventDefault()
    if(passwordAgain.current.value!==password.current.value){
      password.current.setCustomValidity("Passwords don't match")
    }else{
      const user ={
      username:username.current.value,
      email:email.current.value,
      password:password.current.value,
    }
    try{
    const res = await axios.post("/auth/register",user)
    history.push("/login")

    }catch(err){
        console.log(err)
    }
  }
  }
  return (
    <div className="signup">
      <div className="signupWrapper">
        <div className="signupleft">
          <h3 className="signupLogo">WeShare</h3>
          <span className="signupDesc">
            Share stuffs with friends from all over the world!
          </span>
        </div>
          <form className="signupBox" onSubmit={handleClick}>
            <input
              type="text"
              className="signupInput"
              placeholder="Username"
              ref={username}
            />
            <input type="email" className="signupInput" placeholder="Email" ref={email}/>
            <input
              type="password"
              className="signupInput"
              placeholder="Password"
              ref={password}
              minLength="6"
            />
            <input
              type="password"
              className="signupInput"
              placeholder="Confirm Password"
              ref={passwordAgain}
              minLength="6"
            />
            <button className="signupButton" >Sign Up</button>
            <p className="signIn">Already have an account?<Link to="/login" className="redirectLoginText">Sign in now</Link></p>
          </form>
          
      </div>
      
    </div>
  );
}
