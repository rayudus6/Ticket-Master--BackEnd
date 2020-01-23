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

ticketSchema.statics.openTickets=function() {
    return this.find({ status:'open' });
}

ticketSchema.statics.closedTickets= function() {
    return this.find({ status:'closed' });
}

ticketSchema.statics.findByPriority=function(priority) {
    return this.find({ priority: priority})
}

const Ticket=mongoose.model('Tickets',ticketSchema);

module.exports={
    Ticket
}