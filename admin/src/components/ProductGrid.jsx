import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useSearch } from '../context/SearchContext';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();

    return (
        <motion.div
            whileHover={{ y: -8 }}
            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 group relative"
        >
            <Link to={`/product/${product.id}`} className="block h-full">
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-900 shadow-sm flex items-center gap-1 z-10">
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        {product.rating}
                    </div>
                </div>

                <div className="p-6 pb-20">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h3>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description}</p>
                </div>
            </Link>

            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between z-20">
                <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-green-600">₹{product.price}</span>
                    <span className="text-sm text-gray-400 line-through">₹{product.originalPrice}</span>
                </div>

                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addToCart(product);
                    }}
                    className="p-3 bg-gray-900 text-white rounded-xl hover:bg-green-600 transition-colors shadow-lg hover:shadow-green-500/30 flex items-center justify-center gap-2 group/btn"
                >
                    <span className="text-sm font-semibold hidden sm:inline">Add</span>
                    <ShoppingBag className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                </button>
            </div>
        </motion.div>
    );
};

const ProductGrid = ({ title, products, id }) => {
    const { searchQuery, selectedCategory, setSelectedCategory } = useSearch();

    // Extract unique categories
    const categories = ['All', ...new Set(products.map(p => p.category || 'Other'))];

    // Filter products
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    return (
        <section className="py-20" id={id}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
                    <div>
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{title}</h2>
                        <div className="h-1 w-20 bg-green-500 rounded-full mb-6"></div>

                        {/* Categories */}
                        <div className="flex flex-wrap gap-2">
                            {categories.map(category => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === category
                                        ? 'bg-green-600 text-white shadow-md'
                                        : 'bg-white text-gray-600 border border-gray-200 hover:border-green-600 hover:text-green-600'
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                    <a href="#" className="hidden sm:block text-green-600 font-semibold hover:text-green-700 hover:underline">
                        View All Products
                    </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20 text-gray-500">
                            No products found matching your criteria.
                        </div>
                    )}
                </div>

                <div className="mt-8 text-center sm:hidden">
                    <a href="#" className="text-green-600 font-semibold hover:text-green-700 hover:underline">
                        View All Products
                    </a>
                </div>
            </div>
        </section>
    );
};

export default ProductGrid;
