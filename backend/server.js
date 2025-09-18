// import express from 'express'
// import cors from 'cors'
// import cookieParser from 'cookie-parser'
// import dotenv from 'dotenv'
// import connectDB from './config/db.js'
// import route from './routes/userRoute.js'
// import { authRouter } from './routes/authUserRoute.js'
// import connectCloudinary from './config/cloudinary.js'
// import pollRoute from './routes/pollRoute.js';
// import { initWebSocket } from './websocket/socket.js';

// // Replace your current app.listen with:
// const server = app.listen(PORT, () => {
//   console.log(`http://localhost:${PORT}`);
// });

// // Initialize WebSocket
// initWebSocket(server);

// dotenv.config()

// const app = express()

// await connectCloudinary()
// const PORT = process.env.PORT || 3800
// console.log(PORT,"PORT")
// const allowedOrigins = [
    
//     'http://localhost:5173'
//     // 'https://mern-pdf-gilt.vercel.app'

// ]


// const corsOptions = {
//     origin:allowedOrigins,
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     credentials:true,
//      allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
// }
// app.use(cors(corsOptions))
// app.use(express.json())
// app.use(cookieParser())


// app.use("/api",route)
// app.use("/api/user",authRouter)
// app.use("/api/poll", pollRoute);

// connectDB().then(()=>{
// app.listen(PORT,()=>{
//     console.log(`http://localhost:${PORT}`)
// })
// })


import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import route from './routes/userRoute.js'
import { authRouter } from './routes/authUserRoute.js'
import connectCloudinary from './config/cloudinary.js'
import { initWebSocket } from './websocket/socket.js';
import pollRouter from './routes/pollRoutes.js'

dotenv.config()

const app = express()

await connectCloudinary()
const PORT = process.env.PORT || 3800
console.log(PORT, "PORT")

const allowedOrigins = [
    // 'http://localhost:5173'
        'https://mern-vote-seven.vercel.app'
]

const corsOptions = {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())

app.use("/api", route)
app.use("/api/user", authRouter)
app.use("/api/poll", pollRouter) // Changed from "/api/poll" to "/api"

connectDB().then(() => {
    const server = app.listen(PORT, () => {
        console.log(`http://localhost:${PORT}`)
    })
    
    // Initialize WebSocket after server starts
    initWebSocket(server)
})
