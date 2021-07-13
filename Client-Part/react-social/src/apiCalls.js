import axios from "axios";

export const loginCall = async (userCredentials, dispatch) => {
  dispatch({ type: "LOGIN_START" });
  try {
    const res = await axios.post("/auth/login", userCredentials);
    sessionStorage.setItem("token",res.data.token)
    dispatch({ type: "LOGIN_SUCCESS", payload:res.data.user });
  } catch (err) {
    dispatch({ type: "LOGIN_FAILURE", payload: err });
  }
};

