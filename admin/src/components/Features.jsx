import React from 'react';
import { Leaf, ShieldCheck, Zap, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
    {
        icon: Leaf,
        title: "100% Natural",
        description: "Sourced directly from organic farms with zero artificial preservatives."
    },
    {
        icon: ShieldCheck,
        title: "Quality Assured",
        description: "Lab tested for purity, potency, and safety standards."
    },
    {
        icon: Zap,
        title: "Energy Boost",
        description: "Designed to provide sustained energy release throughout the day."
    },
    {
        icon: Heart,
        title: "Heart Healthy",
        description: "Low cholesterol and rich in heart-friendly nutrients."
    }
];

const Features = () => {
    return (
        <section className="py-20 bg-gray-50" id="about">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Why Choose NutriMix?</h2>
                    <p className="text-gray-600 text-lg">Backed by science, powered by nature. Here is what makes our blend special.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 group"
                        >
                            <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <feature.icon className="w-7 h-7 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                            <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
