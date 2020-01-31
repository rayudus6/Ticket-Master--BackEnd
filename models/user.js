const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const _=require('lodash');
const validator=require('validator');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');

const UserSchema=new Schema({
    name:{
        type:String,
        trim:true,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate:{
            validator:function(value){
                return validator.isEmail(value);
            },
            message:'Invalid email'
        }
    },
    mobile:{
        type:String,
        required:true,
        validate:{
            validator:function(value){
                return validator.isNumeric(value) && validator.isLength(value,{min:10,max:10});
            },
            message:'inavalid number'
        }
    },
    password:{
        type:String,
        required:true,
        minlength:8,
        maxlength:128
    },
    tokens:[
        {
            access:{
                type:String,
                require:true
            },
            token:{
                type:String,
                require:true
            }
        }
    ]
});

//hashing the password
UserSchema.pre('save',function(next){
    let user=this;
    if(user.isModified('password')){
        bcrypt.genSalt(10).then((salt) =>{
            bcrypt.hash(user.password,salt).then((hashCode) =>{
                user.password=hashCode;
                next();
            });
        })
    }else{
        next();
    }
})

UserSchema.statics.findByToken=function(token){
    let User=this;
    let tokenData;
    try{
        tokenData=jwt.verify(token,'supersecret');
    }catch(e){
        // return new Promise((reject,resolve) =>{
        //     reject(e);
        // })
        return Promise.reject(e);
    }
    return User.findOne({
        _id:tokenData._id,
        'tokens.token':token
    })
}

UserSchema.statics.findByEmailAndPassword=function(email,password){
    let User=this;
    return User.findOne({email:email}).then((user) =>{
        if(!user){
            return Promise.reject('invalid email');
        }
        return bcrypt.compare(password,user.password).then((res) =>{
            if(res){
                return user;
            }else{
                return Promise.reject('Invalid password');
            }
        })
    })
}

UserSchema.methods.deleteToken=function(userToken){
    let user=this;
    let findToken=user.tokens.find((token) =>{
        return token.token=userToken;
    })
    user.tokens.remove(findToken._id);
    return this.save();
}

UserSchema.methods.toJSON = function(){
    return _.pick(this,['_id','name','email','mobile']);
}

UserSchema.methods.generateToken=function(){
     let tokenData={
         _id:this._id
     }
     let generateTokenInfo={
         access:'auth',
         token:jwt.sign(tokenData,'supersecret')
     }
     this.tokens.push(generateTokenInfo);
     return this.save().then(() =>{
         return generateTokenInfo.token;
     })
}

const User=mongoose.model('User',UserSchema);

module.exports={
    User
}