import React from "react";
import { FaUser } from "react-icons/fa";

const UserDetails = ({ userDetails }) => (
  <div className="bg-white shadow-md rounded-lg p-6">
    <h2 className="text-xl font-semibold mb-4 flex items-center">
      <FaUser className="mr-2" />
      Profile Details
    </h2>
    <p><strong>Name:</strong> {userDetails.name}</p>
    <p><strong>Email:</strong> {userDetails.email}</p>
  </div>
);

export default UserDetails;

