const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const ticketSchema=new Schema({
    name:{
        type:String,
        require:true,
        validate:{
            validator:function(value){
                return /^[a-zA-Z ]*$/.test(value);
            },
            message:function(props){
                return `${props.path} must contain only alphabets`;
            }
        }
    },
    department:{
        type:String,
        require:true
    },
    code:{
        type:String
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
    },
    employee:{
        type:Schema.Types.ObjectId,
        ref:'Employee'
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:'User'
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

//generate code
ticketSchema.pre('save',function(next) {
    if(!this.code){
        this.code='Test-' +Math.ceil(Math.random()*1000);
    }
    next();
})

const Ticket=mongoose.model('Ticket',ticketSchema);

module.exports={
    Ticket
}