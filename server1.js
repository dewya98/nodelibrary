var fs=require("fs");
var ejs=require("ejs");
var mysql=require("mysql");
var express=require("express");
var bodyParser=require("body-parser");
var cookie=require("cookie-parser");
const { clearCookie } = require("express/lib/response");

var conn=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"autoset",
    database:"testdb"
});
var app=express();
app.use(bodyParser.urlencoded({
    extened:false
}));
app.use(cookie());
app.listen(8080,function(){
    console.log(
        "server started with 8080");
});
app.set("view engine","ejs");
app.set("views","./views1");
app.get("/",function(req,res){
    if(req.cookies.loginId){
        cid=req.cookies.loginId;
    }else{
        cid="";
    }
    var sql="select * from guest order by no desc";
    conn.query(sql,function(err,rs){
        res.render("list",{data:rs,id:cid});
});
});
app.get("/insert",function(req,res){
    res.render("insert");
});
app.post("/insert",function(req,res){
    var body=req.body;
    var content =body.content;
    var writer=req.cookies.loginId;
    var sql="insert into guest(content,writer) values('";sql=sql+content+"','";sql=sql+writer+"')";
    conn.query(sql);
    res.redirect("/");
})
app.get("/edit/:no",function(req,res){
    var sql="select * from guest where no="+req.params.no;conn.query(sql,function(err,rs){
        res.render("edit",{data:rs[0]});
    });
});
app.post("/edit/:no",function(req,res){
    var body=req.body;
    var sql="update guest set content='";
    sql=sql+body.content+"',writer='";
    sql=sql+body.writer+"' where no=";
    sql=sql+req.params.no;
    conn.query(sql);
    res.redirect("/");
});
app.get("/del/:no",function(req,res){
    var sql="delete from guest where no="+req.params.no;
    conn.query(sql);
    res.redirect("/");
});
app.get("/login",(req,res)=>{
    res.render("login");
});
app.post("/login",(req,res)=>{
    var body=req.body;
    var id=body.id;
    var pw=body.pw;
    var sql="select * from member where id='";
    sql=sql+id+"' and pw='"+pw+"'";
    conn.query(sql,(err,rs)=>{
        if(rs.length != 0){
            var expireDate=new Date(Date.now()+60*60*1000*24);
            res.cookie("loginId",id,{expires:expireDate,httpOnly:true});
            res.redirect("/");
        }else{
            res.send('<script>alert("로그인실패");history.back();</script>');
        }
    });
});
app.get("/logout",(req,res)=>{
    res.clearCookie("loginId");
    res.redirect("/");
});