import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { products } from '../data';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductGrid from '../components/ProductGrid';
import { useCart } from '../context/CartContext';
import { Star, ShoppingBag, ArrowLeft, CheckCircle, Leaf, Utensils, MessageCircle, Minus, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const ProductDetails = () => {
    const { id } = useParams();
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);

    // Ensure scroll to top on page navigation
    useEffect(() => {
        window.scrollTo(0, 0);
        setQuantity(1);
    }, [id]);

    const product = products.find((p) => p.id === parseInt(id));

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl">Product not found.</p>
                <Link to="/" className="text-green-600 underline ml-2">Go back home</Link>
            </div>
        );
    }

    const similarProducts = products.filter(p => p.id !== product.id);

    const generateWhatsAppLink = () => {
        const phoneNumber = "91XXXXXXXXXX"; // Replace with actual shop number
        const total = product.price * quantity;
        const message = `Hi, I want to order:
Product: ${product.name}
Quantity: ${quantity}
Price: ₹${product.price} each
Total: ₹${total}
Delivery Location: [Type your location]

Please share payment details.`;

        const encodedMessage = encodeURIComponent(message);
        return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Navbar />

            <main className="pt-24 pb-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Breadcrumbs / Back */}
                    <Link to="/" className="inline-flex items-center text-gray-500 hover:text-green-600 transition-colors mb-8 group">
                        <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Shop
                    </Link>

                    {/* Product Main Section */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-16">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">

                            {/* Image Section */}
                            <div className="bg-gray-100 p-8 lg:p-16 flex items-center justify-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-teal-50/50" />
                                <motion.img
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5 }}
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full max-w-md object-contain z-10 drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                                />
                            </div>

                            {/* Details Section */}
                            <div className="p-8 lg:p-12 flex flex-col justify-center">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider rounded-full">
                                        {product.category}
                                    </span>
                                    <div className="flex items-center text-yellow-400 gap-1 bg-yellow-50 px-2 py-1 rounded-full">
                                        <Star className="w-3.5 h-3.5 fill-current" />
                                        <span className="text-xs font-bold text-gray-700">{product.rating}</span>
                                        <span className="text-gray-400 text-xs">({product.reviews} reviews)</span>
                                    </div>
                                </div>

                                <h1 className="text-3xl lg:text-5xl font-extrabold text-gray-900 mb-4 lh-tight">{product.name}</h1>
                                <p className="text-gray-600 text-lg mb-8 leading-relaxed max-w-lg">{product.description}</p>

                                <div className="flex items-end gap-6 mb-10">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Total Price</p>
                                        <div className="flex items-center gap-3">
                                            <p className="text-4xl font-bold text-green-600">₹{product.price}</p>
                                            <p className="text-xl text-gray-400 line-through decoration-gray-400/50">₹{product.originalPrice}</p>
                                        </div>
                                    </div>
                                    <div className="h-10 w-px bg-gray-200"></div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Pack Size</p>
                                        <p className="text-xl font-bold text-gray-900">500g</p>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                                    {/* Quantity Selector */}
                                    <div className="flex items-center bg-gray-100 rounded-xl px-4 py-2 w-max">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                                        >
                                            <Minus className="w-4 h-4 text-gray-600" />
                                        </button>
                                        <span className="font-bold text-lg w-12 text-center">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                                        >
                                            <Plus className="w-4 h-4 text-gray-600" />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <a
                                        href={generateWhatsAppLink()}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 py-4 bg-green-500 text-white rounded-xl font-bold text-lg shadow-xl hover:bg-green-600 hover:shadow-green-500/30 transition-all flex items-center justify-center gap-3 group"
                                    >
                                        Buy on WhatsApp
                                        <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                    </a>

                                    <button
                                        onClick={() => addToCart({ ...product, quantity })}
                                        className="flex-1 py-4 bg-gray-900 text-white rounded-xl font-bold text-lg shadow-xl hover:bg-gray-800 transition-all flex items-center justify-center gap-3 group"
                                    >
                                        Add to Cart
                                        <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    </button>
                                </div>

                                <div className="mt-8 pt-8 border-t border-gray-100 grid grid-cols-2 gap-4">
                                    {product.specs?.slice(0, 4).map((spec, i) => (
                                        <div key={i} className="flex items-center text-sm text-gray-600">
                                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                                            {spec}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Ingredients & Uses Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                        {/* Ingredients */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                                    <Leaf className="w-6 h-6" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Premium Ingredients</h2>
                            </div>
                            <ul className="space-y-4">
                                {product.ingredients?.map((ing, idx) => (
                                    <li key={idx} className="flex items-start">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2.5 mr-3 flex-shrink-0" />
                                        <span className="text-gray-700 text-lg">{ing}</span>
                                    </li>
                                )) || <p className="text-gray-500">Ingredient information not available.</p>}
                            </ul>
                        </div>

                        {/* Uses */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
                                    <Utensils className="w-6 h-6" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">How to Use</h2>
                            </div>
                            <ul className="space-y-4">
                                {product.uses?.map((use, idx) => (
                                    <li key={idx} className="flex items-start">
                                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2.5 mr-3 flex-shrink-0" />
                                        <span className="text-gray-700 text-lg">{use}</span>
                                    </li>
                                )) || <p className="text-gray-500">Usage information not available.</p>}
                            </ul>
                        </div>
                    </div>

                    {/* Similar Products */}
                    <ProductGrid title="Similar Products" products={similarProducts.slice(0, 4)} id="similar" />

                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ProductDetails;
