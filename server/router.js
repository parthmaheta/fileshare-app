const express=require("express")
const fs=require('fs')
const session=require('express-session')
const multer=require('multer')
const Router=express.Router()
Router.use(express.urlencoded({extended:true}))
Router.use(express.json())

Router.use(session({secret:'fileshare',saveUninitialized:false,resave:true}))

let Storage=multer.diskStorage({

    destination:(req,file,callback)=>{
        if(!req.session.dir)
        {
        dir='./users/'+Date.now()
        req.session.dir=dir
        fs.mkdir(dir, () => callback(null,dir))
       } 
       else
         callback(null,req.session.dir)
              
    },
    filename:(req,file,callback)=>{
        callback(null,file.originalname)
    }
})

let Upload=multer({storage:Storage})


Router.post('/upload',Upload.array('myFiles',20),(req,res)=>{
    dir=req.session.dir   
    req.session.destroy()
    res.send('dir'+dir)
})

module.exports=Router

