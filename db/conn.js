const mongoose = require('mongoose');
const dbConnect=()=>{
    mongoose.connect('mongodb://127.0.0.1:27017/neerajbatch')
.then(()=>console.log("Connected to mongoDB"))
.catch(()=>console.log("Not connected to MongoDB"))
}
module.exports=dbConnect
