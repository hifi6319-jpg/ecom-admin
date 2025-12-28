import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Features from '../components/Features';
import { motion } from 'framer-motion';

const About = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-white font-sans">
            <Navbar />

            <main className="pt-24 pb-20">
                {/* Hero Section */}
                <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-20">
                    <div className="text-center max-w-4xl mx-auto">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl sm:text-6xl font-extrabold text-gray-900 mb-6 leading-tight"
                        >
                            Revolutionizing Health, <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-500">
                                One Spoon at a Time.
                            </span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl text-gray-600 leading-relaxed"
                        >
                            Founded in 2025, NutriMix was born from a simple belief: healthy living shouldn't be complicated. We combine ancient wisdom with modern science to create powerful, natural blends that fit seamlessly into your busy lifestyle.
                        </motion.p>
                    </div>
                </section>

                {/* Image / Story Image */}
                <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="relative w-full h-[400px] sm:h-[500px] rounded-3xl overflow-hidden shadow-2xl"
                    >
                        <div className="absolute inset-0 bg-gray-900/30 z-10"></div>
                        <img
                            src="/original_images/Health_mix_1.webp"
                            alt="NutriMix Ingredients"
                            className="w-full h-full object-cover object-center"
                        />
                        <div className="absolute inset-0 z-20 flex items-center justify-center">
                            <div className="bg-white/90 backdrop-blur-md px-8 py-6 rounded-2xl shadow-xl max-w-lg text-center mx-4">
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Our Promise</h3>
                                <p className="text-gray-700">No fillers. No artificial nasties. Just 100% pure, potent, and delicious superfoods verified by science.</p>
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* Our Values / Features */}
                <Features />

                {/* Team / Mission Section */}
                <section className="container mx-auto px-4 sm:px-6 lg:px-8 mt-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div>
                            <span className="text-green-600 font-bold tracking-wider uppercase text-sm mb-2 block">Our Mission</span>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Empowering Your Daily Rituals</h2>
                            <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                                We believe that consistency is the key to long-term health. That's why we obsess over taste and convenience just as much as nutrition. Whether you're a busy parent, an athlete, or just someone looking to feel better, NutriMix is designed to work for you.
                            </p>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                Every batch is tested for purity and potency, ensuring that what you put in your body is exactly what nature intended—nothing more, nothing less.
                            </p>
                        </div>
                        <div className="bg-green-50 rounded-3xl p-8 sm:p-12 relative overflow-hidden">
                            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-green-200 rounded-full opacity-50 blur-3xl"></div>
                            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-teal-200 rounded-full opacity-50 blur-3xl"></div>

                            <div className="relative z-10 space-y-6">
                                <div className="flex items-center gap-4">
                                    <h3 className="text-5xl font-extrabold text-green-600">10k+</h3>
                                    <p className="text-gray-700 font-medium">Happy Customers <br /> Worldwide</p>
                                </div>
                                <div className="h-px bg-green-200 w-full"></div>
                                <div className="flex items-center gap-4">
                                    <h3 className="text-5xl font-extrabold text-green-600">50+</h3>
                                    <p className="text-gray-700 font-medium">Partner Organic <br /> Farms</p>
                                </div>
                                <div className="h-px bg-green-200 w-full"></div>
                                <div className="flex items-center gap-4">
                                    <h3 className="text-5xl font-extrabold text-green-600">100%</h3>
                                    <p className="text-gray-700 font-medium">Satisfaction <br /> Guarantee</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default About;
