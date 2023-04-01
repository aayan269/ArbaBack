const express=require("express")
const UserModel=require("./userModel")
const app=express.Router()
const jwt=require("jsonwebtoken")
const argon2=require("argon2")
const cloudinary=require("cloudinary").v2;

cloudinary.config({
    cloud_name: "dlbmt7ylp",
    api_key: "947921918638785",
    api_secret: "rwjmMRKeyfvBV-45VvukpKxeFDo"
  });
  

app.post("/signup",async(req,res)=>{
const {userName,fullName,email,password}=req.body
//console.log(userName,email,password);
const user=await UserModel.findOne({email});
if(user){
    return res.status(201).send("user already registered")
}
else{
    const file=req.files.avatar
    cloudinary.uploader.upload(file.tempFilePath,async(err,result)=>{
        console.log(res,userName,fullName,email,password,avatar=result.url)
        const hash=await argon2.hash(password)
    try{
        const user=new UserModel({userName,fullName,email,password:hash,avatar:result.url})
        await user.save()
        return res.status(201).send("user created")
    
    }
    catch(e){
        console.log(e.message)
        return res.send(e.message)
    }
    })
    
}

})


app.post("/login",async(req,res)=>{
    const {email,password}=req.body;
    const user=await UserModel.findOne({email});
    
  console.log(user,password)
  if(user){
    if(user.password==password || await argon2.verify(user.password,password)){
        const token=jwt.sign({id:user._id,userName:user.userName,fullName:user.fullName,email:user.email,avatr:user.avatar},"SECRET",{expiresIn:"24 hours"})
        const refreshToken=jwt.sign({id:user._id,userName:user.userName,fullName:user.fullName,email:user.email,avatr:user.avatar},"REFRESH",{expiresIn:"7 days"})
        const {password,...others}=user._doc
        return res.status(201).send({message:"login sucess",token,refreshToken,others})
    }
    else{
        return res.status(401).send("wrong Password")
    }
  }
  else{
    return res.status(401).send("wrong credentials")
}

    
})

//update 
app.put("/:id",async(req,res)=>{
    let token=req.headers["authorization"]
    
    if(token){
        const decoded=jwt.decode(token)

        if(decoded.id==req.params.id){
           
//console.log(req.params.id,req.body.creds)
            try{
                const updateUser=await UserModel.findByIdAndUpdate(req.params.id,
                    {
                        $set:req.body,
                    },{new:true})
                    const {password,...others}=updateUser._doc
                res.status(200).send(others)
            }catch(e){
                res.status(401).send("you can update only your account")
            }
        }
    }
})











//Get
app.get("/:id",async(req,res)=>{
const token=req.headers["authorization"]
if(token){
    const decoded=jwt.decode(token)
    if(decoded.id==req.params.id){

        try{
            const user=await UserModel.findById(req.params.id)
            const {password,...others}=user._doc
            return res.send(others)
        }
        catch(e){
            res.status(500).send(e.message)
        }

    }
}
   
});



module.exports=app;
