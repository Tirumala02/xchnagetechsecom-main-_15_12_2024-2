import React from "react";
import { FaPlus } from "react-icons/fa";
import { motion, transform } from "framer-motion";

const AddGstForm = ({ gstForm, setGstForm, handleAddGst }) => (
    <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FaPlus className="mr-2" />
            Add GST Details
        </h2>
        <div className="space-y-4">
            <div>
                <label htmlFor="gstNumber" className="block text-sm font-medium text-gray-700">GST Number</label>
                <input
                    id="gstNumber"
                    type="text"
                    value={gstForm.gstNumber}
                    onChange={(e) => setGstForm({ ...gstForm, gstNumber: e.target.value })}
                    className="mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div>
                <label htmlFor="legalName" className="block text-sm font-medium text-gray-700">Legal Name</label>
                <input
                    id="legalName"
                    type="text"
                    value={gstForm.legalName}
                    onChange={(e) => setGstForm({ ...gstForm, legalName: e.target.value })}
                    className="mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div>
                <label htmlFor="billingAddress" className="block text-sm font-medium text-gray-700">Billing Address</label>
                <input
                    id="billingAddress"
                    type="text"
                    value={gstForm.billingAddress}
                    onChange={(e) => setGstForm({ ...gstForm, billingAddress: e.target.value })}
                    className="mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div className="flex items-center space-x-2">
                <label htmlFor="isSEZ" className="text-sm font-medium text-gray-700">Is SEZ?</label>
                {/* <motion.div
          className={`w-10 h-6 flex items-center rounded-full p-1 cursor-pointer ${gstForm.isSEZ ? 'bg-blue-500' : 'bg-gray-300'}`}
          onClick={() => setGstForm({ ...gstForm, isSEZ: !gstForm.isSEZ })}
        >
          <motion.div
            className={`bg-white w-4 h-4 rounded-full shadow-md ${gstForm.isSEZ ? ' -translate-x-5' : '' }ease-in-out duration-300`}
            layout
            // transition={spring}
          />
        </motion.div> */}
                <motion.div
                    className={`w-10 h-6 flex items-center rounded-full p-1 cursor-pointer ${gstForm.isSEZ ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                    onClick={() => setGstForm({ ...gstForm, isSEZ: !gstForm.isSEZ })}
                >
                    <motion.div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform ${gstForm.isSEZ ? 'translate-x-4' : 'translate-x-0'
                            }`}
                        layout
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    />
                </motion.div>

            </div>
            <button
                onClick={handleAddGst}
                className="w-full bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300"
            >
                Add GST
            </button>
        </div>
    </div>
);

const spring = {
    type: "spring",
    stiffness: 700,
    damping: 30
};

export default AddGstForm;

