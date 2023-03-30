require("dotenv").config()
const PORT=process.env.PORT
const express=require("express")
const connect=require("./config/db")
const userRoute=require("./src/user/userRouter")
const categoryRoute=require("./src/category/categoryRoute")
const productRoute=require("./src/product/ProductRoute")
const cors=require("cors")


const app=express()
app.use(express.urlencoded({extended:true}))
app.use(express.json()) 
app.use(cors())


app.use("/user",userRoute)
app.use("/category",categoryRoute)
app.use("/product",productRoute)

app.listen(PORT,async()=>{
    await connect()
    console.log("server is running")
})
