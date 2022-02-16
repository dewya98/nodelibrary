var fs=require("fs");
var ejs=require("ejs");
var mysql=require("mysql");
var express=require("express");
var bodyParser=require("body-parser");
var cookie=require("cookie-parser");
const { engine } = require("express/lib/application");

var conn=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"autoset",
    database:"testdb"
});

var app=express();
app.use(bodyParser.urlencoded({
    extended:false
}));
app.use(cookie());
app.listen(3000,function(){
    "";
});
app.set("view engine","ejs");
app.set("views","./views1");
app.get("/",function(req,res){
    if(req.cookies.loginId){
        cid=req.cookies.loginId;
    }else{
        cid="";
    }
    var sql="select * from student";
    conn.query(sql,function(err,rs){
        res.render("studentlist",{data:rs,id:cid});
    });
});

app.get("/add",(req,res)=>{
    res.render("add");
});
app.post("/add",(req,res)=>{
    var body=req.body;
    var id=body.id;
    var name=body.name;
    var kor=body.kor;
    var eng=body.eng;
    var math=body.math;
    var sql="insert into student(id,name,kor,eng,math) values('";
    sql=sql+id+"','";
    sql=sql+name+"','";
    sql=sql+kor+"','";
    sql=sql+eng+"','";
    sql=sql+math+"')";
    conn.query(sql);
    res.redirect("/");
});
app.get("/update/:no",(req,res)=>{
    var sql="select * from student where no="+req.params.no;
    conn.query(sql,(err,rs)=>{
        res.render("update",{data:rs[0]});
    });
});
app.post("/update/:no",(req,res)=>{
    var body=req.body;
    var sql="update student set kor='";
    sql=sql+body.kor+"',eng='";
    sql=sql+body.eng+"',math='";
    sql=sql+body.math+"' where no=";
    sql=sql+req.params.no;
    conn.query(sql);
    res.redirect("/");
});
app.get("/del/:no",(req,res)=>{
    var sql="delete from student where no="+req.params.no;
    conn.query(sql);
    res.redirect("/");
});
app.get("/login", (req,res)=>{
    res.render("login");
});
app.post("/login",(req,res)=>{
    var body=req.body;
    var id=body.id;
    var pw=body.pw;
    var sql="select * from teacher where id='"+id+"' and pw='"+pw+"'";
    conn.query(sql,(err,rs)=>{
        if(rs.length != 0){
            var expireDate=new Date(Date.now()+60*60*1000*24);
            res.cookie("loginId",id,{expires:expireDate,httpOnly:true});
            res.redirect("/");
        }else{
            res.send('<script>alert("로그인 실패");history.back();</script>');
        }
    });
});
app.get("/logout",(req,res)=>{
    res.clearCookie("loginId");
    res.redirect("/");
});
app.get("/join",(req,res)=>{
    res.render("join");
});
app.post("/join",(req,res)=>{
    var body=req.body;
    var id=body.id;
    var pw=body.pw;
    var sql="insert into teacher(id,pw)values('"+id+"','"+pw+"')";
    conn.query(sql);
    res.redirect("/");
})
app.get("/search/:keyword",(req,res)=>{
    var body=req.body;
    var keyword=req.params.keyword;
    var sql="select * from student where name like'%"+keyword+"%' or id like'%"+keyword+"%'";
    conn.query(sql,(err,rs)=>{
     if (err) {
            console.log(err);
          } else {
    res.render("search",{data:rs});
    }});
});
app.get("/studentlist",(req,res)=>{
    res.redirect("/");
});