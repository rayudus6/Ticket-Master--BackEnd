const mongoose=require('../config/db');
const { Ticket }=require('../models/ticket');

// Ticket.find().then((tickets)=>{
//     console.log(tickets);
// })
// .catch((err) =>{
//     console.log(err)
// })

// Ticket.find({priority:'High'}).then((ticket) =>{
//     console.log(ticket);
// })

// Ticket.findOne({priority:'High'}).then((ticket) =>{
//     console.log(ticket);
// })

Ticket.find({priority:'High'}).limit(2).then((ticket) =>{
    console.log(ticket);
})