const mongoose=require('../config/db');
const {Ticket}=require('../models/ticket');

//Instance method

// let ticket={
//     name:'rayudu',
//     department:'Technical',
//     priority:'High',
//     message:'Not working'
// }

// let newTicket=new Ticket(ticket);
// newTicket.save().then((ticket)=>{
//     console.log(ticket);
// })
// .catch((err) =>{
//     console.log(err);
// })

// class method/static method
Ticket.create({
    name:'rayudu',
    department:'Technical',
    priority:'High',
    message:'Not working'
}).then((ticket) =>{
    console.log(ticket)
})
.catch((err) =>{
    console.log(err)
})
