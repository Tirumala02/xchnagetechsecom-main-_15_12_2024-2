

import React, { useContext, useState, useEffect } from 'react';
import { assets } from '../assets/assets'
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiUser, FiShoppingCart, FiMenu, FiX } from 'react-icons/fi';
import { ShopContext } from '../context/ShopContext';

const Navbar = () => {
    const [visible, setVisible] = useState(false);
    const [showSearch, setShowSearch] = useState(true);
    const [search, setSearch] = useState('');

    const { getCartCount, navigate, token, setToken, setCartItems, getSearchResults } = useContext(ShopContext);
    let click = true
    const logout = () => {
        navigate('/login')
        localStorage.removeItem('token')
        setToken('')
        setCartItems({})
    }



    const handleSearch = (e) => {
        e.preventDefault();
        if (search.trim()) {
            // Implement your search logic here
            console.log('Searching for:', search);
            getSearchResults(search)
            // For example: navigate to search results page
        }
    };

    useEffect(() => {
        // Check if current path includes 'collection' and set showSearch accordingly
        const path = window.location.pathname;
        setShowSearch(path.includes('collection'));
    }, []);

    return (
        <nav className="bg-gray-900 text-gray-200">
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    <a href="/" className="text-2xl font-bold"><img src={assets.logo} className='w-48' alt="" /></a>

                    <div className="hidden md:flex items-center space-x-4">
                        <NavLink href="/">HOME</NavLink>
                        <NavLink href="/collection">COLLECTION</NavLink>
                        <NavLink href="/about">ABOUT</NavLink>
                        <NavLink href="/contact">CONTACT</NavLink>
                    </div>

                    <div className="realtive flex items-center space-x-4">
                        <AnimatePresence>
                            {showSearch && (
                                <motion.form
                                    initial={{ width: 0, opacity: 0 }}
                                    animate={{ width: 'auto', opacity: 1 }}
                                    exit={{ width: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    onSubmit={handleSearch}
                                    className=" absolute w-full -translate-x-1/2 translate-y-12 sm:relative sm:translate-x-0 sm:translate-y-0"
                                >
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Search"
                                        className="bg-gray-800 text-white rounded-full py-1 px-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button
                                        type="submit"
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                                    >
                                        <FiSearch className="w-4 h-4 text-gray-400" />
                                    </button>
                                </motion.form>
                            )}
                        </AnimatePresence>

                        <button
                            onClick={() => {
                                setShowSearch(!showSearch);
                                if (!window.location.pathname.includes('collection')) {
                                    // Redirect to collection page
                                    window.location.href = '/collection';
                                }
                            }}
                            className="p-1 rounded-full hover:bg-gray-800 transition-colors duration-200"
                        >
                            <FiSearch className="w-5 h-5" />
                        </button>

                        <div className='flex items-center gap-6 z-10'>

                            <div className='group relative'>
                                <img onClick={() => token ? null : navigate('/login')} className='w-5 cursor-pointer invert ' src={assets.profile_icon} alt="" />
                                {/* Dropdown Menu */}
                                {token &&
                                    <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4'>
                                        <div className='flex flex-col gap-2 w-36 py-3 px-5  bg-slate-100 text-gray-500 rounded'>
                                            <p onClick={() => navigate('/profile')} className='cursor-pointer hover:text-black'>My Profile</p>
                                            <p onClick={() => navigate('/orders')} className='cursor-pointer hover:text-black'>Orders</p>
                                            <p onClick={logout} className='cursor-pointer hover:text-black'>Logout</p>
                                        </div>
                                    </div>}
                            </div>
                            <a href='/cart' className='relative'>
                                <img src={assets.cart_icon} className='w-5 min-w-5  invert' alt="" />
                                <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-white text-black aspect-square rounded-full text-[8px]'>{getCartCount()}</p>
                            </a>
                            <img onClick={() => setVisible(true)} src={assets.menu_icon} className='w-5 cursor-pointer sm:hidden  invert' alt="" />
                        </div>

                    
                        <button
                            onClick={() => setVisible(true)}
                            className="md:hidden p-1 rounded-full hover:bg-gray-800 transition-colors duration-200"
                        >
                            <FiMenu className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile sidebar */}
            <AnimatePresence>
                {visible && (
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'tween' }}
                        className="fixed inset-y-0 right-0 w-64 bg-white shadow-lg z-50"
                    >
                        <div className="flex flex-col h-full">
                            <div className="flex items-center justify-between p-4 border-b">
                                <button onClick={() => setVisible(false)} className="text-gray-500 hover:text-gray-700">
                                    <FiX className="w-4 h-4" />
                                </button>
                                <span className="text-lg font-semibold">Menu</span>
                            </div>
                            <div className="flex flex-col py-4">
                                <MobileNavLink href="/" onClick={() => setVisible(false)}>HOME</MobileNavLink>
                                <MobileNavLink href="/collection" onClick={() => setVisible(false)}>COLLECTION</MobileNavLink>
                                <MobileNavLink href="/about" onClick={() => setVisible(false)}>ABOUT</MobileNavLink>
                                <MobileNavLink href="/contact" onClick={() => setVisible(false)}>CONTACT</MobileNavLink>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

const NavLink = ({ href, children }) => {
    const isActive = window.location.pathname === href;

    return (
        <a href={href} className="relative group py-2 px-1">
            {children}
            <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 transform origin-left transition-all duration-300 ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
        </a>
    );
};

const MobileNavLink = ({ href, onClick, children }) => (
    <a href={href} className="py-2 px-4 text-gray-800 hover:bg-gray-100 transition-colors duration-200" onClick={onClick}>
        {children}
    </a>
);

export default Navbar;

