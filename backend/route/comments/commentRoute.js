const express = require('express');
const { 
    createCommentCtrl,
    fetchAllCommentsCtrl,
    fetchCommentCtrl,
    updateCommentCtrl,
    deleteCommentCtrl,
} = require('../../controllers/comments/commentCtrl');
const authMiddleware = require('../../middleware/auth/authMiddleware');
const commentRoute = express.Router();

commentRoute.post('/', authMiddleware, createCommentCtrl);
commentRoute.get('/', fetchAllCommentsCtrl);
commentRoute.get('/:id', authMiddleware, fetchCommentCtrl);
commentRoute.put('/:id', authMiddleware, updateCommentCtrl);
commentRoute.delete('/:id', authMiddleware, deleteCommentCtrl);

module.exports = commentRoute;