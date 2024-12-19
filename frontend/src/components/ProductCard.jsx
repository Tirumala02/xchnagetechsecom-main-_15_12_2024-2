import React, { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';

const ProductCard = ({ item, id, image, name, price }) => {
  const { addToCart, updateQuantity, cartItems } = useContext(ShopContext);
  const [isFavorited, setIsFavorited] = useState(false);

  const [quantity, setQuantity] = useState(() => {
    const productInCart = cartItems[id];
    return productInCart ? Object.values(productInCart).reduce((sum, qty) => sum + qty, 0) : 0;
  });

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
  };

  const formatPrice = (price) => {
    return price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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
    addToCart(item, 'default', 1);
  };

  return (
    <div className="bg-white rounded-lg m-3 shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <div className="relative">
        <Link
          onClick={() => window.scrollTo(0, 0)}
          to={`/product/${id}`}
          className="block aspect-square overflow-hidden"
        >
          <img
            className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
            src={image}
            alt={name}
          />
        </Link>
        <button
          className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-sm hover:shadow-md transition-shadow"
          onClick={toggleFavorite}
        >
          {isFavorited ? (
            <AiFillHeart className="text-red-500 text-xl" />
          ) : (
            <AiOutlineHeart className="text-gray-500 text-xl" />
          )}
        </button>
      </div>
      <div className="p-4">
        <Link to={`/product/${id}`} className="block mb-2">
          <h3 className="text-lg font-semibold line-clamp-1 hover:text-blue-600 transition-colors">
            {name}
          </h3>
        </Link>
        <p className="text-2xl font-bold text-green-600 mb-4">{`₹${formatPrice(price)}`}</p>
        {quantity > 0 ? (
          <div className="flex items-center justify-between">
            <button
              onClick={handleDecrease}
              className="bg-white text-gray-700 px-3 py-1 rounded-md hover:bg-[#fffafa] transition-colors"
            >
              -
            </button>
            <span className="text-lg font-semibold">{quantity}</span>
            <button
              onClick={handleIncrease}
              className="bg-white text-gray-700 px-3 py-1 rounded-md hover:bg-[#fffafa] transition-colors"
            >
              +
            </button>
          </div>
        ) : (
          <button
            onClick={handleAddToCart}
            className="w-full bg-yellow-400 text-gray-900 py-2 rounded-md text-lg font-semibold hover:bg-yellow-500 transition-colors duration-300"
          >
            ADD TO CART
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;

