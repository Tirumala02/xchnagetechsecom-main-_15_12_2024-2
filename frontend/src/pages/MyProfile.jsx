

// import React, { useState, useEffect, useContext } from "react";
// import axios from "axios";
// import { motion } from "framer-motion";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { FaUser, FaCreditCard, FaPlus, FaEdit } from "react-icons/fa";
// import UserDetails from "../components/UserDetails";
// import AddGstForm from "../components/AddGstForm";
// // import GstList from "../components/GstList";
// import { ShopContext } from "../context/ShopContext";
// const ProfilePage = () => {
//   //   const [userDetails, setUserDetails] = useState(null);
//   const { backendUrl, userDetails, token } = useContext(ShopContext)
//   const [newPassword, setNewPassword] = useState("");
//   const [gstForm, setGstForm] = useState({
//     gstNumber: "",
//     legalName: "",
//     billingAddress: "",
//     isSEZ: false,
//     registrationDate: "",
//   });

//   const [gstList, setGstList] = useState([]);
//   const [editGstForm, setEditGstForm] = useState(null);

//   useEffect(() => {
//     fetchGstDetails();
//     console.log(gstList)
//   }, [userDetails,gstList]);

  

//   const fetchGstDetails = async () => {
    
//     setGstList(userDetails.gstAccounts);
    
//   };

//   const handlePasswordUpdate = async () => {

//   };

//   const handleAddGst = async () => {
//     try {
//       const response = await axios.post(backendUrl + "/api/user/profile/gst", { ...gstForm }, { headers: { token } });
  
//       toast.success(response.data.message);
  
//       // If you're editing an existing GST, find and update it in the gstList
//       if (response.data.gst && response.data.gst._id) {
//         setGstList((prevList) => 
//           prevList.map((gst) =>
//             gst._id === response.data.gst._id ? { ...gst, ...response.data.gst } : gst
//           )
//         );
//       } else {
//         // If it's a new entry, add it to the list
//         setGstList([...gstList, response.data.gst]);
//       }
  
//       setGstForm({
//         gstNumber: "",
//         legalName: "",
//         billingAddress: "",
//         isSEZ: false,
//       });
//     } catch (error) {
//       console.error("Error adding GST details:", error);
//       toast.error("Failed to add GST details");
//     }
//   };
//   // 
//   const handleEditGst = async () => {
//     if (!editGstForm) return;
//     let gstId=editGstForm._id 
//     try {
//       const response = await axios.post(backendUrl + `/api/user/profile/gst/edit/${gstId}`, { ...editGstForm }, { headers: { token } });
//       if(response.data.success) toast.success(response.data.message);
//       else toast.error(response.data.message);
//       setGstList(gstList.map(gst => gst._id === editGstForm._id ? editGstForm : gst));
//       setEditGstForm(null);
//     } catch (error) {
//       console.error("Error updating GST details:", error);
//       toast.error("Failed to update GST details");
//     }
//   };

//   if (!userDetails) return <p className="text-center mt-8">Loading...</p>;


//   return (
//     <div className="container mx-auto p-6 space-y-8">
//       <ToastContainer />
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//       >
//         <UserDetails userDetails={userDetails} />
//       </motion.div>

//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5, delay: 0.2 }}
//       >
//         <div className="bg-white shadow-md rounded-lg p-6">
//           <h2 className="text-xl font-semibold mb-4 flex items-center">
//             <FaCreditCard className="mr-2" />
//             Change Password
//           </h2>
//           <div className="flex items-center space-x-4">
//             <input
//               type="password"
//               placeholder="New Password"
//               value={newPassword}
//               onChange={(e) => setNewPassword(e.target.value)}
//               className="flex-grow border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <button
//               onClick={handlePasswordUpdate}
//               className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
//             >
//               Update Password
//             </button>
//           </div>
//         </div>
//       </motion.div>

//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5, delay: 0.4 }}
//       >
//         <AddGstForm gstForm={gstForm} setGstForm={setGstForm} handleAddGst={handleAddGst} />
//       </motion.div>

