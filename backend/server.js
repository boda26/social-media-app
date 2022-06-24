const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const dbConnect = require("./config/db/dbConnect");
const userRoutes = require("./route/users/usersRoute");
const { errorHandler, notFound } = require("./middleware/error/errorHandler");
const postRoute = require("./route/posts/postRoute");
const app = express();
const commentRoute = require("./route/comments/commentRoute");
const emailMsgRoute = require("./route/emailMsg/emailMsgRoute");
const categoryRoute = require("./route/category/categoryRoute");
const cors = require('cors');

//DB
dbConnect();

//middleware
app.use(express.json());

app.use(cors());

//users route
app.use('/api/users', userRoutes);
//post route
app.use('/api/posts', postRoute);

app.use('/api/comments', commentRoute);

app.use('/api/email', emailMsgRoute);

app.use('/api/category', categoryRoute);

//error handler
app.use(notFound);
app.use(errorHandler);

//server
const PORT = process.env.PORT || 8000;
app.listen(PORT, console.log(`Server is running ${PORT}`));
