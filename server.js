const express = require("express");
const connectDb = require('./config/db');

const app = express();

connectDb();

const PORT = process.env.PORT || 5000;

app.get("/" , (req,res)=> res.send('API working !!!'))


app.listen(PORT, ()=> console.log(`server is port ${PORT}`))