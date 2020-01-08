const express=require('express');
const bodyParser=require('body-parser');
const _=require('lodash');
const {ObjectId}=require('mongodb');

const morgan=require('morgan');
const app=express();

const mongoose=require('./config/db');
const {Ticket}=require('./models/ticket');

const { Employee }=require('./models/employee');

const port=3000;

//middlewares
app.use(bodyParser.json());
app.use(morgan('short'));

app.use('/tickets/:id',(req,res,next) =>{
    let id=req.params.id;
    if(!ObjectId.isValid(id)){
        res.send({
            notice:'Invalid id'
        })
    }
    next();
});

// app.param('id',(req,res,next) =>{
//     let id=req.params.id;
//     if(!ObjectId.isValid(id)){
//         res.send({
//             notice:'Invalid id'
//         })
//     }
//     next();
// })


//Router handlers

//app.METHOD(Path,Handler);
app.get('/',(req,res)=>{
    res.send({
        msg:'Welcome to ticket master'
    });
});

app.get('/tickets',(req,res) =>{
    Ticket.find()
    .then((tickets)=>{
        res.send(tickets)
    })
    .catch((err) =>{
        res.send(err)
    })
});

app.get('/tickets/:id',(req,res)=>{
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

app.post('/tickets',(req,res) =>{
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

app.put('/tickets/:id',(req,res) =>{
    let id=req.params.id;
    let body=_.pick(req.body,['name','department','priority','status']);
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

app.delete('/tickets/:id',(req,res)=>{
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

app.get('/employees',(req,res) =>{
    Employee.find().then((employees) =>{
        res.send(employees);
    })
});

app.post('/employees',(req,res) =>{
    let body=_.pick(req.body,['name','email','department','salary','ageWhileJoining','address','hobbies','luckyNumber','mobileNumbers'])
    let employee=new Employee(body);
    employee.save().then((employee) =>{
        res.send(employee);
    })
})

app.get('/employees/:id/mobile_numbers',(req,res) =>{
    let id=req.params.id;
    Employee.findById(id).select(['name','_id','mobileNumbers'])
    .then((employee) =>{
        res.send(employee);
    })
    .catch((err) =>{
        res.send(err)
    })
})

app.post('/employees/:id/mobile_numbers',(req,res) =>{
    let id=req.params.id;
    let body=req.body;
    Employee.findById(id).then((employee)=>{
        if(employee){
            employee.mobileNumbers.push(body);
            employee.save().then((employee)=>{
                res.send(employee.mobileNumbers);
            })
        }else{
            res.send('Invalid id');
        }
    })

});

app.delete('/employees/:id/mobile_numbers/:mobile_id',(req,res) =>{
    let id=req.params.id;
    let mobile_id=req.params.mobile_id;
    Employee.findById(id).then((employee)=>{
        if(employee){
            employee.mobileNumbers.remove(mobile_id);
            return employee.save();
        }
        res.send({
            notice:'Invalid id'
        })
    }).then((employee)=>{
        res.send({
            Notice:'Successfully contact removed'
        })
    })
});

app.put('/employees/:id/mobile_numbers/:mobile_id',(req,res) =>
{
    let id=req.params.id;
    let mobileId=req.params.mobile_id;
    let body=_.pick(req.body,['numType','mobileNumber']);
    Employee.findById(id).then((employee) =>{
        if(employee){
            let mobileDetail=employee.mobileNumbers.id(mobileId);
            console.log(mobileDetail)
            mobileDetail.numType=body.numType ? body.numType : mobileDetail.numType;
            mobileDetail.mobileNumber=body.mobileNumber ? body.mobileNumber : mobileDetail.mobileNumber;
            return employee.save();
        }
        res.send({
            notice:'Invalid id'
        })
    }).then((employee) =>{
        res.send({
            mobileNumber: employee.mobileNumbers.id(mobileId),
            notice:'Successfully Updated the number'
        })
    })
})
app.listen(port,() =>{
    console.log('Listening port is',port);
});