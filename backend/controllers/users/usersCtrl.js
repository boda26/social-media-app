const expressAsyncHandler = require("express-async-handler");
const sgMail = require("@sendgrid/mail");
const { generateToken } = require("../../config/token/generateToken");
const User = require("../../model/user/User");
const validateMongodbID = require("../../utils/validateMongodbID");
const crypto = require("crypto");
const cloudinaryUploadImg = require("../../utils/cloudinary");
const fs = require("fs");
sgMail.setApiKey(process.env.SEND_GRID_API_KEY);


//register
const userRegisterCtrl = expressAsyncHandler(async (req, res) => {
    // check if user Exist
    const userExists = await User.findOne({email:req?.body?.email});
    if (userExists) throw new Error("User already exists");

    try {
        const user = await User.create({
            firstName: req?.body?.firstName,
            lastName: req?.body?.lastName,
            email: req?.body?.email,
            password: req?.body?.password,
        });
        res.json(user);
    } catch (error) {
        res.json(error);
    }
});


//login user
const loginUserCtrl = expressAsyncHandler(async (req, res) => {
    const {email, password} = req.body;
    const userFound = await User.findOne({email});
    //check if blocked
    if (userFound?.isBlocked) throw new Error("Access denied, you are blocked!")
    //check if password match
    if (userFound && await userFound.isPasswordMatched(password)) {
        res.json({
            _id: userFound?._id,
            firstName: userFound?.firstName,
            lastName: userFound?.lastName,
            email: userFound?.email,
            profilePhoto: userFound?.profilePhoto,
            isAdmin: userFound?.isAdmin,
            token: generateToken(userFound?._id),
            isVerified: userFound?.isAccountVerified,
        });
    } else {
        res.status(401);
        throw new Error("Invalid Login Credentials");
    }
});


//users
const fetchUsersCtrl = expressAsyncHandler(async (req, res) => {
    console.log(req.headers);
    try {
        const users = await User.find({}).populate('posts');
        res.json(users);
    } catch (error) {
        res.json(error);
    }
});


//delete user
const deleteUserCtrl = expressAsyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongodbID(id);
    try {
        const deletedUser = await User.findByIdAndDelete(id);
        res.json(deletedUser);
    } catch (error) {
        res.json(error);
    }
    res.send("Delete user ctrl");
});


//user details
const fetchUserDetailsCtrl = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbID(id);
    try {
        const user = await User.findById(id).select("-password");
        res.json(user);
    } catch (error) {
        res.json(error);
    }
});


// user profile
const userProfileCtrl = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbID(id);

    // 1.find login user
    const loginUserId = req?.user?._id.toString()

    // 2.check this particular user if login user exists in the array of viewedBy
    try {
        const myProfile = await User.findById(id).populate('posts').populate("viewedBy")
            .select("-password");
        const alreadyViewed = myProfile?.viewedBy?.find(user => {
            return user?._id.toString() === loginUserId
        });
        if (alreadyViewed) {
            res.json(myProfile)
        } else {
            const profile = await User.findByIdAndUpdate(myProfile?._id, {
                $push: {viewedBy: loginUserId}
            })
            res.json(profile)
        }
    } catch (error) {
        res.json(error);
    }
});


//update profile
const updateUserCtrl = expressAsyncHandler(async (req,res) => {
    const { _id } = req?.user;
    console.log(req.user);
    console.log(req.user._id === req.user.id);
    validateMongodbID(_id);
    const user = await User.findByIdAndUpdate(
        _id, 
        {
        firstName: req?.body?.firstName,
        lastName: req?.body?.lastName,
        email: req?.body?.email,
        bio: req?.body?.bio,
        }, 
        {
        new: true,
        runValidators: true,
        }
    );
    res.json(user);
});


//update password
const updateUserPasswordCtrl = expressAsyncHandler(async (req,res) => {
    //destructure login user
    const { _id } = req.user;
    const { password } = req.body;
    validateMongodbID(_id);
    const user = await User.findById(_id);
    if (password) {
        user.password = password;
        const updatedUser = await user.save();
        res.json(updatedUser);
    } else {
        res.json(user);
    }
});


// //following
// const followingUserCtrl = expressAsyncHandler(async (req,res) => {
//     const {followId} = req.body;
//     const loginUserId = req.user.id;

//     //find target user and check if target id exists
//     const targetUser = await User.findById(followId);
//     const alreadyFollowing = targetUser?.followers?.find(
//         user => user?.toString() === loginUserId.toString());
//     if (alreadyFollowing) {
//         throw new Error("You are already following this user");
//     }
//     //update target's followers list
//     await User.findByIdAndUpdate(followId, {
//         $push: {followers: loginUserId},
//         isFollowing: true,
//     }, {
//         new: true
//     });
//     //update my following list
//     await User.findByIdAndUpdate(loginUserId, {
//         $push: {following: followId},
//     }, {
//         new: true
//     });
//     res.json("You have successfully followed this user!");
// });


// //unfollow
// const unfollowUserCtrl = expressAsyncHandler(async (req,res) => {
//     const {unfollowId} = req.body;
//     const loginUserId = req.user.id;
//     await User.findByIdAndUpdate(unfollowId, {
//         $pull: {followers: loginUserId},
//         isFollowing: false,
//     }, {
//         new: true
//     });

