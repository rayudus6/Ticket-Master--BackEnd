const express=require('express');
const bodyParser=require('body-parser');
const _=require('lodash');
const {ObjectId}=require('mongodb');

const morgan=require('morgan');
const app=express();

const mongoose=require('./config/db');

const employeeRouter=require('./routers/employees');
const ticketsRouter=require('./routers/tickets');

const port=3000;

//middlewares
app.use(bodyParser.json());
app.use(morgan('short'));


// app.param('id',(req,res,next) =>{
//     let id=req.params.id;
//     if(!ObjectId.isValid(id)){
//         res.send({
//             notice:'Invalid id'
//         })
//     }
//     next();
// })


//Router handlers

app.use('/tickets',ticketsRouter);

app.use('/employees',employeeRouter);

//app.METHOD(Path,Handler);
app.get('/',(req,res)=>{
    res.send({
        msg:'Welcome to ticket master'
    });
});


app.listen(port,() =>{
    console.log('Listening port is',port);
});