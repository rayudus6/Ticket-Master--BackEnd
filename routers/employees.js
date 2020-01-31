const express=require('express');
const { Employee } =require('../models/employee');
const { Ticket }=require('../models/ticket');
const _=require('lodash');

const router=express.Router();

router.get('/',(req,res) =>{
    Employee.find().then((employees) =>{
        res.send(employees);
    })
});

router.get('/:id',(req,res) =>{
    Employee.findById(req.params.id).populate('tickets').then((employee) =>{
        res.send(employee.shortInfo());
    })
});

router.get('/show/short_info',(req,res) =>{
    Employee.find().then((employees) =>{
        let result=employees.map(emp =>emp.shortInfo())
        res.send(result);
    })
});

router.put('/:id',(req,res) =>{
    let id=req.params.id;
    let body=req.body;
    Employee.findByIdAndUpdate(id,{$set:body},{new:true,runValidators:true}).then((employee) =>{
        res.send(employee);
    })
    .catch((err) =>{
        res.send(err);
    })
});

router.post('/',(req,res) =>{
    let body=_.pick(req.body,['name','email','department','salary','ageWhileJoining','address','hobbies','luckyNumber','mobileNumbers',"tickets"])
    let employee=new Employee(body);
    employee.save().then((employee) =>{
        res.send(employee);
    })
})

router.get('/:id/mobile_numbers',(req,res) =>{
    let id=req.params.id;
    Employee.findById(id).select(['name','_id','mobileNumbers'])
    .then((employee) =>{
        res.send(employee);
    })
    .catch((err) =>{
        res.send(err)
    })
})

router.post('/:id/mobile_numbers',(req,res) =>{
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

router.delete('/:id/mobile_numbers/:mobile_id',(req,res) =>{
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

router.put('/:id/mobile_numbers/:mobile_id',(req,res) =>
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
});

router.get('/:id/tickets',(req,res) =>{
    let id=req.params.id;
    Ticket.find({employee: id}).then((tickets) =>{
        res.send(tickets);
    })
})

module.exports={
    employeeRouter:router
};