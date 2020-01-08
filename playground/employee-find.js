const { Employee} =require('../models/employee');
const mongoose=require('../config/db');

Employee.findById('5e14d40551896a197b93c925').then((employee) =>{
    employee.mobileNumbers.remove('5e14d40551896a197b93c927');
    employee.save().then((employee)=>{
        console.log(employee);
    })
})