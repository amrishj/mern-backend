const mongoose = require('mongoose');
const { Schema } = mongoose;

const registerSchema = new Schema({
  name: String, // String is shorthand for {type: String}
  email: {type:String,required:true,unique:true},
  mobile:Number,
  password: String,
  conpassword: String,
  address:{type:String},
  date: { type: Date, default: Date.now }  
});

const Register = mongoose.model('registers', registerSchema);
module.exports=Register;