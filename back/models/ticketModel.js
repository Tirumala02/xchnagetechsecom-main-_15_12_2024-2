import mongoose from "mongoose";

// Ticket Request Schema
const ticketRequestSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: false,
        },
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        document: {
            url: { type: String, required: true }, 
            publicId: { type: String, required: true }, 
          },
        message: {
            type: String,
            required: false,
        },
        status: {
            type: String,
            enum: ["pending", "resolved"],
            default: "pending",
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

// Create and export the TicketRequest model
const ticketRequest = mongoose.model("ticketrequests", ticketRequestSchema);
export default ticketRequest;
