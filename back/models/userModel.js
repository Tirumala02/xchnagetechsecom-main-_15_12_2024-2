import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cartData: { type: Object, default: {} },
    gstAccounts: [
        {
            gstNumber: { type: String, required: true },
            legalName: { type: String, required: true },
            billingAddress: { type: String, required: true },
            isSEZ: { type: Boolean, default: false },
        },
    ],
    
}, { minimize: false })

const userModel = mongoose.models.user || mongoose.model('user',userSchema);

export default userModel