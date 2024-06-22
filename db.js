const mongoose= require('mongoose');
require('dotenv').config();


const Mongo_local=process.env.MONGO_URL_LOCAL
// const mongoURL=process.env.MONGO_URL;

mongoose.connect(Mongo_local,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db=mongoose.connection;

db.on('connected',()=>{
    console.log("DB Connected");
})
db.on('error',(err)=>{
    console.log("DB error aa gaya",err);
})
db.on('disconnected',()=>{
    console.log("DB disconnected");
})

module.exports=db;