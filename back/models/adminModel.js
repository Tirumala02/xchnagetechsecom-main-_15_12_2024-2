import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    deliveryLeadTime: { 
      label: { type: String, default: "Delivery Lead Time" },
      value: { type: Number, default: 3 },
      unit: { type: String, default: "days" },
    },
    priceMargin: {
      label: { type: String, default: "Price Margin" },
      value: { type: Number, default: 10 },
      unit: { type: String, default: "%" },
    },
  },
  { minimize: false, timestamps: true }
);

const adminModel = mongoose.models.admin || mongoose.model("admin", adminSchema);

export default adminModel;
