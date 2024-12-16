import mongoose from "mongoose";

// Schema for the Counters Collection
const counterSchema = new mongoose.Schema({
    _id: String,
    sequence_value: Number,
});

const Counter = mongoose.model("Counter", counterSchema);

// Function to get the current date in the local timezone as YYYYMMDD
const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}${month}${day}`;
};

// Function to generate the next order ID
export const getNextOrderId = async () => {
    try {
        // Get today's date in YYYYMMDD format
        const currentDate = getCurrentDate();
        console.log("currentDate:", currentDate);

        // Increment the counter atomically in the database
        const counter = await Counter.findOneAndUpdate(
            { _id: "orderId" },             // Find the counter document for orderId
            { $inc: { sequence_value: 1 } }, // Increment the sequence value by 1
            { new: true, upsert: true }      // Return the updated document or create it if it doesn't exist
        );

        // Ensure the sequence value is padded to 6 digits
        const nthOrder = String(counter.sequence_value).padStart(6, "0");

        // Combine the date and sequence number to form the final order ID
        return `ORD${currentDate}${nthOrder}`;
    } catch (error) {
        console.error("Error generating order ID:", error);
        throw new Error("Could not generate order ID");
    }
};
