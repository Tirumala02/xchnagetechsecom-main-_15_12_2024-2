import express from 'express';
import multer from 'multer';
import ticketRequest from '../models/ticketModel.js';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs/promises'; // Promises-based fs
import userModel from '../models/userModel.js'; 
import authUser from '../middleware/auth.js';

const ticketRouter = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// Endpoint to raise a ticket
ticketRouter.post('/', upload.single('document'), async (req, res) => {
    try {
        const { userId, name, email, message } = req.body;

        // Validate input fields
        if (!name || !email || !message || !req.file) {
            return res.status(400).json({ message: 'All fields are required, including an .xls file.' });
        }

        // Validate file type (MIME type or file extension)
        if (!req.file.originalname.endsWith('.xlsx')) {
            return res.status(400).json({ message: 'Only .xls and .xlsx files are allowed.' });
        }

        // Optional: Validate user existence
        // console.log("userId")
        // console.log(userId)
        if (userId) {
            const user = await userModel.findById(userId);
            console.log(user)
            if (!user) {
                return res.status(404).json({ message: 'User not found.' });
            }
        }

        // Upload file to Cloudinary

        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
            folder: 'product_requests',
            resource_type: 'auto',
        });

        // const uploadedDocument = async (file) => {
        //     const result = await cloudinary.uploader.upload(file.path, {
        //         // resource_type: 'raw', // For non-image files
        //         folder: 'product_requests',
        //         resource_type: 'auto'
        //     });
        //     return {
        //         url: result.secure_url,
        //         publicId: result.public_id,
        //     };
        // };
        

        // Create a new ticket in the database

        const ticket = new ticketRequest({
            userId:userId,
            name,
            email,
            document:{ 
                url: uploadResult.secure_url,
                publicId:uploadResult.public_id
            },
            message,
        });

        // const ticket = new ticketRequest({
        //     userId,
        //     name,
        //     email,
        //     message,
        //     document: {
        //         url: uploadedDocument.url,
        //         publicId: uploadedDocument.publicId,
        //     },
        //     status: 'pending',
        // });

        await ticket.save();

        // Remove local file after upload
        await fs.unlink(req.file.path);

        res.status(201).json({
            message: 'Ticket raised successfully.',
            ticket,
        });
    } catch (error) {
        console.error('Error raising ticket:', error);
        res.status(500).json({ message: 'Error raising ticket.', error: error.message });
    }
});

export default ticketRouter;
