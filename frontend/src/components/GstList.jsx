import React from "react";
import { FaEdit } from "react-icons/fa";
import { motion } from "framer-motion";

const GstList = ({ gstList, editGstForm, setEditGstForm, handleEditGst }) => (
  <div className="bg-white shadow-md rounded-lg p-6">
    <h2 className="text-xl font-semibold mb-4 flex items-center">
      <FaEdit className="mr-2" />
      GST Accounts
    </h2>
    <ul className="space-y-4">
      {gstList.map((gst) => (
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
      ))}
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
        <div>
          <label htmlFor="editRegistrationDate" className="block text-sm font-medium text-gray-700">Registration Date</label>
          <input
            id="editRegistrationDate"
            type="date"
            value={editGstForm.registrationDate}
            onChange={(e) => setEditGstForm({ ...editGstForm, registrationDate: e.target.value })}
            className="mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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
);

const spring = {
  type: "spring",
  stiffness: 700,
  damping: 30
};

export default GstList;

