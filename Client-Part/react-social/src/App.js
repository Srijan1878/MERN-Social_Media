import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import {Messenger} from "./pages/messenger/Messenger";
import ForgotPassword from "./pages/forgotPassword/ForgotPassword";
import CreatePage from './pages/createpage/CreatePage'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext"
import Page from './pages/page/Page'
import Test from "./Test";


function App() {
  const {user} = useContext(AuthContext)
  return (<>
  <Router>
    <Switch>
    <Route exact path="/">{user ?<Home/> :<Register/>}
          </Route>
          <Route path="/login">{user ?<Redirect to ="/"/>:<Login/>}
          </Route>
          <Route path="/register">{user ?<Redirect to ="/"/>:<Register/>}
          </Route>
          <Route path="/messenger">{!user ?<Redirect to ="/"/>:<Messenger/>}
          </Route>
          <Route path="/profile/:username">
            <Profile />
          </Route>
          <Route path="/test">
            <Test />
          </Route>
          <Route path="/reset-password">
            <ForgotPassword />
          </Route>
          <Route exact path="/pages">
            <CreatePage />
          </Route>
          <Route path="/pages/get/:title">
            <Page />
          </Route>
    </Switch>
  </Router>
  </>   
  );
}

export default App;
