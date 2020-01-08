const mongoose=require('mongoose');

const Schema=mongoose.Schema;

let employeeSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    department:{
        type:String,
        enum:['Technical','Hr','Sales'],
        required:true
    },
    salary:{
        type:String
    },
    email:{
        type:String
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
    ]

});

const Employee=mongoose.model('employee',employeeSchema);

module.exports={
    Employee
}