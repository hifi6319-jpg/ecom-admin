import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-teal-400">
                            NutriMix
                        </h3>
                        <p className="text-gray-400 leading-relaxed">
                            Empowering your health journey with nature's finest ingredients. Premium quality, backed by science.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold mb-6 text-white">Shop</h4>
                        <ul className="space-y-4 text-gray-400">
                            <li><a href="#" className="hover:text-green-400 transition-colors">All Products</a></li>
                            <li><a href="#" className="hover:text-green-400 transition-colors">Best Sellers</a></li>
                            <li><a href="#" className="hover:text-green-400 transition-colors">New Arrivals</a></li>
                            <li><a href="#" className="hover:text-green-400 transition-colors">Discounts</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold mb-6 text-white">Company</h4>
                        <ul className="space-y-4 text-gray-400">
                            <li><a href="#" className="hover:text-green-400 transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-green-400 transition-colors">Contact</a></li>
                            <li><a href="#" className="hover:text-green-400 transition-colors">Careers</a></li>
                            <li><a href="#" className="hover:text-green-400 transition-colors">Privacy Policy</a></li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-lg font-bold mb-6 text-white">Newsletter</h4>
                        <p className="text-gray-400 mb-4">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
                        <div className="flex flex-col space-y-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-green-500 transition-colors"
                            />
                            <button className="bg-green-600 text-white px-4 py-3 rounded-lg font-bold hover:bg-green-700 transition-colors">
                                Subscribe
                            </button>
                        </div>
                    </div>

                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between text-gray-500 text-sm">
                    <p>&copy; 2025 NutriMix Inc. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white transition-colors">Instagram</a>
                        <a href="#" className="hover:text-white transition-colors">Twitter</a>
                        <a href="#" className="hover:text-white transition-colors">Facebook</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
