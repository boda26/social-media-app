import {configureStore} from "@reduxjs/toolkit";
import usersReducer from "../slices/users/userSlices";
import categoriesReducer from "../slices/category/categorySlice";
import post from "../slices/posts/postSlices";
import comment from "../slices/comments/commentSlices";
import sendMail from "../slices/email/emailSlices"
import accountVerification from "../slices/accountVerification/accountVerificationSlices";

const store = configureStore({
    reducer: {
        users: usersReducer,
        category: categoriesReducer,
        post,
        comment,
        sendMail,
        accountVerification,
    },
});

export default store;