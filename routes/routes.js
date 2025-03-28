import { Router } from "express";
import { sendOTP, verifyOTP } from "../controllers/controller.js";

const router = Router();

router.get('/', (req, res) => {
    res.end("Welcome to OTP Authentication Service");
});

router.post('/sendotp', sendOTP); 
router.post('/verifyotp', verifyOTP); 

export default router;
