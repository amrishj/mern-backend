const mongoose = require('mongoose');
const { Schema } = mongoose;

const contactSchema = new Schema({
name: String, // String is shorthand for {type: String}
phone:Number,
email: {type:String,required:true,unique:true},
message:{type:String},
});

const Contact = mongoose.model('contacts', contactSchema);
module.exports=Contact;