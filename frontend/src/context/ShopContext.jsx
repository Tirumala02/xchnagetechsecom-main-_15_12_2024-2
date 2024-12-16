import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios'

export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const currency = '₹';
    const delivery_fee = 10;
    // const backendUrl = "https://xchnagetechsecom-back.onrender.com"
    // const backendUrl = "https://xchnagetechsecom-backend.onrender.com"
    const backendUrl = "http://localhost:4000"
    const [userDetails, setUserDetails] = useState({});
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [products, setProducts] = useState([]);
    const [allAddedProducts, setAllAddedProducts] = useState([]);
    const [productDetail, setProductDetail] = useState(null);

    const [gstForm, setGstForm] = useState({
        gstNumber: "",
        legalName: "",
        billingAddress: "",
        isSEZ: false,
        registrationDate: "",
      });
      
    const [token, setToken] = useState('')

    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();


    
    // const profileDetails = async (token) => {
    //     setUseItreator(iterator+1)
    //     console.log(iterator)
    //     try {
    //         const response = await axios.post(
    //             backendUrl + `/api/user/profile`,
    //             {},
    //             { headers: { token } }
    //         );
    
    //         if (response.data.success) {
    //             setUserDetails(response.data.user); // Ensure response structure matches
    //             setUseItreator(iterator+1)
    //             console.log(iterator)
    //         } else {
    //             setUseItreator(iterator+1)
    //             console.log(iterator)
    //             toast.error(response.data.message || "Failed to fetch profile details.");
    //         }
    //     } catch (error) {
    //         console.error("Error fetching user details:", error);
    //         toast.error("Error fetching profile details. Please try again later.");
    //     }
    // };
    
    const profileDetails = async (token) => {
        //Didnt work though, used the setUserdetails in th getUserCart function in frontend and backend to get use details;
        try {
            const response = await axios.post(
                backendUrl + `/api/user/profile`,
                {},
                { headers: { token } }
            );
    
            console.log("Profile Details Response:", response.data);
    
            if (response.data.success && response.data) {
                setUserDetails(response.data);
                console.log("User Details Set:", response.data);
            } else {
                console.error("Failed to fetch user details:", response.data.message);
                toast.error(response.data || "Failed to fetch profile details.");
            }
        } catch (error) {
            console.error("Error fetching user details:", error.response ? error.response.data : error.message);
            toast.error("Error fetching profile details. Please try again later.");
        }
    };

    const addToCart = async (productData, size = 'default') => {
        setAllAddedProducts([...allAddedProducts, productData]);
        console.log('addtocart',productData)
        let cartData = structuredClone(cartItems);
        const itemId = productData._id || productData.asin;

        if (!cartData[itemId]) {
            cartData[itemId] = { productData, sizes: {} }; // Initialize item with productData and sizes
        }

        if (cartData[itemId].sizes[size]) {
            cartData[itemId].sizes[size] += 1;
        } else {
            cartData[itemId].sizes[size] = 1;
        }

        setCartItems(cartData);

        if (token) {
            try {
                await axios.post(
                    backendUrl + '/api/cart/add',
                    { itemId, size, productData },
                    { headers: { token } }
                );
                toast.success('Product added to cart');
            } catch (error) {
                console.error(error);
                toast.error(error.message);
            } finally {
            }
        }
    };




    const getCartCount = () => {
        let totalCount = 0;

        for (const itemId in cartItems) {
            const item = cartItems[itemId];
            if (item?.sizes) {
                for (const size in item.sizes) {
                    try {
                        const quantity = item.sizes[size];
                        if (quantity > 0) {
                            totalCount += quantity;
                        }
                    } catch (error) {
                        console.error('Error calculating cart count:', error);
                    }
                }
            }
        }

        return totalCount;
    };


    const updateQuantity = async (itemId, size, quantity) => {

        // Clone the current cart
        let cartData = structuredClone(cartItems);

        // Ensure the itemId key exists
        if (!cartData[itemId]) {
            cartData[itemId] = { productData: {}, sizes: {} };
        }

        // Ensure the sizes object exists for this itemId
        if (!cartData[itemId].sizes) {
            cartData[itemId].sizes = {};
        }

        // Update the size key within sizes
        cartData[itemId].sizes[size] = quantity;

        // Remove the size entry if quantity is zero to clean up the data
        if (quantity === 0) {
            delete cartData[itemId].sizes[size];

            // Remove the item entirely if no sizes remain
            if (Object.keys(cartData[itemId].sizes).length === 0) {
                delete cartData[itemId];
            }
        }

        // Update state
        setCartItems(cartData);

        // Sync with backend if a token exists
        if (token) {
            try {
                await axios.post(
                    backendUrl + '/api/cart/update',
                    { itemId, size, quantity },
                    { headers: { token } }
                );
            } catch (error) {
                console.error(error);
                toast.error(error.message);
            } finally {
            }
        }
    };



    const getCartAmount = () => {
        let totalAmount = 0;

        for (const itemId in cartItems) {
            const itemData = cartItems[itemId];

            // Extract product data and sizes
            const productData = itemData.productData;
            const sizes = itemData.sizes;

            if (!productData || !sizes) continue; // Skip if product data or sizes are missing

            for (const size in sizes) {
                const quantity = sizes[size];
                try {
                    if (quantity > 0) {
                        // Calculate total amount with proper parsing and multiplication
                        const price = parseFloat(
                            productData.price_upper?.$numberInt || productData.price_upper || productData.price
                        ) || 0;
                        totalAmount += price * quantity;
                    }
                } catch (error) {
                    console.error(`Error calculating total amount for item ${itemId}:`, error);
                }
            }
        }

        // Ensure the total amount is formatted to two decimal points
        return parseFloat(totalAmount.toFixed(2));
    };



    const getProductsData = async () => {
        try {
            setIsLoading(true)
            const response = await axios.get(backendUrl + '/api/product/list')
            if (response.data.success) {
                setProducts(response.data.products.reverse())
            } else {
                toast.error(response.data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
        finally {
            setIsLoading(false)
        }
    }

    const fetchValueChanger = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/admin/value-changer`);
            if (response.data.success) {
                const data = (response.data.values);
                console.log(data)
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    };



    const getSearchResults = async (query) => {
        setIsLoading(true)
        try {
            const response = await axios.get(`${backendUrl}/api/product/results?query=${query}`);
            if (response.data.success) {
                const results = response.data.results;
                setProducts(results); // State update
                return results
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
        finally {
            setIsLoading(false)
        }
    };

    const getSearchProduct = async (query) => {
        try {
            setIsLoading(true)
            console.log("in getSearchProduct ");

            const response = await axios.get(`${backendUrl}/api/product/product-details?query=${query}`);

            console.log(response.data);

            if (response.data.success) {
                const results = response.data.results;
                console.log("Processing results:", results);
                setProductDetail(results); // State update
                // toast.success("Product details fetched");
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            // toast.error(error.message);
        }
        finally {
            setIsLoading(false)
        }
    };


    const getUserCart = async (token) => {
        try {
            setIsLoading(true)
            const response = await axios.post(backendUrl + '/api/cart/get', {}, { headers: { token } })
            console.log(response.data)
            if (response.data.success) {
                setCartItems(response.data.cartData)
                setUserDetails(response.data.userData)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
        finally {
            setIsLoading(false)
        }
    }

    const raiseTicket = async (form) => {
        if (token) {
            console.log(form)
            try {
                const response = await axios.post(
                    `${backendUrl}/api/raise-ticket`,
                    { form },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`, // Send the token in Authorization header
                            'Content-Type': 'multipart/form-data', // Necessary for sending FormData
                        },
                    }
                );

                return { success: true, message: 'Form submitted successfully', data: response.data };
            } catch (error) {
                // Axios provides `error.response` for server errors
                const errorMessage = error.response?.data?.message || error.message;
                return { success: false, message: errorMessage };
            }
        } else {
            return { success: false, message: 'User is not authenticated.' };
        }
    };


    useEffect(() => {
        getProductsData()
    }, [])


    useEffect(() => {
        if (!token && localStorage.getItem('token')) {
            setToken(localStorage.getItem('token'))
            getUserCart(localStorage.getItem('token'))
            profileDetails(localStorage.getItem('token'))
        }
        if (token) {
            getUserCart(token)
            profileDetails(token)

        }
    }, [token,setUserDetails])

    const value = {
        isLoading, setIsLoading,
        profileDetails, userDetails,
        gstForm,setGstForm,
        products, currency, delivery_fee,
        search, setSearch, showSearch, setShowSearch,
        getSearchResults, getSearchProduct, productDetail, setProductDetail, fetchValueChanger, raiseTicket,
        cartItems, addToCart, setCartItems,
        getCartCount, updateQuantity,
        getCartAmount, navigate, backendUrl,
        setToken, token
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )

}

export default ShopContextProvider;
