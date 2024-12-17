import nodemailer from 'nodemailer';
import Stripe from 'stripe';
import Razorpay from 'razorpay';
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";
import { getNextOrderId } from '../utils/orderIdGenerator.js';
import generateQuotationPDF from '../utils/pdfGenerator.js';
import iGenerateQuotationPDF from '../utils/ipdfGenerator.js';


const hsnFilepath='./HSN_SAC.json'
// Global Variables
const currency = 'inr';
const deliveryCharge = 10;

// Payment Gateway Initialization
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Nodemailer Configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendMail = async (to, subject, htmlContent, pdfBuffer, order) => {
    const mailOptions = {
        from: process.env.EMAIL_SENDER,
        to: to,
        subject: subject,
        html: htmlContent,
        attachments: [
            {
                filename: `quotation.pdf`, // Now `order` is correctly passed here
                content: pdfBuffer,
                encoding: 'base64',
                contentType: 'application/pdf',
            },
        ],
    };

    // Send the email (use your preferred email sending method, e.g., nodemailer)
    await transporter.sendMail(mailOptions);
};
const sendOrderEmails = async (user, order, address,gstDetails) => {
    try {
        const adminEmail = process.env.EMAIL_ADMIN;
        
        // Generate PDF for the order as a buffer
        //******* IF SEZ
        let pdfBuffer;
        if(gstDetails.isSEZ){
            pdfBuffer = await generateQuotationPDF(order, address,gstDetails);
        }
        else{
         pdfBuffer = await iGenerateQuotationPDF(order, address,gstDetails);
        }
        
        
         const formatAddress = (address) => `
            ${address.firstName} ${address.lastName}<br>
            ${address.street},<br>
            ${address.city}, ${address.state}, ${address.zipcode},<br>
            ${address.country}<br>
            Phone: ${address.phone}<br>
            Email: ${address.email}
        `;

        const generateEmailHTML = (name, order, recipientType) => {
            const greeting = recipientType === "user" ? `Hello ${name},` : `Hello Admin,`;
            const intro = recipientType === "user"
                ? "Thank you for shopping with us! Below are your order details."
                : "A new order has been placed. Here are the details.";
            return ` 
                
                <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>XCHANGETECHS Order Confirmation</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <tr>
            <td align="center" style="padding: 20px 0;">
                <img src="${'https://xchangetechs.s3.ap-south-1.amazonaws.com/xchange-tech-v9/assets/img/xchange-techs.png'}" alt="XCHANGETECHS Logo" style=" height: 70px;">
            </td>
        </tr>
        <tr>
            <td style="background-color: #f8f8f8; padding: 20px; border-radius: 8px;">
                <h2 style="color: #4CAF50; text-align: center; margin: 0 0 20px 0; font-size: 24px;">Order Confirmation</h2>
                <p style="margin: 0 0 15px 0;">${greeting}</p>
                <p style="margin: 0 0 20px 0;">${intro}</p>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                    <thead>
                        <tr>
                            <th style="text-align: left; border-bottom: 2px solid #ddd; padding: 10px; background-color: #e9e9e9; font-size: 14px;">Item</th>
                            <th style="text-align: center; border-bottom: 2px solid #ddd; padding: 10px; background-color: #e9e9e9; font-size: 14px;">Quantity</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${order.items
                    .map(
                        (item) => `
                                <tr>
                                    <td style="padding: 10px; border-bottom: 1px solid #ddd; font-size: 14px;">${item.name || item.title}</td>
                                    <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center; font-size: 14px;">${item.quantity}</td>
                                </tr>
                            `
                    )
                    .join("")}
                    </tbody>
                </table>
                <div style="background-color: #ffffff; padding: 15px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #e0e0e0;">
                    <h3 style="color: #4CAF50; margin: 0 0 10px 0; font-size: 18px;">Delivery Address:</h3>
                    <p style="margin: 0; font-size: 14px;">${formatAddress(address)}</p>
                </div>
                <p style="margin: 20px 0 0 0; text-align: center; font-size: 16px; font-weight: bold;">Thank you for choosing XCHANGETECHS!</p>
            </td>
        </tr>
        <tr>
            <td style="text-align: center; padding: 20px 0; color: #888; font-size: 12px;">
                <p style="margin: 0 0 5px 0;">This is an automated email. Please do not reply to this message.</p>
                <p style="margin: 0;">&copy; ${new Date().getFullYear()} XCHANGETECHS. All rights reserved.</p>
            </td>
        </tr>
    </table>
</body>
</html>
                `;
        };

        const userHTML = generateEmailHTML(address.firstName, order, 'user');
        await sendMail(address.email, "Order Confirmation", userHTML, pdfBuffer);

        const adminHTML = generateEmailHTML("Admin", order, 'admin');
        await sendMail(adminEmail, "New Order Received", adminHTML, pdfBuffer);
    } catch (error) {
        console.error("Error sending order emails:", error.message);
    }
};

