const expressAsyncHandler = require("express-async-handler");
const Comment = require("../../model/comment/comment");
const Post = require("../../model/post/Post");
const blockUser = require("../../utils/blockUser");
const validateMongodbID = require("../../utils/validateMongodbID");

const createCommentCtrl = expressAsyncHandler(async(req,res) => {
    //1. get the user
    const user = req.user;
    //check if user blocked
    blockUser(user);
    //2. get the postid
    const {postId, description} = req.body;

    try {
        const comment = await Comment.create({
            post: postId,
            user,
            description
        });
        res.json(comment);
    } catch (error) {
        res.json(error);
    }
});

//fetch all posts
const fetchAllCommentsCtrl = expressAsyncHandler(async (req,res) => {
    try {
        const comments = await Comment.find({}).sort('-created');
        res.json(comments);
    } catch (error) {
        res.json(error);
    }
});

//comment detail
const fetchCommentCtrl = expressAsyncHandler(async (req,res) => {
    const {id} = req.params;
    try {
        const comment = await Comment.findById(id);
        res.json(comment);
    } catch (error) {
        res.json(error);
    }
});

//update
const updateCommentCtrl = expressAsyncHandler(async(req,res) => {
    const {id} = req.params;
    try {
        const update = await Comment.findByIdAndUpdate(id, {
            user: req?.user,
            description: req?.body?.description
        }, 
        {
            new: true,
            runValidators: true
        });
        res.json(update);
    } catch (error) {
        res.json(error);
    }
});

//delete
const deleteCommentCtrl = expressAsyncHandler(async (req,res) => {
    const {id} = req.params;
    validateMongodbID(id);
    try {
        const comment = await Comment.findByIdAndDelete(id);
        res.json(comment);
    } catch (error) {
        res.json(error);
    }
});

module.exports = {
    createCommentCtrl,
    fetchAllCommentsCtrl,
    fetchCommentCtrl,
    updateCommentCtrl,
    deleteCommentCtrl
}