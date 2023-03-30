const {Schema,model}=require("mongoose")

const ProductSchema=new Schema({
    title:{
        type:String,
         required:true,
    },
    description:{
        type:String,
         required:true,
    },
price:{
    type:Number,
    required:true
},
image:{
    type:String,
    required:true
},
owner:{
    type:String
},
category:{
    type:String,
    required:true
}
},{timestamps:true});

const ProductModel=model("product",ProductSchema)
module.exports=ProductModel