const express=require('express');

const _=require('lodash');

const {ObjectId}=require('mongodb');

const { Ticket }=require('../models/ticket');

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

router.get('/',(req,res) =>{
    Ticket.find()
    .then((tickets)=>{
        res.send(tickets)
    })
    .catch((err) =>{
        res.send(err)
    })
});

router.get('/status/open',(req,res) =>{
    Ticket.openTickets().then((tickets) =>{
        res.send(tickets);
    })
});

router.get('/status/closed',(req,res) =>{
    Ticket.closedTickets().then((tickets) =>{
        res.send(tickets);
    })
});

router.get('/priority/:value',(req,res) =>{
    let value=req.params.value;
    Ticket.findByPriority(value).then((tickets) =>{
        res.send(tickets);
    })
})

router.get('/:id',(req,res)=>{
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

router.post('/',(req,res) =>{
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

router.put('/:id',(req,res) =>{
    let id=req.params.id;
    let body=_.pick(req.body,['name','department','priority','status','message']);
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

router.delete('/:id',(req,res)=>{
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

module.exports=router;