//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5, delay: 0.6 }}
//       >
        
//         <div className="bg-white shadow-md rounded-lg p-6">
//           <h2 className="text-xl font-semibold mb-4 flex items-center">
//             <FaEdit className="mr-2" />
//             GST Accounts
//           </h2>
//           <ul className="space-y-4">
//             {gstList && gstList.length > 0 ? (
//               gstList.map((gst) => (
//                 <li key={gst._id} className="border p-4 rounded">
//                   <p><strong>GST Number:</strong> {gst.gstNumber}</p>
//                   <p><strong>Legal Name:</strong> {gst.legalName}</p>
//                   <p><strong>Billing Address:</strong> {gst.billingAddress}</p>
//                   <p><strong>Is SEZ:</strong> {gst.isSEZ ? "Yes" : "No"}</p>
//                   <button
//                     onClick={() => setEditGstForm(gst)}
//                     className="mt-2 bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition duration-300"
//                   >
//                     Edit
//                   </button>
//                 </li>
//               ))
//             ) : (
//               <li>No GST accounts available</li> // You can show a fallback message if gstList is empty
//             )}
//           </ul>


//           {editGstForm && (
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5 }}
//               className="mt-6 space-y-4"
//             >
//               <h3 className="text-lg font-semibold">Edit GST Account</h3>
//               <div>
//                 <label htmlFor="editGstNumber" className="block text-sm font-medium text-gray-700">GST Number</label>
//                 <input
//                   id="editGstNumber"
//                   type="text"
//                   value={editGstForm.gstNumber}
//                   onChange={(e) => setEditGstForm({ ...editGstForm, gstNumber: e.target.value })}
//                   className="mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//               <div>
//                 <label htmlFor="editLegalName" className="block text-sm font-medium text-gray-700">Legal Name</label>
//                 <input
//                   id="editLegalName"
//                   type="text"
//                   value={editGstForm.legalName}
//                   onChange={(e) => setEditGstForm({ ...editGstForm, legalName: e.target.value })}
//                   className="mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//               <div>
//                 <label htmlFor="editBillingAddress" className="block text-sm font-medium text-gray-700">Billing Address</label>
//                 <input
//                   id="editBillingAddress"
//                   type="text"
//                   value={editGstForm.billingAddress}
//                   onChange={(e) => setEditGstForm({ ...editGstForm, billingAddress: e.target.value })}
//                   className="mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//               <div className="flex items-center space-x-2">
//                 <label htmlFor="editIsSEZ" className="text-sm font-medium text-gray-700">Is SEZ?</label>
//                 <motion.div
//                   className={`w-10 h-6 flex items-center rounded-full p-1 cursor-pointer ${editGstForm.isSEZ ? 'bg-blue-500' : 'bg-gray-300'}`}
//                   onClick={() => setEditGstForm({ ...editGstForm, isSEZ: !editGstForm.isSEZ })}
//                 >
//                   <motion.div
//                     className="bg-white w-4 h-4 rounded-full shadow-md"
//                     layout
//                     transition={spring}
//                   />
//                 </motion.div>
//               </div>
//               <button
//                 onClick={handleEditGst}
//                 className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
//               >
//                 Save Changes
//               </button>
//             </motion.div>
//           )}
//         </div>
//       </motion.div>
//     </div>
//   );
// };
// const spring = {
//   type: "spring",
//   stiffness: 700,
//   damping: 30
// };
// export default ProfilePage;






