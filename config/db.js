const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoURI");

const connectDb = async ()=> {
    try{
        await mongoose.connect(db);
        console.log('Mongoose Database connected');
    }catch(err){
        console.log(err.message, 'error connecting to database')
        process.exit(1);
                }

       }
module.exports = connectDb;