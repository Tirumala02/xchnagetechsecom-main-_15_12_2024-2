import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ShopContext } from '../context/ShopContext';

const ProductRequest = () => {
  const { token, backendUrl, raiseTicket } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    document: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      document: e.target.files[0],
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      message: '',
      document: null,
    });
    // Reset the file input
    const fileInput = document.getElementById('document');
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    const form = new FormData();
    form.append('name', formData.name);
    form.append('email', formData.email);
    form.append('message', formData.message);
    form.append('document', formData.document);

    if (token) {
      try {
        const response = await fetch(`${backendUrl}/api/raise-ticket`, {
          method: 'POST',
          body: form,
          headers: { token },
        });

        const data = await response.json();
        if (response.ok) {
          toast.success('Form submitted successfully');
          resetForm();
        } else {
          toast.error(`Submission failed: ${data.message}`);
        }
      } catch (error) {
        toast.error(`Error submitting form: ${error.message}`);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      toast.error('You must be logged in to submit a request');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <h2 className="text-2xl font-bold mb-4">Unable to find the product?</h2>
      <p className="mb-6">
        If you cannot find the product you're looking for in our store, you can reach out to us by uploading a
        product list in the form of an Excel sheet (.xls). This sheet should contain the product links that you want
        us to check or source for you. Follow the steps below to create and upload your .xls sheet.
      </p>

      <h3 className="text-xl font-semibold mb-4">Steps to Create the Excel Sheet:</h3>
      <ol className="mb-6 list-decimal pl-6">
        <li>Open Microsoft Excel or Google Sheets.</li>
        <li>In the first column, add the product URLs you want us to check.</li>
        <li>Ensure each product link is on a separate row.</li>
        <li>Save the file in the .xls format (not .xlsx).</li>
        <li>Upload the .xls sheet using the file upload section below.</li>
      </ol>

      <motion.form
        onSubmit={handleSubmit}
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <label htmlFor="name" className="block text-lg font-medium text-gray-700">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-lg font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-lg font-medium text-gray-700">Message</label>
          <textarea
            id="message"
            name="message"
            rows="4"
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div>
          <label htmlFor="document" className="block text-lg font-medium text-gray-700">Upload Product Links (Only .xls)</label>
          <input
            type="file"
            id="document"
            name="document"
            accept=".xls,.xlsx"
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            onChange={handleFileChange}
            required
          />
        </div>

        <motion.button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <motion.div
              className="w-5 h-5 border-t-2 border-white rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          ) : (
            'Submit'
          )}
        </motion.button>
      </motion.form>
    </div>
  );
};

export default ProductRequest;

