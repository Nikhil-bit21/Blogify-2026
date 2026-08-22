const express = require('express');
const path = require('path');
const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { checkForAuthenticationCookie } = require('./middlewares/authentication');
const {blog} = require('./models/blog');
const {User} = require('./models/user');
require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 3000;
const mongoURL = process.env.MONGO_URL;
mongoose.connect(mongoURL).then(e=>{
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
    var fullName;
    if(req.user){
        const user = await User.findById(req.user._id)
        fullName = user.fullName
    }
    //console.log(req.user);
    // console.log(fullName);
    res.render('home',{
        user: req.user,
        blogs : allBlogs,
        name : fullName
    });
})

app.listen(PORT,()=>{
    console.log(`Server Started at PORT: ${PORT}`);
})