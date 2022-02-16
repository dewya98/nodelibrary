var ejs=require("ejs");
var mysql=require("mysql");
var express=require("express");
var bodyParser=require("body-parser");
var cookie=require("cookie-parser");
const { clearCookie } = require("express/lib/response");
const { DATE } = require("mysql/lib/protocol/constants/types");

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
app.listen(8080,()=>{
    console.log("hello8080");
});

app.set("view engine","ejs");
app.set("views","./views1");

var pageCount;
var groupCount;
var currGroup;
var startPage;
var endPage;
conn.query("select count(*) as cnt from notice",(err,rs)=>{
    pageCount=Math.ceil(rs[0].cnt/10);
    groupCount=Math.ceil(pageCount/5);
});

app.get("/",(req,res)=>{
    if(req.cookies.loginId){
        cid=req.cookies.loginId;
    }else{
        cid="";
    };

    currGroup=1;
    startPage=1;
    endPage=5;
   var sql="select * from notice order by no desc limit 10";
   conn.query(sql,(err,rs)=>{
       res.render("notice",{
           data:rs,
           pagecount:pageCount,
           startpage:startPage,
           endpage:endPage,
           currgroup:currGroup,
           groupcount:groupCount,
           id:cid
        });
   });
});

app.get("/notice/:no",(req,res)=>{
    var pageNo=req.params.no;
    var startRow=(pageNo-1)*10;
    var sql="select * from notice order by no desc limit "+startRow+",10";
    currGroup=Math.ceil(pageNo/5);
    startPage=(currGroup-1)*5+1;
    endPage=startPage+4;
    conn.query(sql,(err,rs)=>{
        res.render("notice",{
            data:rs,
            pagecount:pageCount,
            startpage:startPage,
            endpage:endPage,
            groupcount:groupCount,
            currgroup:currGroup
        });
    });
});

app.get("/insert",(req,res)=>{
    res.render("insert");
});

app.post("/insert",(req,res)=>{
    var body=req.body;
    var title=body.title;
    var content=body.content;
    var writer=req.cookies.loginId;
//     var writeday;
//     function day(){
//     var d= new Date();
//     return d.getFullYear() + "-" + ((d.getMonth() + 1) > 9 ? (d.getMonth() + 1).toString() : "0" + (d.getMonth() + 1)) + "-" + (d.getDate() > 9 ? d.getDate().toString() : "0" + d.getDate().toString());
// }
    var sql="insert into notice(title,content,writer,writeday) values('";
    sql=sql+title+"','"+content+"','"+writer+"','"+writeday+"')";
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

app.get("/edit/:no",(req,res)=>{
    var sql="select * from notice where no="+req.params.no;
    conn.query(sql,(err,rs)=>{
        res.render("edit",{data:rs[0]});
    });
})
app.post("/edit/:no",(req,res)=>{
    var body=req.body;
    var sql="update notice set content='";
    sql=sql+body.content+"',title='";
    sql=sql+body.title+"' where no=";
    sql=sql+req.params.no;
    conn.query(sql);
    res.redirect("/");
});
app.get("/del/:no",(req,res)=>{
    var sql="delete from notice where no="+req.params.no;
    conn.query(sql);
    res.redirect("/");
});
