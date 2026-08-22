const {Router} = require('express');
const {User} = require('../models/user');
const router = Router();

router.get('/signin',(req,res)=>{
    res.render('signin');
})

router.get('/signup',(req,res)=>{
    res.render('signup');
})

router.post('/signup',async(req,res)=>{
    const {fullName , email , password} = req.body;
    await User.create({
        fullName,
        email,
        password
    });
    const token = await User.matchPasswordAndGenerateToken(email,password);
    return res.cookie("token",token,{
            httpOnly:true,
            maxAge : 60*60*1000
        }).redirect('/');
})

router.post('/signin',async (req,res)=>{
    const {email,password} = req.body;
    try{  
        const token = await User.matchPasswordAndGenerateToken(email,password);

        //console.log("Token",token);
        return res.cookie("token",token,{
            httpOnly:true,
            maxAge : 60*60*1000
        }).redirect('/');
    }catch(err){
        return res.render("signin",{
            error : "Incorrect email or Password",
        })
    }
})

router.get('/logout',(req,res)=>{
    res.clearCookie('token').redirect('/');
})

module.exports = router;