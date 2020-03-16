const express=require("express")
const fs=require('fs')
const session=require('express-session')
const multer=require('multer')
const mongodb=require('mongodb').MongoClient
const zip=require('adm-zip')

const uri = "mongodb+srv://user:user_123@parthcluster-sseeb.mongodb.net/test?retryWrites=true&w=majority";

const client=new mongodb(uri,{useNewUrlParser:true,useUnifiedTopology:true})
const con=client.connect()



const Router=express.Router()
Router.use(express.urlencoded({extended:true}))
Router.use(express.json())
Router.use(express.static('./res'))

Router.use(session({secret:'fileshare',saveUninitialized:false,resave:true}))

let Storage=multer.diskStorage({

    destination:(req,file,callback)=>{
        
        if(!req.session.dir)
        {
         let id=Date.now()
        let dir='./res/users/'+id
        req.session.dir=id.toString()
        fs.mkdir(dir, () => callback(null,dir))
       } 
       else
         callback(null,'./res/users/'+req.session.dir)
              
    },
    filename:(req,file,callback)=>{
        callback(null,file.originalname)
    }
})

let Upload=multer({storage:Storage})


Router.post('/upload',Upload.array('myFiles',20),(req,res)=>{
    

    if(req.session.dir)
    {  let id=getRandomString();
               
           con.then(()=>{
            const db=client.db('fileshare')

            

            db.collection('main').insertOne({'dir':req.session.dir,'id':id},(err,rs)=>{
            
                db.collection('main').find({}).sort({'_id':-1}).limit(1).toArray((err,rs)=>{                
                    res.send(rs[0].id)
                    delete req.session.dir
                })
            })
        })
           
    }
    else
    res.send('no file')
    
})

Router.get('/:id',(req,res)=>{
     if(req.params.id.length==5){
       
     con.then(()=>{
         const db=client.db('fileshare')
         db.collection('main').find({'id':req.params.id}).toArray((err,result)=>{
             if(err)
              {res.send('error')
                console.log('oops')
              return
              } 
             if(result.length)
              {
                  let myzip=new zip()
                  fs.readdir('./res/users/'+result[0].dir, (err, files) => {
                    files.forEach(file => {
                        myzip.addLocalFile('./res/users/'+result[0].dir+'/'+file)
                    });

                    const data=myzip.toBuffer()
                    res.set('Content-Disposition',`attachment; filename=fileshare.zip`).send(data)                    
                  });
                  
              }
             else
             res.redirect('404.html')
         })
        
     })

     }
     else
     res.redirect('404.html')
     
})
Router.get('*',(req,res)=>{
    res.redirect('404.html')
})
     


function getRandomString(){
    let chars='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
    return chars[Math.floor(Math.random()*61)]+chars[Math.floor(Math.random()*61)]+chars[Math.floor(Math.random()*61)]+chars[Math.floor(Math.random()*61)]+chars[Math.floor(Math.random()*61)]
}


module.exports=Router

