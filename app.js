import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import otpRoutes from './routes/routes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/', otpRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
