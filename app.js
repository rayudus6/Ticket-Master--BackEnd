const express=require('express');
const bodyParser=require('body-parser');
const morgan=require('morgan');
const app=express();
const port=3000;

//middlewares
app.use(bodyParser.json());
app.use(morgan('short'));

//Router handlers

//app.METHOD(Path,Handler);
app.get('/',(req,res)=>{
    res.send({
        msg:'Welcome to ticket master'
    });
});


app.listen(port,() =>{
    console.log('Listening port is',port);
});