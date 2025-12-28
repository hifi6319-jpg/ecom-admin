import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';

const Hero = () => {
    return (
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-green-50 to-transparent -z-10 rounded-l-[100px] opacity-60" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

                    <div className="w-full lg:w-1/2 space-y-8 text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="inline-block py-1 px-3 rounded-full bg-green-100 text-green-700 font-semibold text-sm mb-6">
                                #1 Voted Health Mix of 2025
                            </span>
                            <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 leading-tight">
                                Fuel Your Body <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-500">
                                    Naturally.
                                </span>
                            </h1>
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
                        >
                            Experience the perfect synergy of taste and health. Our premium mix is crafted to boost immunity, energy, and overall vitality without compromising on flavor.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
                        >
                            <button className="w-full sm:w-auto px-8 py-4 bg-gray-900 text-white rounded-full font-bold text-lg shadow-xl hover:bg-green-600 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
                                Shop Now <ArrowRight className="w-5 h-5" />
                            </button>
                            <a href="#featured" className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 border border-gray-200 rounded-full font-bold text-lg hover:border-gray-900 hover:bg-gray-50 transition-all duration-300 flex items-center justify-center">
                                Featured Products
                            </a>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="pt-8 flex items-center justify-center lg:justify-start gap-8"
                        >
                            <div className="flex -space-x-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-500">U{i}</div>
                                ))}
                            </div>
                            <div className="text-sm">
                                <div className="flex text-yellow-500 mb-1">
                                    <Star className="w-4 h-4 fill-current" />
                                    <Star className="w-4 h-4 fill-current" />
                                    <Star className="w-4 h-4 fill-current" />
                                    <Star className="w-4 h-4 fill-current" />
                                    <Star className="w-4 h-4 fill-current" />
                                </div>
                                <p className="font-semibold text-gray-900">1,000+ Happy Customers</p>
                            </div>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, x: 50 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="w-full lg:w-1/2 relative"
                    >
                        <div className="relative aspect-square max-w-md mx-auto lg:max-w-none">
                            <div className="absolute inset-0 bg-gradient-to-tr from-green-200 to-teal-100 rounded-full filter blur-3xl opacity-50 animate-pulse" />
                            <Link to="/product/1">
                                <img
                                    src="/original_images/Health_mix_1.webp"
                                    alt="Premium Health Mix Product"
                                    className="relative z-10 w-full h-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500 cursor-pointer"
                                />
                            </Link>

                            {/* Floating Cards */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                                className="absolute top-10 -left-6 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-xl z-20 hidden sm:block"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                        <span className="text-xl">🌿</span>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500 font-semibold">Natural</div>
                                        <div className="font-bold text-gray-900">100% Organic</div>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, 10, 0] }}
                                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                                className="absolute bottom-10 -right-6 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-xl z-20 hidden sm:block"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                        <span className="text-xl">⚡</span>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500 font-semibold">Energy</div>
                                        <div className="font-bold text-gray-900">Boost V2</div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default Hero;
