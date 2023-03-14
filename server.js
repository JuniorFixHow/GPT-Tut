import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import requestRoute from './routes/requestRoute.js'

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());


const PORT  = process.env.PORT || 5000;

app.use('/api', requestRoute)

app.listen(PORT, ()=>{
    console.log(`Server is listening on port ${PORT}`);
})
