import express from 'express'
import adminAuth from '../middleware/adminAuth.js';
import { ValueChangerGet, ValueChangerPost,Tickets, TicketsUpdate, TicketsDownload, TicketsDelete} from '../controllers/adminController.js';

const adminRoutes=express.Router()

// function ValueChanger(){

// }

adminRoutes.post('/value-changer', adminAuth, ValueChangerPost);
adminRoutes.get('/value-changer', ValueChangerGet);

// Endpoint to get all ticket requests for admin view
adminRoutes.get('/tickets', Tickets);
adminRoutes.put('/tickets-update',adminAuth,TicketsUpdate)
adminRoutes.get('/download-tickets', TicketsDownload);
adminRoutes.post('/tickets-delete',adminAuth,TicketsDelete)

export default adminRoutes