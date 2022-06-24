const express = require('express');
const { 
    userRegisterCtrl,
    loginUserCtrl,
    fetchUsersCtrl,
    deleteUserCtrl, 
    fetchUserDetailsCtrl,
    userProfileCtrl,
    updateUserCtrl,
    updateUserPasswordCtrl,
    followingUserCtrl,
    unfollowUserCtrl,
    blockUserCtrl,
    unBlockUserCtrl,
    generateVerificationTokenCtrl,
    accountVerificationCtrl,
    forgetPasswordToken,
    passwordResetCtrl,
    profilePhotoUploadCtrl,
} = require('../../controllers/users/usersCtrl');
const authMiddleware = require('../../middleware/auth/authMiddleware');
const { photoUpload, profilePhotoResize } = require('../../middleware/uploads/photoUpload');
const userRoute = express.Router();


userRoute.post("/register", userRegisterCtrl);
userRoute.post("/login", loginUserCtrl);
userRoute.put(
    "/profilephoto-upload",
    authMiddleware, 
    photoUpload.single("image"),
    profilePhotoResize,
    profilePhotoUploadCtrl
);
userRoute.get("/", authMiddleware, fetchUsersCtrl);
userRoute.post("/forget-password-token", forgetPasswordToken);
userRoute.put("/reset-password", passwordResetCtrl);
userRoute.put("/password", authMiddleware, updateUserPasswordCtrl);
userRoute.put("/follow", authMiddleware, followingUserCtrl);
userRoute.post("/generate-verify-email-token", authMiddleware, generateVerificationTokenCtrl);
userRoute.put("/verify-account", authMiddleware, accountVerificationCtrl);
userRoute.put("/unfollow", authMiddleware, unfollowUserCtrl);
userRoute.put("/block-user/:id", authMiddleware, blockUserCtrl);
userRoute.put("/unblock-user/:id", authMiddleware, unBlockUserCtrl);
userRoute.get("/profile/:id", authMiddleware, userProfileCtrl);
userRoute.put("/", authMiddleware, updateUserCtrl);
userRoute.delete("/:id", deleteUserCtrl);
userRoute.get("/:id", fetchUserDetailsCtrl);


module.exports = userRoute;