import { BrowserRouter, Switch, Route } from "react-router-dom";
import AddNewCategory from "./components/Categories/AddNewCategory";
import CategoryList from "./components/Categories/CategoryList";
import UpdateCategory from "./components/Categories/UpdateCategory";
import UpdateComment from "./components/Comments/UpdateComment";
import HomePage from "./components/HomePage/HomePage";
import Navbar from "./components/Navigation/Navbar";
import AdminRoute from "./components/Navigation/ProtectedRoutes/AdminRoute";
import PrivateProtectRoute from "./components/Navigation/ProtectedRoutes/PrivateProtectRoute";
import CreatePost from "./components/Posts/CreatePost";
import PostDetails from "./components/Posts/PostDetails";
import PostsList from "./components/Posts/PostsList";
import UpdatePost from "./components/Posts/UpdatePost";
import AccountVerified from "./components/Users/AccountVerification/AccountVerified";
import SendEmail from "./components/Users/Email/SendEmail";
import Login from "./components/Users/Login/Login";
import UpdatePassword from "./components/Users/PasswordManagement/UpdatePassword";
import Profile from "./components/Users/Profile/Profile";
import UpdateProfileForm from "./components/Users/Profile/UpdateProfileForm";
import UploadProfilePhoto from "./components/Users/Profile/UploadProfilePhoto";
import Register from "./components/Users/Register/Register";
import UsersList from "./components/Users/UsersList/UsersList";


function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Switch>
        <PrivateProtectRoute exact path='/users' component={UsersList} />
        <PrivateProtectRoute exact path='/verify-account/:token' component={AccountVerified} />
        <PrivateProtectRoute exact path='/send-mail' component={SendEmail} />
        <PrivateProtectRoute exact path='/update-profile/:id' component={UpdateProfileForm} />
        <PrivateProtectRoute exact path='/upload-profile-photo' component={UploadProfilePhoto} />
        <PrivateProtectRoute exact path='/profile/:id' component={Profile} />
        <PrivateProtectRoute exact path='/update-comment/:id' component={UpdateComment} />
        <PrivateProtectRoute exact path='/update-post/:id' component={UpdatePost} />
        <PrivateProtectRoute exact path='/create-post' component={CreatePost} />
        <PrivateProtectRoute exact path='/update-password' component={UpdatePassword} />
        <AdminRoute exact path='/update-category/:id' component={UpdateCategory} />
        <AdminRoute exact path='/add-category' component={AddNewCategory} />
        <AdminRoute exact path='/category-list' component={CategoryList} />
        <Route exact path="/" component={HomePage} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/posts" component={PostsList} />
        <Route exact path="/posts/:id" component={PostDetails} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
