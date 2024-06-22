const express=require('express');
const app=express();
require('dotenv').config();
const dp=require('./db');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
const userRouter=require('./routes/userRoutes');
const candiadateRouter=require('./routes/candidateRoutes');

app.get('/', (req, res) => {
    res.send('ho gaya start');
})


app.use('/user',userRouter);
app.use('/candidates',candiadateRouter);
const port = process.env.PORT_NO || 3000;
app.listen(port, () => {
    console.log("Sun raha h 3000 portwa par");
})
