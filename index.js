const express=require('express')
const app=express()
const route=require('./server/router')
app.use(route)
app.use(express.static(__dirname+'/res'))


app.listen(8080)