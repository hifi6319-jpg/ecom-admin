import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import ProductGrid from '../components/ProductGrid';
import Footer from '../components/Footer';
import { products } from '../data';
import { useLocation } from 'react-router-dom';

const Home = () => {
    const featuredProducts = products.filter(p => p.category === 'featured');
    const bestsellingProducts = products.filter(p => p.category === 'bestselling');

    // Handle scroll to hash specifically for home page loads
    const { hash } = useLocation();

    useEffect(() => {
        if (hash) {
            const element = document.getElementById(hash.replace('#', ''));
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            window.scrollTo(0, 0);
        }
    }, [hash]);

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <Hero />
            <Features />
            <ProductGrid title="Featured Collection" products={featuredProducts} id="featured" />
            <ProductGrid title="Best Sellers" products={bestsellingProducts} id="bestsellers" />
            <Footer />
        </div>
    );
};

export default Home;