// Order Handlers
 const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address,gstDetails } = req.body;
        
        // Verify user existence
        const user = await userModel.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        
        // Generate unique order ID for the day
        const orderId = await getNextOrderId();

        // Create and save the order
        const newOrder = new orderModel({
            userId,
            items,
            amount,
            address,
            paymentMethod: "COD", // Change if needed
            payment: false,
            date: Date.now(),
            orderId,
        });

        await newOrder.save();

        // Clear user's cart after placing the order
        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        // Optionally, send emails
        await sendOrderEmails(user, {orderId, amount, items} , address,gstDetails);

        // generateQuotationPDF(newOrder,address, gstDetails)
        
        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            orderId, // Send orderId to the client
        });
    } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};


const placeOrderStripe = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;
        const { origin } = req.headers;

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "Stripe",
            payment: false,
            date: Date.now(),
        };

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        const line_items = [
            ...items.map(item => ({
                price_data: {
                    currency,
                    product_data: { name: item.name },
                    unit_amount: item.price * 100,
                },
                quantity: item.quantity,
            })),
            {
                price_data: {
                    currency,
                    product_data: { name: 'Delivery Charges' },
                    unit_amount: deliveryCharge * 100,
                },
                quantity: 1,
            },
        ];

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: 'payment',
        });

        res.json({ success: true, session_url: session.url });
    } catch (error) {
        console.error("Error placing Stripe order:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const verifyStripe = async (req, res) => {
    try {
        const { orderId, success, userId } = req.body;

        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            await userModel.findByIdAndUpdate(userId, { cartData: {} });
            res.json({ success: true });
        } else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false });
        }
    } catch (error) {
        console.error("Error verifying Stripe payment:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const placeOrderRazorpay = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "Razorpay",
            payment: false,
            date: Date.now(),
        };

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        const options = {
            amount: amount * 100,
            currency: currency.toUpperCase(),
            receipt: newOrder._id.toString(),
        };

        razorpayInstance.orders.create(options, (error, order) => {
            if (error) return res.status(500).json({ success: false, message: error.message });
            res.json({ success: true, order });
        });
    } catch (error) {
        console.error("Error placing Razorpay order:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const verifyRazorpay = async (req, res) => {
    try {
        const { userId, razorpay_order_id } = req.body;

        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
        if (orderInfo.status === 'paid') {
            await orderModel.findByIdAndUpdate(orderInfo.receipt, { payment: true });
            await userModel.findByIdAndUpdate(userId, { cartData: {} });
            res.json({ success: true, message: "Payment Successful" });
        } else {
            res.json({ success: false, message: 'Payment Failed' });
        }
    } catch (error) {
        console.error("Error verifying Razorpay payment:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Admin and User Helpers
const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        console.log(orders)
        res.json({ success: true, orders });
    } catch (error) {
        console.error("Error fetching all orders:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const userOrders = async (req, res) => {
    try {
        const { userId } = req.body;
        const orders = await orderModel.find({ userId });
        res.json({ success: true, orders });
    } catch (error) {
        console.error("Error fetching user orders:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        await orderModel.findByIdAndUpdate(orderId, { status });
        res.json({ success: true, message: 'Status Updated' });
    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// In orderController.js
 const deleteOrder = async (req, res) => {
    try {
      const { id } = req.params
      // Find and delete the order by ID
      const order = await orderModel.findByIdAndDelete(id)
  
      if (!order) {
        return res.status(404).json({ message: 'Order not found' })
      }
  
      return res.status(200).json({ message: 'Order deleted successfully' })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Something went wrong' })
    }
  }
  

export { verifyRazorpay, verifyStripe, deleteOrder, placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrders, updateStatus }
