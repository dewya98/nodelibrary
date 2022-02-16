const { response } = require("express");
const express=require("express");
const app=express();
const port=8080;
app.listen(port,()=>{console.log("웹서버 실행")});
app.get("/",(request,response)=>{response.sendFile(__dirname+"/index.html")});