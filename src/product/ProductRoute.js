const express=require("express")
const ProductModel=require("./ProductModel")
const app=express.Router()
const jwt=require("jsonwebtoken")

app.post("/create",async(req,res)=>{

    const token=req.headers["authorization"]
    console.log(token,req.body)
    if(token){
        const decoded=jwt.decode(token)
        const {title,description,image,price,category}=req.body
        //console.log(name,slug,image,owner);
        const prod=await ProductModel.findOne({title});
        if(prod){
            return res.status(201).send("product already registered")
        }
        else{
           
            try{
                const product=new ProductModel({title,description,image,price,owner:decoded.id,category})
                await product.save()
                return res.status(201).send("product created")
            
            }
            catch(e){
                console.log(e.message)
                return res.send(e.message)
            }
        }
    }
    else{
        res.send("login first")
    }
   
    
    })


app.put("/:id",async(req,res)=>{
        let token=req.headers["authorization"]
        if(token){
            const decoded=jwt.decode(token)
            console.log(decoded)
            const product=await ProductModel.findById(req.params.id);
            if(product.owner==decoded.id){
               const updateProduct=await ProductModel.findByIdAndUpdate(req.params.id,
                {
                    $set:req.body,
                },{new:true})
                res.status(200).send(updateProduct)
            }
        
            else{
                res.send("you can only update your Product")
            }
        
        }
        })



app.get("/:id",async(req,res)=>{
        
            try{
                const category=await ProductModel.findById(req.params.id)
                res.status(200).send(category)
            }
            catch(e){
                res.send(e)
            }
           
        })

        app.get("/",async(req,res)=>{
            const nam=req.query.title;
            // console.log("hii",req.query,nam)
            try{
                // console.log("first")
                 let category;
                 if(nam){
                    category=await ProductModel.find({title:nam})
                     console.log(category)
                 }
                 else{
                    category=await ProductModel.find()
                    // console.log(category)
                 }
                 res.status(200).send(category)
            }catch(e){
                 res.send(e)
            }
        })

        
app.delete("/:id",async(req,res)=>{
    
        const category=await ProductModel.findById(req.params.id)
       
           await ProductModel.deleteOne(category);
           res.status(200).send("post has been deleted")

       
 
    })

        module.exports=app