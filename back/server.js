import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import bodyParser from "body-parser";
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import adminRoutes from './routes/adminRoute.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'
import ticketRouter from './routes/ticketRequestRoute.js';

// App Config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

// middlewares
app.use(express.json())
app.use(bodyParser.json());
app.use(cors())

// api endpoints
app.use('/api/user',userRouter)
app.use('/api/admin',adminRoutes)
app.use('/api/product',productRouter)
app.use('/api/cart',cartRouter)
app.use('/api/order',orderRouter)

app.use('/api/raise-ticket',ticketRouter)


app.get('/',(req,res)=>{
    res.send("API Working")
})



app.listen(port, ()=> console.log('Server started on PORT : '+ port))