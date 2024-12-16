
import React, { useContext, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Title from '../components/Title';
import CartTotal from '../components/CartTotal';
import { assets } from '../assets/assets';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const PlaceOrder = () => {
    const [method, setMethod] = useState('cod');
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedGst, setSelectedGst] = useState(null);
    const {
        navigate,
        backendUrl,
        token,
        cartItems,
        setCartItems,
        getCartAmount,
        userDetails
    } = useContext(ShopContext);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zipcode: '',
        country: '',
        phone: ''
    });


    const GstLIST = userDetails.gstAccounts

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setFormData((data) => ({ ...data, [name]: value }));
    };

    useEffect(()=>{
        console.log('selectedGst',selectedGst)
    },[selectedGst])

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        console.log('itemData')
        console.log(cartItems)

        try {
            const orderItems = [];

            for (const itemId in cartItems) {
                const itemData = cartItems[itemId];
                const { productData, sizes } = itemData;

                if (productData && sizes) {
                    for (const size in sizes) {
                        const quantity = sizes[size];
                        if (quantity > 0) {
                            orderItems.push({
                                ...productData,
                                size,
                                quantity
                            });
                        }
                    }
                }
            }
            console.log('selectedGst')
            console.log(selectedGst)
            const orderData = {
                address: formData,
                items: orderItems,
                amount: getCartAmount(),
                gstDetails: selectedGst 
            };

            if (method === 'cod') {
                const response = await axios.post(
                    `${backendUrl}/api/order/place`,
                    orderData,
                    { headers: { token } }
                );

                if (response.data.success) {
                    setCartItems({});
                    navigate('/orders');
                } else {
                    toast.error(response.data.message);
                }
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };


    const handleSelect = (gst) => {
        setSelectedGst(gst);
        setIsOpen(false);
    };

    useEffect(() => {
        console.log(GstLIST)
    }, [GstLIST])

    return (
        <>
            
            <form
                onSubmit={onSubmitHandler}
                className="container m-auto flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t"
            >
                {/* ------------- Left Side ---------------- */}
                <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
                <div className="container">
                <div className="container  max-w-md  p-4">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">Select GST Details</h2>
                    <div className="relative">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="w-full p-2 bg-white border border-gray-300 rounded-md shadow-sm text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            {selectedGst ? (
                                <span>{selectedGst.gstNumber} - {selectedGst.legalName}</span>
                            ) : (
                                <span className="text-gray-400">Select GST details</span>
                            )}
                        </button>
                        <AnimatePresence>
                            {isOpen && (
                                <motion.ul
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
                                >
                                    {GstLIST && GstLIST.length > 0 ? (
                                        GstLIST.map((gst) => (
                                            <motion.li
                                                key={gst._id}
                                                whileHover={{ backgroundColor: '#f3f4f6' }}
                                                onClick={() => handleSelect(gst)}
                                                className="p-2 cursor-pointer hover:bg-gray-100"
                                            >
                                                <span className="font-medium">{gst.gstNumber}</span> - {gst.legalName}
                                                {gst.isSEZ && <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">SEZ</span>}
                                            </motion.li>
                                        ))) : ('<li>No GST accounts available</li>')}
                                </motion.ul>
                            )}
                        </AnimatePresence>
                    </div>
                    {selectedGst && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-4 p-4 border border-gray-300 rounded-md bg-white shadow-sm"
                        >
                            <h3 className="text-lg font-semibold mb-2 text-gray-800">Selected GST Details:</h3>
                            <p><strong>GST Number:</strong> {selectedGst.gstNumber}</p>
                            <p><strong>Legal Name:</strong> {selectedGst.legalName}</p>
                            <p><strong>Billing Address:</strong> {selectedGst.billingAddress}</p>
                            <p><strong>SEZ:</strong> {selectedGst.isSEZ ? 'Yes' : 'No'}</p>
                        </motion.div>
                    )}
                </div>
            </div>

                    <div className="text-xl sm:text-2xl my-3">
                        <Title text1={'SHIPPING'} text2={'ADDRESS'} />
                    </div>
                    <div className="flex gap-3">
                        <input
                            required
                            onChange={onChangeHandler}
                            name="firstName"
                            value={formData.firstName}
                            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                            type="text"
                            placeholder="First name"
                        />
                        <input
                            required
                            onChange={onChangeHandler}
                            name="lastName"
                            value={formData.lastName}
                            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                            type="text"
                            placeholder="Last name"
                        />
                    </div>
                    <input
                        required
                        onChange={onChangeHandler}
                        name="email"
                        value={formData.email}
                        className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                        type="email"
                        placeholder="Email address"
                    />
                    <input
                        required
                        onChange={onChangeHandler}
                        name="street"
                        value={formData.street}
                        className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                        type="text"
                        placeholder="Street"
                    />
                    <div className="flex gap-3">
                        <input
                            required
                            onChange={onChangeHandler}
                            name="city"
                            value={formData.city}
                            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                            type="text"
                            placeholder="City"
                        />
                        <input
                            onChange={onChangeHandler}
                            name="state"
                            value={formData.state}
                            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                            type="text"
                            placeholder="State"
                        />
                    </div>
                    <div className="flex gap-3">
                        <input
                            required
                            onChange={onChangeHandler}
                            name="zipcode"
                            value={formData.zipcode}
                            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                            type="number"
                            placeholder="Zipcode"
                        />
                        <input
                            required
                            onChange={onChangeHandler}
                            name="country"
                            value={formData.country}
                            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                            type="text"
                            placeholder="Country"
                        />
                    </div>
                    <input
                        required
                        onChange={onChangeHandler}
                        name="phone"
                        value={formData.phone}
                        className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                        type="number"
                        placeholder="Phone"
                    />
                </div>

                {/* ------------- Right Side ------------------ */}
                <div className="mt-8">
                    <div className="mt-8 min-w-80">
                        <CartTotal />
                    </div>

                    <div className="mt-12">
                        <Title text1={'PAYMENT'} text2={'METHOD'} />
                        <div className="flex gap-3 flex-col lg:flex-row">
                            <div
                                onClick={() => setMethod('cod')}
                                className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
                            >
                                <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-400' : ''}`}></p>
                                <p className="text-gray-500 text-sm font-medium mx-4">CASH ON DELIVERY</p>
                            </div>
                        </div>

                        <div className="w-full text-end mt-8">
                            <button
                                type="submit"
                                className="bg-black text-white px-16 py-3 text-sm relative"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <span className="opacity-0">PLACE ORDER</span>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
                                        </div>
                                    </>
                                ) : (
                                    'PLACE ORDER'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </form>

        </>
    );
};

export default PlaceOrder;
