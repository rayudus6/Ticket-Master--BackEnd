const mongoose=require('mongoose');

const ticketSchema=mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    department:{
        type:String,
        require:true
    },
    priority:{
        type:String,
        require:true
    },
    message:{
        type:String,
        require:true
    },
    status:{
        type:String,
        default:'open'
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
});

const Ticket=mongoose.model('Tickets',ticketSchema);

module.exports={
    Ticket
}