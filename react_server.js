const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const { urlencoded } = require('body-parser');
const PORT = process.env.port || 8000;
const cors = require('cors');

const conn = mysql.createPool({
    host: "localhost",
    user: "yours",
    password: "yours",
    database: "testdb"
});


app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/api/get", (req, res)=>{
    const sql = "SELECT * FROM item";
    conn.query(sql, (err, result)=>{
        res.send(result);
    })
})

app.post("/api/insert", (req, res) =>{
    const title = req.body.title; 
    const content = req.body.content; 
    const sql = "INSERT INTO item (title, content) VALUES (?,?)";
    conn.query(sql, [title, content], (err, result) => {
        res.send('success!'); 
    });
});

app.listen(PORT, ()=>{
    console.log(`running on port ${PORT}`);
});
