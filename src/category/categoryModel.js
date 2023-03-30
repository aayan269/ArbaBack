const {Schema,model}=require("mongoose")

const CategorySchema=new Schema({
    name:{
        type:String,
         required:true,
         unique:true
    },
    slug:{
        type:String,
         required:true,
    },
image:{
    type:String,
    required:true
},
owner:{
    type:String,
    required:true
}
},{timestamps:true});

const CategoryModel=model("category",CategorySchema)
module.exports=CategoryModel