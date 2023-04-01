const express=require("express")
const CategoryModel=require("./categoryModel")
const app=express.Router()
const jwt=require("jsonwebtoken")
const cloudinary=require("cloudinary").v2;

cloudinary.config({
    cloud_name: "dlbmt7ylp",
    api_key: "947921918638785",
    api_secret: "rwjmMRKeyfvBV-45VvukpKxeFDo"
  });

app.post("/create",async(req,res)=>{

    const token=req.headers["authorization"]
    console.log(token,req.body)
    if(token){
        const decoded=jwt.decode(token)
        const {name,slug,image}=req.body
        //console.log(name,slug,image,owner);
        const category=await CategoryModel.findOne({name});
        if(category){
            return res.status(201).send("category already registered")
        }
        else{
            const file=req.files.image
            cloudinary.uploader.upload(file.tempFilePath,async(err,result)=>{
                try{
                    const categor=new CategoryModel({name,slug,image:result.url,owner:decoded.id})
                    await categor.save()
                    return res.status(201).send("categor created")
                
                }
                catch(e){
                    console.log(e.message)
                    return res.send(e.message)
                }
            })
           
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
            const category=await CategoryModel.findById(req.params.id);
            if(category.owner==decoded.id){
               const updateCategory=await CategoryModel.findByIdAndUpdate(req.params.id,
                {
                    $set:req.body,
                },{new:true})
                res.status(200).send(updateCategory)
            }
        
            else{
                res.send("you can only update your category")
            }
        
        }
        })



app.get("/:id",async(req,res)=>{
        
            try{
                const category=await CategoryModel.findById(req.params.id)
                res.status(200).send(category)
            }
            catch(e){
                res.send(e)
            }
           
        })

        app.get("/",async(req,res)=>{
            const nam=req.query.name;
            // console.log("hii",req.query,nam)
            try{
                // console.log("first")
                 let category;
                 if(nam){
                    category=await CategoryModel.find({name:nam})
                     console.log(category)
                 }
                 else{
                    category=await CategoryModel.find()
                    // console.log(category)
                 }
                 res.status(200).send(category)
            }catch(e){
                 res.send(e)
            }
        })

        
app.delete("/:id",async(req,res)=>{
    
        const category=await CategoryModel.findById(req.params.id)
       
           await CategoryModel.deleteOne(category);
           res.status(200).send("post has been deleted")

       
 
    })

        module.exports=app