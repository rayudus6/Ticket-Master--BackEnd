const mongoose=require('mongoose');
const Schema=mongoose.Schema;

let employeeSchema=new Schema({
    name:{
        type:String,
        required:true,
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
        enum:['Technical','Hr','Sales'],
        required:true
    },
    salary:{
        type:String,
        validate:{
            validator:function(value){
                return value >=1000;
            },
            message:'Value should be greater than 10000'
        }
    },
    email:{
        type:String,
        required:true,
        validate:{
            validator:function(userInput){
                return /^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/.test(userInput);
            },
            message:function(props){
                return `${props.path} is not valid`;
            }
        }
    },
    ageWhileJoining:{
        type:Number,
        max:60,
        min:18
    },
    address:{
        street:{
            type:String
        },
        city:{
            type:String
        },
        pincode:{
            type:Number
        }

    },
    hobbies:[String],
    luckyNumber:[Number],
    mobileNumbers:[
        {
            numType:{
                type:String
            },
            mobileNumber:{
                type:Number
            }
        }
    ],
    tickets:[ {type:Schema.Types.ObjectId,ref:'Ticket'}]

});

//instance method
employeeSchema.methods.shortInfo= function() {
    return {
        _id:this._id,
        name:this.name,
        email:this.email,
        numberCount:this.mobileNumbers.length,
        tickets:this.tickets
    }
}

const Employee=mongoose.model('Employee',employeeSchema);

module.exports={
    Employee
}