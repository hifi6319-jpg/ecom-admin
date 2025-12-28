import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Disable body scroll when menu is open
    React.useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMenuOpen]);

    return (
        <nav className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${isMenuOpen ? 'bg-white' : 'bg-white/95 backdrop-blur-md'} shadow-sm`}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-500">
                            NutriMix Admin
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex space-x-8 items-center">
                        {/* Admin specific links can go here */}
                    </div>

                    {/* Icons */}
                    <div className="flex items-center space-x-4">
                        {/* Mobile Menu Button */}
                        <div className="md:hidden">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="p-2 text-gray-600 hover:text-green-600 transition-colors"
                            >
                                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay & Drawer */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        {/* Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => setIsMenuOpen(false)}
                            className="fixed inset-0 bg-black/60 z-[40] backdrop-blur-sm md:hidden"
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
                            className="fixed top-0 right-0 bottom-0 w-[80%] max-w-[300px] bg-white z-[60] shadow-2xl flex flex-col md:hidden"
                        >
                            <div className="p-5 flex items-center justify-between border-b border-gray-100 bg-white">
                                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-500">
                                    Menu
                                </span>
                                <button
                                    onClick={() => setIsMenuOpen(false)}
                                    className="p-2 -mr-2 text-gray-500 hover:text-red-500 transition-colors rounded-full hover:bg-red-50"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2 bg-white">
                                <p className="text-center text-gray-400 italic mt-8">Admin Panel</p>
                            </div>

                            <div className="p-6 bg-gray-50 mt-auto border-t border-gray-100">
                                <p className="text-center text-xs font-medium text-gray-400">
                                    © 2025 NutriMix Inc.
                                </p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
