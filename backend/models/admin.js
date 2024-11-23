
const mongoose=require('mongoose');

const adminSchema=new mongoose.Schema({
    adminUsername:{type:String,required:true},
    adminPassword:{type:String,required:true},
})


module.exports=mongoose.model("admin",adminSchema);