var mySQL=require("mySQL");
var conn=mySQL.createConnection({
    host:"localhost",
    user:"root",
    password:"autoset",
    database:"testdb"
});
conn.connect();
conn.query("select * from ")