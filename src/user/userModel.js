const {Schema,model}=require("mongoose")

const UserSchema=new Schema({
    userName:{
        type:String,
         required:true,
    },
    fullName:{
        type:String,
         required:true,
    },
email:{
    type:String,
    required:true
},
password:{
    type:String,
    required:true
},
avatar:{
    type:String,
    default:""
}
},{timestamps:true});

const UserModel=model("user",UserSchema)
module.exports=UserModel