import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaUser, FaCreditCard, FaPlus, FaEdit } from "react-icons/fa";
import UserDetails from "../components/UserDetails";
import AddGstForm from "../components/AddGstForm";
// import GstList from "../components/GstList";
import { ShopContext } from "../context/ShopContext";
const ProfilePage = () => {
  //   const [userDetails, setUserDetails] = useState(null);
  const { backendUrl, userDetails, token } = useContext(ShopContext)
  const [newPassword, setNewPassword] = useState("");
  const [gstForm, setGstForm] = useState({
    gstNumber: "",
    legalName: "",
    billingAddress: "",
    isSEZ: false,
    registrationDate: "",
  });

  const [gstList, setGstList] = useState([]);
  const [editGstForm, setEditGstForm] = useState(null);


  useEffect(() => {
    if (userDetails && userDetails.gstAccounts) {
      setGstList(userDetails.gstAccounts);
    }
  }, );

  //   const fetchUserDetails = async () => {
  //     try {
  //       const response = await axios.get("/api/profile");
  //       setUserDetails(response.data);
  //     } catch (error) {
  //       console.error("Error fetching user details:", error);
  //       toast.error("Failed to fetch user details");
  //     }
  //   };

  const fetchGstDetails = async () => {
    //   try {
    //     const response = await axios.get(backendUrl+"/api/profile/gst");
    setGstList(userDetails.gstAccounts);
    //   } catch (error) {
    //     console.error("Error fetching GST details:", error);
    //     toast.error("Failed to fetch GST details");
    //   }
  };

  const handlePasswordUpdate = async () => {
    // if (!newPassword) {
    //   toast.error("Password is required");
    //   return;
    // }
    // try {
    //   const response = await axios.put("/api/profile/password", { password: newPassword });
    //   toast.success(response.data.message);
    //   setNewPassword("");
    // } catch (error) {
    //   console.error("Error updating password:", error);
    //   toast.error("Failed to update password");
    // }
  };

  // const handleAddGst = async () => {
  //   try {
  //     const response = await axios.put(backendUrl + "/api/user/profile/gst", { ...gstForm }, { headers: { token } });
  //     toast.success(response.data.message);
  //     setGstList([...gstList, response.data.gst]);
  //     setGstForm({
  //       gstNumber: "",
  //       legalName: "",
  //       billingAddress: "",
  //       isSEZ: false,
  //     });
  //   } catch (error) {
  //     console.error("Error adding GST details:", error);
  //     toast.error("Failed to add GST details");
  //   }
  // };


  // const handleAddGst = async () => {
  //   try {
  //     const response = await axios.post(backendUrl + "/api/user/profile/gst", { ...gstForm }, { headers: { token } });
  
  //     toast.success(response.data.message);
  
  //     // If you're editing an existing GST, find and update it in the gstList
  //     if (response.data.gst && response.data.gst._id) {
  //       setGstList((prevList) => 
  //         prevList.map((gst) =>
  //           gst._id === response.data.gst._id ? { ...gst, ...response.data.gst } : gst
  //         )
  //       );
  //     } else {
  //       // If it's a new entry, add it to the list
  //       setGstList([...gstList, response.data.gst]);
  //     }
  
  //     setGstForm({
  //       gstNumber: "",
  //       legalName: "",
  //       billingAddress: "",
  //       isSEZ: false,
  //     });
  //   } catch (error) {
  //     console.error("Error adding GST details:", error);
  //     toast.error("Failed to add GST details");
  //   }
  // };
  // 


  const handleAddGst = async () => {
    try {
      const response = await axios.post(
        backendUrl + "/api/user/profile/gst", 
        { ...gstForm }, 
        { headers: { token } }
      );
  
      toast.success(response.data.message);
  
      // Directly update the gstList state
      if (response.data.gst) {
        setGstList(prevList => {
          // Check if the GST already exists to avoid duplicates
          const existingGstIndex = prevList.findIndex(gst => gst._id === response.data.gst._id);
          
          if (existingGstIndex !== -1) {
            // Update existing GST
            const updatedList = [...prevList];
            updatedList[existingGstIndex] = response.data.gst;
            return updatedList;
          } else {
            // Add new GST
            return [...prevList, response.data.gst];
          }
        });
      }
  
      // Reset the form
      setGstForm({
        gstNumber: "",
        legalName: "",
        billingAddress: "",
        isSEZ: false,
      });
    } catch (error) {
      console.error("Error adding GST details:", error);
      toast.error("Failed to add GST details");
    }
  };

  const handleEditGst = async () => {
    if (!editGstForm) return;
    let gstId=editGstForm._id 
    try {
      const response = await axios.post(backendUrl + `/api/user/profile/gst/edit/${gstId}`, { ...editGstForm }, { headers: { token } });
      if(response.data.success) toast.success(response.data.message);
      else toast.error(response.data.message);
      setGstList(gstList.map(gst => gst._id === editGstForm._id ? editGstForm : gst));
      setEditGstForm(null);
    } catch (error) {
      console.error("Error updating GST details:", error);
      toast.error("Failed to update GST details");
    }
  };

  

  if (!userDetails) return <p className="text-center mt-8">Loading...</p>;


  return (
    <div className="container mx-auto p-6 space-y-8">
      <ToastContainer />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <UserDetails userDetails={userDetails} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FaCreditCard className="mr-2" />
            Change Password
          </h2>
          <div className="flex items-center space-x-4">
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="flex-grow border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handlePasswordUpdate}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
            >
              Update Password
            </button>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <AddGstForm gstForm={gstForm} setGstForm={setGstForm} handleAddGst={handleAddGst} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FaEdit className="mr-2" />
            GST Accounts
          </h2>
          <ul className="space-y-4">
            {gstList && gstList.length > 0 ? (
              gstList.map((gst) => (
                <li key={gst._id} className="border p-4 rounded">
                  <p><strong>GST Number:</strong> {gst.gstNumber}</p>
                  <p><strong>Legal Name:</strong> {gst.legalName}</p>
                  <p><strong>Billing Address:</strong> {gst.billingAddress}</p>
                  <p><strong>Is SEZ:</strong> {gst.isSEZ ? "Yes" : "No"}</p>
                  <button
                    onClick={() => setEditGstForm(gst)}
                    className="mt-2 bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition duration-300"
                  >
                    Edit
                  </button>
                </li>
              ))
            ) : (
              <li>No GST accounts available</li> // You can show a fallback message if gstList is empty
            )}
          </ul>


          {editGstForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-6 space-y-4"
            >
              <h3 className="text-lg font-semibold">Edit GST Account</h3>
              <div>
                <label htmlFor="editGstNumber" className="block text-sm font-medium text-gray-700">GST Number</label>
                <input
                  id="editGstNumber"
                  type="text"
                  value={editGstForm.gstNumber}
                  onChange={(e) => setEditGstForm({ ...editGstForm, gstNumber: e.target.value })}
                  className="mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="editLegalName" className="block text-sm font-medium text-gray-700">Legal Name</label>
                <input
                  id="editLegalName"
                  type="text"
                  value={editGstForm.legalName}
                  onChange={(e) => setEditGstForm({ ...editGstForm, legalName: e.target.value })}
                  className="mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="editBillingAddress" className="block text-sm font-medium text-gray-700">Billing Address</label>
                <input
                  id="editBillingAddress"
                  type="text"
                  value={editGstForm.billingAddress}
                  onChange={(e) => setEditGstForm({ ...editGstForm, billingAddress: e.target.value })}
                  className="mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center space-x-2">
                <label htmlFor="editIsSEZ" className="text-sm font-medium text-gray-700">Is SEZ?</label>
                <motion.div
                  className={`w-10 h-6 flex items-center rounded-full p-1 cursor-pointer ${editGstForm.isSEZ ? 'bg-blue-500' : 'bg-gray-300'}`}
                  onClick={() => setEditGstForm({ ...editGstForm, isSEZ: !editGstForm.isSEZ })}
                >
                  <motion.div
                    className="bg-white w-4 h-4 rounded-full shadow-md"
                    layout
                    transition={spring}
                  />
                </motion.div>
              </div>
              <button
                onClick={handleEditGst}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
              >
                Save Changes
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
const spring = {
  type: "spring",
  stiffness: 700,
  damping: 30
};
export default ProfilePage;


