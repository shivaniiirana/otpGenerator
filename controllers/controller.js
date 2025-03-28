import twilio from 'twilio';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
const TWILIO_PHONE = process.env.TWILIO_PHONE;
const JWT_SECRET = process.env.JWT_SECRET; 


const generateOTP = () => Math.floor(100000 + Math.random() * 900000);


const formatPhoneNumber = (phone) => {
    if (!phone.startsWith('+')) {
        return `+${phone}`;
    }
    return phone;
};


export const sendOTP = async (req, res) => {
    let { phone } = req.query; // Get phone number
    // console.log(phone)

    if (!phone) {
        return res.status(400).json({ error: 'Phone number is required' });
    }

    phone = formatPhoneNumber(phone); // Ensure correct format
    const otp = generateOTP();

    // Create a JWT with OTP and expiration time
    const token = jwt.sign(
        { phone, otp, exp: Math.floor(Date.now() / 1000) + 300 }, // Expires in 5 minutes
        JWT_SECRET
    );

    const message = `Your OTP for login verification is: ${otp}
Please enter this OTP to complete your authentication.
This OTP is valid for 5 minutes.

Best, Shivani Rana`;

    try {
        await twilioClient.messages.create({
            body: message,
            from: TWILIO_PHONE,
            to: phone
        });

        res.json({ message: 'OTP sent successfully!', token });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ error: 'Failed to send OTP', details: error.message });
    }
};


export const verifyOTP = async (req, res) => {
    const { token, otp } = req.query; 

    if (!token || !otp) {
        return res.status(400).json({ error: 'Token and OTP are required' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        
        if (decoded.otp !== parseInt(otp)) {
            return res.status(400).json({ error: 'Invalid OTP' });
        }

        res.json({ message: 'OTP verified successfully!' });
    } catch (error) {
        return res.status(400).json({ error: 'Invalid or expired token' });
    }
};
