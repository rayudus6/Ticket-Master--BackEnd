const bcrypt=require('bcryptjs');

const hashedcodeFromDB='$2a$10$mnbZY2IuhG7oXkd5RB3Yh.EVuC05gf.577e5kAul0OtRyy.HxxBTS';

const password='secret123';

bcrypt.compare(password,hashedcodeFromDB).then((res) =>{
    console.log(res); //true
});

bcrypt.compare('abcd',hashedcodeFromDB).then((res) =>{
    console.log(res); //false
})