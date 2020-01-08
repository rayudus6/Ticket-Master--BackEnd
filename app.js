const express=require('express');
const bodyParser=require('body-parser');
const _=require('lodash');
const {ObjectId}=require('mongodb');

const morgan=require('morgan');
const app=express();

const mongoose=require('./config/db');
const {Ticket}=require('./models/ticket');

const { Employee }=require('./models/employee');

const employeeRouter=require('./routers/employees');

const port=3000;

//middlewares
app.use(bodyParser.json());
app.use(morgan('short'));

app.use('/tickets/:id',(req,res,next) =>{
    let id=req.params.id;
    if(!ObjectId.isValid(id)){
        res.send({
            notice:'Invalid id'
        })
    }
    next();
});

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

//app.METHOD(Path,Handler);
app.get('/',(req,res)=>{
    res.send({
        msg:'Welcome to ticket master'
    });
});

app.get('/tickets',(req,res) =>{
    Ticket.find()
    .then((tickets)=>{
        res.send(tickets)
    })
    .catch((err) =>{
        res.send(err)
    })
});

app.get('/tickets/:id',(req,res)=>{
    let id=req.params.id;
    Ticket.findById(id)
    .then((ticket)=>{
        if(ticket){
            res.send(ticket);
        }else{
            res.send({
                notice:'Ticket not found'
            })
        }
    })
    .catch((err) =>{
        res.send(err);
    })
});

app.post('/tickets',(req,res) =>{
    let body=_.pick(req.body,['name','department','priority','message','status']);
    let ticket=new Ticket(body);
    ticket.save().then((ticket) =>{
        if(ticket){
            res.send(ticket);
        }else{
            res.send({
                notice:'Ticket not found'
            })
        }
    })
    .catch((err) =>{
        res.send(err)
    })
});

app.put('/tickets/:id',(req,res) =>{
    let id=req.params.id;
    let body=_.pick(req.body,['name','department','priority','status']);
    Ticket.findByIdAndUpdate(id,{ $set:body},{new:true})
    .then((ticket) =>{
        if(ticket){
            res.send(ticket);
        }else{
            res.send({
                notice:'Ticket not found'
            })
        }
    })
    .catch((err) =>{
        res.send(err)
    })
});

app.delete('/tickets/:id',(req,res)=>{
    let id=req.params.id;
    Ticket.findByIdAndRemove(id)
    .then((ticket) =>{
        if(ticket){
            res.send({
                ticket,
                notice:'Successfully deleted'
            });
        }else{
            res.send({
                notice:'Ticket not found'
            })
        }
    })
    .catch((err) =>{
        res.send(err)
    })
});

app.use('/employees',employeeRouter);

app.listen(port,() =>{
    console.log('Listening port is',port);
});