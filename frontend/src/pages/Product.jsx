
import React, { useState, useContext, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShopContext } from '../context/ShopContext';
import RelatedProducts from '../components/RelatedProducts';
import Loader from '../components/Loader';

const Product = () => {
  const location = useLocation();
  const { productId } = useParams();
  const { link } = location.state || {};
  const { products, currency, addToCart, cartItems, updateQuantity, getSearchProduct, productDetail, isLoading, setIsLoading } = useContext(ShopContext);

  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [amazonProduct, setAmazonProduct] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const id = productId;
  const [quantity, setQuantity] = useState(() => {
    const productInCart = cartItems[id];
    return productInCart ? Object.values(productInCart).reduce((sum, qty) => sum + qty, 0) : 0;
  });

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const incrementDate = (dateString) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 3);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  };

  const handleIncrease = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    updateQuantity(id, 'default', newQuantity);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      updateQuantity(id, 'default', newQuantity);
    } else {
      setQuantity(0);
      updateQuantity(id, 'default', 0);
    }
  };

  const handleAddToCart = () => {
    setQuantity(1);
    addToCart(productDetail || productData, 'default', 1);
  };
  
  // Format price
  const formatPrice = (price) => {
    return price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const fetchProductData = async () => {
    setIsLoading(true);
    let foundProduct = false;

    products.forEach((item) => {
      if (item._id === productId) {
        setProductData(item);
        setImage(item.image[0]);
        foundProduct = true;
      }
    });

    if (!foundProduct) {
      await getSearchProduct(link);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchProductData();
  }, [productId, products]);

  useEffect(() => {
    if (amazonProduct) {
      getSearchProduct(productId);
    }
  }, [amazonProduct]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center bg-gray-200">
        <Loader />
      </div>
    );
  }

  const renderProductDetails = (product) => (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-lg border">
            <img
              src={product.images[selectedImage]}
              alt="Product image"
              className="object-contain w-full h-full"
            />
          </div>
          <div className="grid grid-cols-5 gap-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative aspect-square overflow-hidden rounded-md border ${selectedImage === index ? 'ring-2 ring-black' : ''}`}
              >
                <img
                  src={image}
                  alt={`Product thumbnail ${index + 1}`}
                  className="object-contain w-full h-full"
                />
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <h1 className="text-2xl md:text-3xl font-bold">{product.title}</h1>
          <div className="space-y-2">
            <p className="text-3xl font-bold">₹{product.price}</p>
            <p className="text-green-600">
              Delivery by {(product.delivery)}
            </p>
          </div>
          {quantity > 0 ? (
            <div className="flex items-center gap-3">
              <button
                onClick={handleDecrease}
                className="bg-gray-300 text-black px-3 py-1 rounded-md"
              >
                -
              </button>
              <span className="text-lg font-semibold">{quantity}</span>
              <button
                onClick={handleIncrease}
                className="bg-gray-300 text-black px-3 py-1 rounded-md"
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              className="bg-yellow-400 text-gray-900 px-6 py-2 rounded text-sm font-semibold hover:bg-yellow-500 transition-colors duration-300 w-fit"
            >
              ADD TO CART
            </button>
          )}
          {product.description && (
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Description</h2>
              <p>{product.description}</p>
            </div>
          )}
          <div className="space-y-4">
            <div className="overflow-hidden">
              <table className="w-full border-collapse border border-gray-300">

                <tbody>
                  <AnimatePresence>
                    {product.productDetails && (
                      (<h2 className="text-xl font-semibold my-2">Product Details</h2>) &&

                      Object.entries(product.productDetails)
                        .slice(0, isExpanded ? undefined : 7)
                        .map(([key, value], index) => (
                          <motion.tr
                            key={key}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2, delay: index * 0.05 }}
                            className="even:bg-gray-50"
                          >
                            <td className="px-4 py-2 border text-gray-800 font-medium">{key}</td>
                            <td className="px-4 py-2 border text-gray-600">
                              {Array.isArray(value) ? value.join(', ') : value}
                            </td>
                          </motion.tr>
                        )))}
                  </AnimatePresence>
                </tbody>
              </table>
              {Object.keys(product.productDetails).length > 7 && (
                <div className="mt-4 text-center">
                  <button
                    onClick={toggleExpand}
                    className="inline-flex items-center border border-transparent text-sm font-medium rounded-md shadow-sm text-amber-500 hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {isExpanded ? (
                      <>
                        Show less
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                      </>
                    ) : (
                      <>
                        Show more
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
          <div>
            <h1 className='text-xl font-semibold my-2'>About this product</h1>
            <ul className="space-y-2">
                {product.aboutThisItem.map((point, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-gray-600">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      {productData ? (
        <>
          <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
            <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
              <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
                {productData.image.map((item, index) => (
                  <img
                    onClick={() => setImage(item)}
                    src={item}
                    key={index}
                    className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer rounded-md border"
                    alt=""
                  />
                ))}
              </div>
              <div className="w-full sm:w-[80%] object-contain px-2">
                <img className="w-full h-auto max-w-xl rounded-md object-contain border border-gray-300" src={image} alt="" />
              </div>
            </div>
            <div className="flex-1">
              <h1 className="font-bold text-3xl mt-2 text-gray-800">{productData.name}</h1>
              <p className="mt-5 text-3xl font-semibold text-gray-800">{currency}{formatPrice(productData.price)}</p>
              <p className="mt-5 text-gray-600">{productData.description}</p>
              <div className="mt-5 text-gray-600">
                <ul className="list-inside">
                  <li>Product Category: {productData.category}</li>
                </ul>
              </div>
              <br />
              {quantity > 0 ? (
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleDecrease}
                    className="bg-gray-300 text-black px-3 py-1 rounded-md"
                  >
                    -
                  </button>
                  <span className="text-lg font-semibold">{quantity}</span>
                  <button
                    onClick={handleIncrease}
                    className="bg-gray-300 text-black px-3 py-1 rounded-md"
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleAddToCart}
                  className="bg-yellow-400 text-gray-900 px-6 py-2 rounded text-sm font-semibold hover:bg-yellow-500 transition-colors duration-300 w-fit"
                >
                  ADD TO CART
                </button>
              )}
              <hr className="mt-8 sm:w-4/5" />
            </div>
          </div>
          <RelatedProducts category={productData.category} />
        </>
      ) : productDetail ? (
        renderProductDetails(productDetail)
      ) : null}
    </div>
  );
};

export default Product;

