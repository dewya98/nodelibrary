var mySQL=require("mySQL");
var conn=mySQL.createConnection({
    host:"localhost",
    user:"yours",
    password:"yours",
    database:"testdb"
});
conn.connect();
conn.query("select * from ")
