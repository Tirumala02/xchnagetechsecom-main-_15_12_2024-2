import express from 'express';
import { loginUser,registerUser,adminLogin } from '../controllers/userController.js';
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js"; 
import authUser from '../middleware/auth.js';

const userRouter = express.Router();

userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.post('/admin',adminLogin)

userRouter.post("/profile", authUser,async (req, res) => {
    // console.log('in user routes/profile')
    const { userId } = req.body;
    try {
        const user = await userModel.findById(userId);
        // console.log('in user routes/profile')
        // console.log(user)
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update user password
userRouter.put("/profile/password",authUser, async (req, res) => {
    const { userId,password } = req.body;
    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Hash new password and save
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        await user.save();

        res.json({ message: "Password updated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add GST details
userRouter.post("/profile/gst",authUser, async (req, res) => {
    const { userId,gstNumber, legalName, billingAddress, isSEZ } = req.body;

    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.gstAccounts.push({ gstNumber, legalName, billingAddress, isSEZ });
        await user.save();

        res.json({ message: "GST details added successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Edit GST details
// userRouter.put("/profile/gst/edit", authUser,async (req, res) => {
//     const { userId,gstId, gstNumber, legalName, billingAddress, isSEZ } = req.body;
//     try {
//         const user = await userModel.findById(userId);
//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         const gstAccount = user.gstAccounts.id(gstId);
//         if (!gstAccount) {
//             return res.status(404).json({ message: "GST Account not found" });
//         }

//         gstAccount.gstNumber = gstNumber;
//         gstAccount.legalName = legalName;
//         gstAccount.billingAddress = billingAddress;
//         gstAccount.isSEZ = isSEZ;

//         await user.save();

//         res.json({ message: "GST details updated successfully" });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

userRouter.post("/profile/gst/edit/:gstId", authUser, async (req, res) => {
    const { userId, gstId, gstNumber, legalName, billingAddress, isSEZ } = req.body;
    // console.log(req.body)
    try {
      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const gstAccount = user.gstAccounts.id(req.params.gstId);
    //   console.log(gstAccount)

      if (!gstAccount) {
        return res.status(404).json({ message: "GST Account not found" });
      }
  
      gstAccount.gstNumber = gstNumber;
      gstAccount.legalName = legalName;
      gstAccount.billingAddress = billingAddress;
      gstAccount.isSEZ = isSEZ;
  
      await user.save();
  
      res.json({ success:true, message: "GST details updated successfully", gst: gstAccount });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  export default userRouter;