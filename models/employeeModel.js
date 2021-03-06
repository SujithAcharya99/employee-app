const mongoose = require('mongoose');
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')

var employeeSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: 'This field is required.'
    },
    email: {
        type: String
    },
    mobile: {
        type: String
    },
    city: {
        type: String
    },
    jobRole:{
        type:String
    },
    salary:{
        type:String,
        default:0
    },
    password:{
        type:String,
        required:true
    },
    tasks:[{
        managerID:{
            type: mongoose.Schema.Types.ObjectId
        },
        taskGiven:{
            type:String
        },
        status:{
            type:String,
            default:'Not Updated'
        },
        remark:{
            type:String,
            default:'No Remarks'
        }
    }],
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
});

employeeSchema.methods.generateAuthToken= async function(){
    const employee=this
    const token=jwt.sign({_id: employee._id.toString()},'thisisanapp')

    employee.tokens = employee.tokens.concat({ token})
    await employee.save()
    return token

}



employeeSchema.path('email').validate((val) => {
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
}, 'Invalid e-mail.');

employeeSchema.path('mobile').validate((val)=>{
    var phoneno = /^\d{10}$/;
    if((val.match(phoneno)))
        return true;
    else
        return false;        
},'Invalid Phone Number Format.')




employeeSchema.pre('save',async function(next){
    const user=this

    if(user.isModified('password')){
        user.password=await bcrypt.hash(user.password,8)
    }
    next()
})
const Employee=mongoose.model('Employee', employeeSchema);
module.exports=Employee
