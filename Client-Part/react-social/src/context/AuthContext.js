/*import { createContext, useEffect, useReducer } from "react";
import AuthReducer from "./AuthReducer";

const INITIAL_STATE = {
  user:null,
  isFetching: false,
  error: false,
};


export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

  
  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isFetching: state.isFetching,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};*/
import { createContext, useEffect, useReducer } from "react";
import AuthReducer from "./AuthReducer";

const INITIAL_STATE = {
user:JSON.parse(sessionStorage.getItem("user")) || null,
/*user:{
  _id : "60b3e12c56de01373419a276",
  profilePicture : "Prithwish.jpg",
  coverPicture : "",
  followers : [],
  followings : [],
  username : "Prithwish Samanta",
  email : "prithwish@gmail.com",
  password : "$2b$10$ipfcJYa0Aue9He3odtHX.uRmUX.tt2IbUWKkKt8d18z0EAs0Qi4Om",
  desc : "Excuses",
  city : "Burdwan",
  from : "India",
  relationship : "Single",
  __v : 0
},*/
  isFetching: false,
  error: false,
};


export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);
  
  useEffect(()=>{
    sessionStorage.setItem("user", JSON.stringify(state.user))
  },[state.user])
  
  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isFetching: state.isFetching,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