//     await User.findByIdAndUpdate(loginUserId, {
//         $pull: {following: unfollowId}
//     }, {
//         new: true
//     });
//     res.json("You have successfully unfollowed this user!");
// });



//------------------------------
//following
//------------------------------

const followingUserCtrl = expressAsyncHandler(async (req, res) => {
    //1.Find the user you want to follow and update it's followers field
    //2. Update the login user following field
    const { followId } = req.body;
    const loginUserId = req.user.id;
  
    //find the target user and check if the login id exist
    const targetUser = await User.findById(followId);
  
    const alreadyFollowing = targetUser?.followers?.find(
      user => user?.toString() === loginUserId.toString()
    );
  
    if (alreadyFollowing) throw new Error("You are currently following this user!");
  
    //1. Find the user you want to follow and update it's followers field
    await User.findByIdAndUpdate(
      followId,
      {
        $push: { followers: loginUserId },
        isFollowing: true,
      },
      { new: true }
    );
  
    //2. Update the login user following field
    await User.findByIdAndUpdate(
      loginUserId,
      {
        $push: { following: followId },
      },
      { new: true }
    );
    res.json("You have successfully followed this user");
  });
  
  //------------------------------
  //unfollow
  //------------------------------
  
const unfollowUserCtrl = expressAsyncHandler(async (req, res) => {
    const { unFollowId } = req.body;
    const loginUserId = req.user.id;
  
    await User.findByIdAndUpdate(
      unFollowId,
      {
        $pull: { followers: loginUserId },
        isFollowing: false,
      },
      { new: true }
    );
  
    await User.findByIdAndUpdate(
      loginUserId,
      {
        $pull: { following: unFollowId },
      },
      { new: true }
    );
    res.json("You have successfully unfollowed this user");
});


//block user
const blockUserCtrl = expressAsyncHandler(async (req,res) => {
    const {id} = req.params;
    validateMongodbID(id);
    const user = await User.findByIdAndUpdate(id, {
        isBlocked: true
    }, {
        new: true
    });
    res.json(user);
});

//unblock user
const unBlockUserCtrl = expressAsyncHandler(async (req,res) => {
    const {id} = req.params;
    validateMongodbID(id);
    const user = await User.findByIdAndUpdate(id, {
        isBlocked: false
    }, {
        new: true
    });
    res.json(user);
});

//generate verification token
const generateVerificationTokenCtrl = expressAsyncHandler(async (req,res) => {
    const loginUserId = req.user.id;
    const user = await User.findById(loginUserId);
    try {
        //generate token
        const verificationToken = await user.createAccountVerificationToken();
        //save user
        await user.save();
        //console.log(verificationToken);
        const resetURL = `If you were requested to verify your account, verify now within 10 minutes,
            otherwise ignore this message! <a href="http://localhost:3000/verify-account/
            ${verificationToken}">Click to verify your account</a>`;
        const msg = {
            to: user?.email,
            from: "boda2@illinois.edu",
            subject: "Account Verification",
            html: resetURL,
        };
        await sgMail.send(msg);
        res.json(resetURL);
    } catch (error) {
        res.json(error);
    }
});


// account verification
const accountVerificationCtrl = expressAsyncHandler(async (req, res) => {
    const { token } = req.body;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  
    //find this user by token
    const userFound = await User.findOne({
      accountVerificationToken: hashedToken,
      accountVerificationTokenExpires: { $gt: new Date() },
    });
    if (!userFound) throw new Error("Token expired, try again later");
    //update the proprt to true
    userFound.isAccountVerified = true;
    userFound.accountVerificationToken = undefined;
    userFound.accountVerificationTokenExpires = undefined;
    await userFound.save();
    res.json(userFound);
});


//forget token generator
const forgetPasswordToken = expressAsyncHandler(async (req,res) => {
    //find the user by email
    const {email} = req.body;
    const user = await User.findOne({email});
    if (!user) throw new Error("User not found!");
    try {
        const token = await user.createPasswordResetToken();
        console.log(token);
        await user.save();

        const resetURL = `If you were requested to reset your password, reset now within 10 minutes,
        otherwise ignore this message! <a href="http://localhost:3000/reset-password/
        ${token}">Click to reset your password</a>`;
        const msg = {
            to: email,
            from: "boda2@illinois.edu",
            subject: "Reset Password",
            html: resetURL,
        };
        const emailMsg = await sgMail.send(msg);
        res.json({
            msg: `A verification message is successfully sent to ${user?.email}
                ,reset now within 10 minutes!, ${resetURL}`
        });
    } catch (error) {
        res.json(error);
    }
});


//password reset
const passwordResetCtrl = expressAsyncHandler(async (req,res) => {
    const {token,password} = req.body;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: {$gt: Date.now()}
    });
    if (!user) throw new Error("Token expired, try again later!");

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.json(user);
});


//profile photo upload
const profilePhotoUploadCtrl = expressAsyncHandler(async (req,res) => {
    //find login user
    const {_id} = req.user;
    //1. get the path to the image
    const localPath = `public/images/profile/${req.file.filename}`;
    const imgUploaded = await cloudinaryUploadImg(localPath);

    const foundUser = await User.findByIdAndUpdate(_id, {
        profilePhoto: imgUploaded?.url,
    }, {new: true});
    //remove saved image
    fs.unlinkSync(localPath);
    res.json(foundUser);
});


module.exports = {
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
    profilePhotoUploadCtrl
};