const express = require('express');
const path = require('path');
const PORT = 3000;
const userRoute = require('./routes/user');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb://localhost:27017/swamiBlogs').then(e=>{
    console.log(`MongoDb is Connected`);
})

app.set('view engine','ejs');
app.set('views',path.resolve('./views'));

app.use(express.urlencoded({extended:false}));

app.use('/user',userRoute);

app.get('/',(req,res)=>{
    res.render('home');
})

app.listen(PORT,()=>{
    console.log(`Server Started at PORT: ${PORT}`);
})