const express = require('express');
const path = require('path');
const PORT = 3000;
const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { checkForAuthenticationCookie } = require('./middlewares/authentication');
const {blog} = require('./models/blog');

const app = express();

mongoose.connect('mongodb://localhost:27017/swamiBlogs').then(e=>{
    console.log(`MongoDb is Connected`);
})

app.set('view engine','ejs');
app.set('views',path.resolve('./views'));

app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve('./public')))

app.use('/user',userRoute);
app.use('/blog',blogRoute);

app.get('/',async(req,res)=>{
    const allBlogs = await blog.find({});
    res.render('home',{
        user: req.user,
        blogs : allBlogs
    });
})

app.listen(PORT,()=>{
    console.log(`Server Started at PORT: ${PORT}`);
})