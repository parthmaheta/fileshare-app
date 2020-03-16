const express=require('express')
const app=express()
const route=require('./server/router')
app.use(route)


const port=process.env.PORT || 5000
app.listen(port)