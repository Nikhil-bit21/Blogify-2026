const {Router} = require('express');
const {blog} = require('../models/blog');
const router = Router();
const multer = require('multer');
const path = require('path');
const Comment = require('../models/comment');

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.resolve(`./public/uploads/`))
    },
    filename:function(req,file,cb){
        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null,fileName);
    }
})

const upload = multer({storage:storage});

router.get('/add-new',(req,res)=>{
    return res.render('addBlog',{
        user : req.user
    })
})

router.post('/', upload.single('coverImage') ,async(req,res)=>{
    const {body , title} = req.body;
    const Blog = await blog.create({
        body:body,
        title : title,
        createdBy:req.user._id,
        coverImageUrl:`/uploads/${req.file.filename}`,
    })
    return res.redirect(`/blog/${Blog._id}`);
})

router.get('/:id',async(req,res)=>{
    const Blog = await blog.findById(req.params.id).populate('createdBy');
    const comment = await Comment.find({blogId:req.params.id}).populate('createdBy');
    // console.log(comment);
    // console.log(Blog);
    return res.render('blog',{
        user: req.user,
        blog : Blog,
        comment : comment
    })
})

router.post('/comment/:blogId',async(req,res)=>{
    const {content} = req.body;
    const comment = await Comment.create({
        content:content,
        blogId : req.params.blogId,
        createdBy:req.user._id
    })
    return res.redirect(`/blog/${req.params.blogId}`)
})

module.exports = router;