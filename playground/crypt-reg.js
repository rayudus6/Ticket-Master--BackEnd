const bcrypt=require('bcryptjs');

const password='secret123';

bcrypt.genSalt(10).then((salt) =>{
    console.log('salt',salt);
    bcrypt.hash(password,salt).then((hashedpassword) =>{
        console.log('hashed code:',hashedpassword);
    })
}).catch((err) =>{
    console.log(err);
});