const mongoose = require('mongoose');
const { Schema } = mongoose;

const adminSchema = new Schema({
  name: String, // String is shorthand for {type: String}
  email: {type:String,required:true,unique:true},
  mobile:Number,
  password: String,
  conpassword: String,
  address:{type:String},
  img:String,
  date: { type: Date, default: Date.now }  
});

const AdminRegister = mongoose.model('admins', adminSchema);
module.exports=AdminRegister;