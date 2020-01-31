const express=require('express');
const _=require('lodash');
const {ObjectId}=require('mongodb');
const { Ticket }=require('../models/ticket');
const { authenticateUser }=require('../middlewares/authenicateusers');
const router=express.Router();

// router.use('/:id',(req,res,next) =>{
//     let id=req.params.id;
//     if(!ObjectId.isValid(id)){
//         res.send({
//             notice:'Invalid id'
//         })
//     }
//     next();
// });

router.get('/',authenticateUser,(req,res) =>{
    Ticket.find()
    .then((tickets)=>{
        res.send(tickets)
    })
    .catch((err) =>{
        res.send(err)
    })
});

router.get('/status/open',authenticateUser,(req,res) =>{
    Ticket.openTickets().then((tickets) =>{
        res.send(tickets);
    })
});

router.get('/status/closed',authenticateUser,(req,res) =>{
    Ticket.closedTickets().then((tickets) =>{
        res.send(tickets);
    })
});

router.get('/priority/:value',authenticateUser,(req,res) =>{
    let value=req.params.value;
    Ticket.findByPriority(value).then((tickets) =>{
        res.send(tickets);
    })
})

router.get('/:id',authenticateUser,(req,res)=>{
    let id=req.params.id;
    Ticket.findById(id).populate('employee').then((ticket)=>{
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

router.post('/',authenticateUser,(req,res) => {
    let body=_.pick(req.body,['name','department','priority','message','status','employee']);
    let ticket=new Ticket(body);
    ticket.user=req.locals.user._id;
    ticket.save().then((ticket) =>{
        if(ticket){
            res.send(ticket);
        }else{
            res.send({
                notice:'Ticket not found'
            })
        }
    })
    .catch((err) => {
        res.send(err)
    })
});

router.put('/:id',authenticateUser,(req,res) =>{
    let id=req.params.id;
    let body=_.pick(req.body,['name','department','priority','status','message','employee']);
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

router.delete('/:id',authenticateUser,(req,res)=>{
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

module.exports={
    ticketsRouter:router
};