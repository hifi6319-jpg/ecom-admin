import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Download, FileText, CheckCircle, AlertCircle, Plus, LayoutDashboard, Package, History, Trash2, Edit2, X, Tag, Truck, Receipt, Copy, Search, User, Menu } from 'lucide-react';
import { io } from 'socket.io-client';

const Admin = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const [activeTab, setActiveTab] = useState('billing'); // billing, products, orders, coupons
    const [products, setProducts] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- Billing Form State (Professional) ---
    const [billingForm, setBillingForm] = useState({
        customerName: '', customerPhone: '',
        shippingAddress: '', billingAddress: '',
        selectedProductId: '', quantity: 1,
        shippingCharge: 0, discountAmount: 0,
        paymentMode: 'UPI',
        welcomeNote: 'Thank you for shopping with NutriMix Premium!',
        fromAddress: 'NutriMix Spices HQ, 123 Flavor Street, Spiceland, IND 620001'
    });
    const [invoiceGenerated, setInvoiceGenerated] = useState(false);

    // --- Product CMS State ---
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [productForm, setProductForm] = useState({
        name: '', price: '', originalPrice: '', salePrice: '', offerType: '',
        category: 'featured', image: '', description: '', specs: '', ingredients: '', uses: ''
    });

    // --- Coupon CMS State ---
    const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
    const [couponForm, setCouponForm] = useState({
        code: '', discountType: 'percentage', discountValue: '', minPurchase: 0
    });

    const fetchData = async () => {
        try {
            const [pRes, iRes, cRes] = await Promise.all([
                fetch(`${API_URL}/api/products`),
                fetch(`${API_URL}/api/invoices`),
                fetch(`${API_URL}/api/coupons`)
            ]);
            const [prods, invs, cups] = await Promise.all([pRes.json(), iRes.json(), cRes.json()]);
            setProducts(prods);
            setInvoices(invs);
            setCoupons(cups);
            if (!billingForm.selectedProductId && prods.length > 0) {
                setBillingForm(prev => ({ ...prev, selectedProductId: prods[0].id }));
            }
        } catch (err) { setError(err.message); }
        finally { setLoading(false); }
    };

    useEffect(() => {
        fetchData();
        const socket = io(API_URL);
        socket.on('products-updated', fetchData);
        socket.on('coupons-updated', fetchData);
        socket.on('invoices-updated', fetchData);
        return () => socket.disconnect();
    }, []);

    // Body Scroll Lock for Modals
    useEffect(() => {
        if (isProductModalOpen || isCouponModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isProductModalOpen, isCouponModalOpen]);

    // --- Autofill Logic ---
    const handleAutofill = (order) => {
        const matchingProduct = products.find(p => p.name === order.productName);
        setBillingForm({
            ...billingForm,
            customerName: order.customerName,
            customerPhone: order.customerPhone,
            shippingAddress: order.shippingAddress || '',
            billingAddress: order.billingAddress || '',
            selectedProductId: matchingProduct ? matchingProduct.id : products[0]?.id || '',
            quantity: order.quantity,
            shippingCharge: order.shippingCharge || 0,
            discountAmount: order.discountAmount || 0,
            paymentMode: order.paymentMode,
            welcomeNote: order.welcomeNote || 'Thank you for shopping with NutriMix Premium!'
        });
        setActiveTab('billing');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // --- Professional PDF Generation ---
    const handleGenerateInvoice = async () => {
        const product = products.find(p => p.id === parseInt(billingForm.selectedProductId));
        if (!product) return;

        const subtotal = product.price * billingForm.quantity;
        const total = subtotal + Number(billingForm.shippingCharge) - Number(billingForm.discountAmount);
        const invoiceNo = `INV-${Date.now().toString().slice(-6)}`;
        const dateStr = new Date().toLocaleDateString();

        try {
            await fetch(`${API_URL}/api/invoices`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...billingForm, invoiceNo, productName: product.name, price: product.price, total })
            });

            const doc = new jsPDF();
            doc.setFillColor(34, 197, 94);
            doc.rect(0, 0, 210, 40, 'F');
            doc.setTextColor(255);
            doc.setFontSize(28);
            doc.setFont("helvetica", "bold");
            doc.text("NUTRIMIX PREMIUM", 20, 25);
            doc.setFontSize(10);
            const fromAddrLines = doc.splitTextToSize(billingForm.fromAddress, 80);
            doc.text(fromAddrLines, 120, 15);

            doc.setTextColor(0);
            doc.setFontSize(22);
            doc.text("INVOICE", 20, 60);
            doc.setFontSize(10);
            doc.text(`Invoice #: ${invoiceNo}`, 20, 68);
            doc.text(`Date: ${dateStr}`, 20, 73);

            doc.setFont("helvetica", "bold");
            doc.text("BILL TO:", 20, 85);
            doc.text("SHIP TO:", 110, 85);
            doc.setFont("helvetica", "normal");
            const billAddr = doc.splitTextToSize(`${billingForm.customerName}\n${billingForm.customerPhone}\n${billingForm.billingAddress || 'N/A'}`, 80);
            const shipAddr = doc.splitTextToSize(`${billingForm.customerName}\n${billingForm.shippingAddress || 'N/A'}`, 80);
            doc.text(billAddr, 20, 92);
            doc.text(shipAddr, 110, 92);

            autoTable(doc, {
                startY: 120,
                head: [['Item Description', 'Qty', 'Unit Price', 'Total']],
                body: [[product.name, billingForm.quantity, `INR ${product.price}`, `INR ${subtotal}`]],
                theme: 'grid',
                headStyles: { fillColor: [34, 197, 94] },
                styles: { fontSize: 10 }
            });

            const finalY = doc.lastAutoTable.finalY + 10;
            doc.setFont("helvetica", "bold");
            doc.text(`Subtotal:`, 140, finalY);
            doc.text(`Shipping:`, 140, finalY + 7);
            doc.text(`Discount:`, 140, finalY + 14);
            doc.setFontSize(14);
            doc.setTextColor(34, 197, 94);
            doc.text(`GRAND TOTAL:`, 140, finalY + 25);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.setTextColor(0);
            doc.text(`INR ${subtotal}`, 185, finalY, { align: 'right' });
            doc.text(`+ INR ${billingForm.shippingCharge}`, 185, finalY + 7, { align: 'right' });
            doc.text(`- INR ${billingForm.discountAmount}`, 185, finalY + 14, { align: 'right' });
            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            doc.text(`INR ${total}`, 185, finalY + 25, { align: 'right' });

            doc.setFontSize(10);
            doc.setTextColor(100);
            const note = doc.splitTextToSize(billingForm.welcomeNote, 170);
            doc.text(note, 20, finalY + 45);
            doc.setFontSize(8);
            doc.text("Generated by NutriMix Admin System. This is a computer-generated invoice.", 105, 285, { align: 'center' });

            doc.save(`Invoice_${invoiceNo}.pdf`);
            setInvoiceGenerated(true);
            setTimeout(() => setInvoiceGenerated(false), 3000);
            fetchData();
        } catch (err) { alert(err.message); }
    };

    // --- Product CMS Actions ---
    const handleProductSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...productForm,
            id: editingProduct ? editingProduct.id : Date.now(),
            price: Number(productForm.price), originalPrice: Number(productForm.originalPrice),
            salePrice: Number(productForm.salePrice),
            specs: typeof productForm.specs === 'string' ? productForm.specs.split(',').map(s => s.trim()) : productForm.specs,
            ingredients: typeof productForm.ingredients === 'string' ? productForm.ingredients.split(',').map(s => s.trim()) : productForm.ingredients,
            uses: typeof productForm.uses === 'string' ? productForm.uses.split(',').map(s => s.trim()) : productForm.uses
        };
        const method = editingProduct ? 'PUT' : 'POST';
        const url = editingProduct ? `${API_URL}/api/products/${editingProduct.id}` : `${API_URL}/api/products`;
        await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        setIsProductModalOpen(false);
    };

    // --- Coupon CMS Actions ---
    const handleCouponSubmit = async (e) => {
        e.preventDefault();
        await fetch(`${API_URL}/api/coupons`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...couponForm,
                minPurchase: Number(couponForm.minPurchase)
            })
        });
        setIsCouponModalOpen(false);
        setCouponForm({ code: '', discountType: 'percentage', discountValue: '', minPurchase: 0 });
    };

    const handleDeleteInvoice = async (id) => {
        if (!window.confirm('Delete this transaction permanently?')) return;
        try {
            // Optimistic update
            setInvoices(prev => prev.filter(inv => inv._id !== id));

            const response = await fetch(`${API_URL}/api/invoices/${id}`, { method: 'DELETE' });
            if (response.ok) {
                fetchData(); // Sync to be sure
            } else {
                alert('Server failed to delete. Reloading...');
                fetchData(); // Revert
            }
        } catch (err) {
            alert('Error: ' + err.message);
            fetchData();
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-green-50/20"><div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div></div>;

    const tabs = [
        { id: 'billing', label: 'Billing', icon: Receipt },
        { id: 'products', label: 'Inventory', icon: Package },
        { id: 'coupons', label: 'Deals', icon: Tag },
        { id: 'orders', label: 'History', icon: History }
    ];

    return (
        <div className="min-h-screen bg-[#FDFDFD] pb-24 lg:pb-0">
            <Navbar />

            <div className="pt-24 lg:pt-32 pb-20 container mx-auto px-4 max-w-7xl">

                {/* Desktop Tabs Switcher */}
                <div className="hidden lg:flex gap-2 mb-10 bg-white p-2 rounded-2xl shadow-sm border border-gray-100 max-w-4xl mx-auto">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 min-w-[160px] py-4 px-6 rounded-xl flex items-center justify-center gap-3 font-bold transition-all duration-300 ${activeTab === tab.id ? 'bg-green-600 text-white shadow-xl shadow-green-100' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'animate-pulse' : ''}`} /> {tab.label} desk
                        </button>
                    ))}
                </div>

                {/* Mobile Bottom Navigation */}
                <div className="lg:hidden fixed bottom-6 left-4 right-4 z-[100] bg-gray-900/95 backdrop-blur-xl rounded-[32px] p-2 shadow-2xl border border-white/10 flex items-center justify-between">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 flex flex-col items-center gap-1 py-3 px-2 rounded-2xl transition-all ${activeTab === tab.id ? 'bg-green-600 text-white' : 'text-gray-400'}`}
                        >
                            <tab.icon className="w-5 h-5" />
                            <span className="text-[9px] font-black uppercase tracking-tighter">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* --- Billing Desk --- */}
                {activeTab === 'billing' && (
                    <div className="space-y-6 lg:space-y-8 animate-in fade-in zoom-in-95 duration-500">
                        {/* Autofill from Recent Orders */}
                        {invoices.length > 0 && (
                            <div className="bg-white p-6 lg:p-8 rounded-[32px] shadow-sm border border-gray-100 max-w-4xl mx-auto overflow-hidden">
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center">
                                        <History className="w-4 h-4" />
                                    </div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Quick Load from Recent Transactions</p>
                                </div>
                                <div className="flex flex-wrap gap-2 lg:gap-3">
                                    {invoices.slice(0, 5).map(inv => (
                                        <button
                                            key={inv._id}
                                            onClick={() => handleAutofill(inv)}
                                            className="px-4 lg:px-5 py-2.5 bg-gray-50 border border-gray-100 rounded-2xl text-[9px] lg:text-[10px] font-black uppercase text-gray-700 hover:bg-green-600 hover:text-white hover:border-green-600 transition-all flex items-center gap-2 group"
                                        >
                                            <User className="w-3 h-3 opacity-30 group-hover:opacity-100" /> {inv.customerName.split(' ')[0]}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="bg-white rounded-[40px] shadow-2xl border border-gray-100 overflow-hidden max-w-5xl mx-auto">
                            <div className="bg-green-600 p-8 lg:p-12 text-white flex flex-col lg:flex-row items-center lg:justify-between text-center lg:text-left gap-6">
                                <div>
                                    <h2 className="text-3xl lg:text-5xl font-black mb-2 uppercase tracking-tighter">Billing Desk</h2>
                                    <p className="text-green-100 text-sm lg:text-lg font-medium opacity-80 uppercase tracking-widest">Generate Professional PDF Invoices</p>
                                </div>
                                <div className="p-5 bg-white/10 rounded-3xl backdrop-blur-md">
                                    <Receipt className="w-10 h-10 lg:w-16 lg:h-16 text-white" />
                                </div>
                            </div>
                            <div className="p-6 lg:p-12 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                                {/* Left Column: Customer & Delivery */}
                                <div className="space-y-6">
                                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 border-b border-gray-50 pb-4">
                                        <User className="w-4 h-4" /> Client Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                                            <input placeholder="Ex: John Doe" value={billingForm.customerName} onChange={e => setBillingForm({ ...billingForm, customerName: e.target.value })} className="w-full p-5 bg-gray-50 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none transition-all font-bold" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                                            <input placeholder="Ex: 9876543210" value={billingForm.customerPhone} onChange={e => setBillingForm({ ...billingForm, customerPhone: e.target.value })} className="w-full p-5 bg-gray-50 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none transition-all font-bold" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Delivery Address</label>
                                        <textarea placeholder="Enter complete shipping details..." rows="3" value={billingForm.shippingAddress} onChange={e => setBillingForm({ ...billingForm, shippingAddress: e.target.value })} className="w-full p-5 bg-gray-50 rounded-[28px] outline-none font-bold" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Shipping Fees (₹)</label>
                                        <div className="flex items-center gap-3 bg-gray-50 p-5 rounded-2xl border-2 border-transparent focus-within:border-green-500 transition-all">
                                            <Truck className="w-5 h-5 text-gray-400" />
                                            <input type="number" value={billingForm.shippingCharge} onChange={e => setBillingForm({ ...billingForm, shippingCharge: e.target.value })} className="flex-1 bg-transparent border-none outline-none font-black text-lg" />
                                        </div>
                                    </div>
                                </div>
                                {/* Right Column: Order Details */}
                                <div className="space-y-6">
                                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 border-b border-gray-50 pb-4">
                                        <Package className="w-4 h-4" /> Item Inventory
                                    </h3>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Select Product</label>
                                        <select
                                            value={billingForm.selectedProductId}
                                            onChange={e => setBillingForm({ ...billingForm, selectedProductId: e.target.value })}
                                            className="w-full p-5 bg-gray-50 rounded-2xl outline-none font-bold appearance-none cursor-pointer"
                                        >
                                            {products.map(p => <option key={p.id} value={p.id}>{p.name} - ₹{p.price}</option>)}
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Qty</label>
                                            <input type="number" min="1" value={billingForm.quantity} onChange={e => setBillingForm({ ...billingForm, quantity: e.target.value })} className="w-full p-5 bg-gray-50 rounded-2xl outline-none font-black text-lg" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Extra Off (₹)</label>
                                            <input type="number" value={billingForm.discountAmount} onChange={e => setBillingForm({ ...billingForm, discountAmount: e.target.value })} className="w-full p-5 bg-gray-50 rounded-2xl outline-none font-black text-lg text-red-500" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Pay Mode</label>
                                        <div className="flex bg-gray-100 p-1.5 rounded-2xl">
                                            {['UPI', 'COD', 'Bank'].map(mode => (
                                                <button
                                                    key={mode}
                                                    onClick={() => setBillingForm({ ...billingForm, paymentMode: mode })}
                                                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${billingForm.paymentMode === (mode === 'COD' ? 'Cash' : mode) ? 'bg-white shadow-md text-green-600' : 'text-gray-400'}`}
                                                >
                                                    {mode}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">From Address (Header)</label>
                                        <input value={billingForm.fromAddress} onChange={e => setBillingForm({ ...billingForm, fromAddress: e.target.value })} className="w-full p-4 bg-gray-50 rounded-2xl outline-none text-[10px] font-bold text-gray-400" />
                                    </div>
                                </div>
                                <div className="lg:col-span-2 pt-8 border-t border-gray-100">
                                    <button
                                        onClick={handleGenerateInvoice}
                                        disabled={!billingForm.customerName || !billingForm.customerPhone}
                                        className={`w-full py-6 rounded-[32px] font-black text-2xl shadow-2xl transition-all flex items-center justify-center gap-4 active:scale-95 ${!billingForm.customerName ? 'bg-gray-100 text-gray-300 cursor-not-allowed' : 'bg-gray-900 text-white hover:bg-green-600 shadow-green-100'}`}
                                    >
                                        {invoiceGenerated ? <><CheckCircle className="w-8 h-8" /> DONE!</> : <><Download className="w-8 h-8" /> EXPORT TO PDF</>}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- Product CMS --- */}
                {activeTab === 'products' && (
                    <div className="bg-white rounded-[40px] shadow-2xl border border-gray-100 p-6 lg:p-12 animate-in slide-in-from-bottom-5 duration-500">
                        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-10 gap-6">
                            <div className="text-center lg:text-left">
                                <h2 className="text-3xl lg:text-5xl font-black text-gray-900 uppercase tracking-tighter">Inventory</h2>
                                <p className="text-gray-400 text-[10px] font-black mt-1 uppercase tracking-[0.3em]">{products.length} Items Synchronized</p>
                            </div>
                            <button onClick={() => { setEditingProduct(null); setProductForm({ name: '', price: '', originalPrice: '', salePrice: '', offerType: '', category: 'featured', image: '', description: '', specs: '', ingredients: '', uses: '' }); setIsProductModalOpen(true); }} className="w-full lg:w-auto bg-green-600 text-white px-10 py-5 rounded-[24px] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-green-700 shadow-2xl shadow-green-100 transition-all active:scale-95">
                                <Plus className="w-5 h-5" /> ADD BLEND
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                            {products.map(p => (
                                <div key={p.id} className="group bg-[#FAFAFA] rounded-[40px] p-6 border border-gray-50 hover:bg-white hover:shadow-2xl transition-all duration-500 relative flex flex-col">
                                    <div className="flex gap-5 items-center mb-8">
                                        <div className="w-24 h-24 bg-white rounded-[32px] flex items-center justify-center p-3 shadow-sm shrink-0 border border-gray-50">
                                            <img src={p.image} className="w-full h-full object-contain" alt="" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-black text-xl text-gray-900 leading-tight uppercase tracking-tight truncate">{p.name}</h4>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className="text-[8px] font-black text-green-600 bg-green-50 px-2 py-1 rounded-md uppercase tracking-widest">{p.category}</span>
                                                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">ID: {p.id.toString().slice(-4)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between">
                                        <p className="text-3xl font-black text-gray-900 tabular-nums">₹{p.price}</p>
                                        <div className="flex gap-2">
                                            <button onClick={() => { setEditingProduct(p); setProductForm({ ...p, specs: Array.isArray(p.specs) ? p.specs.join(', ') : p.specs, ingredients: Array.isArray(p.ingredients) ? p.ingredients.join(', ') : p.ingredients, uses: Array.isArray(p.uses) ? p.uses.join(', ') : p.uses }); setIsProductModalOpen(true); }} className="p-4 bg-white text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white border border-gray-100 transition-all"><Edit2 className="w-5 h-5" /></button>
                                            <button onClick={() => { if (window.confirm('Delete?')) fetch(`${API_URL}/api/products/${p.id}`, { method: 'DELETE' }); }} className="p-4 bg-white text-red-600 rounded-2xl hover:bg-red-600 hover:text-white border border-gray-100 transition-all"><Trash2 className="w-5 h-5" /></button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- Coupon CMS --- */}
                {activeTab === 'coupons' && (
                    <div className="max-w-4xl mx-auto bg-white rounded-[48px] p-6 lg:p-12 shadow-2xl animate-in fade-in duration-500 border border-gray-50">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-12 gap-8 text-center lg:text-left">
                            <div>
                                <h2 className="text-3xl lg:text-5xl font-black text-gray-900 uppercase tracking-tighter">Promotions</h2>
                                <p className="text-gray-400 text-[10px] font-black mt-1 uppercase tracking-[0.3em]">Campaign Vouchers</p>
                            </div>
                            <button onClick={() => setIsCouponModalOpen(true)} className="w-full lg:w-auto bg-orange-500 text-white px-10 py-5 rounded-[24px] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-orange-600 shadow-2xl shadow-orange-100 transition-all active:scale-95">
                                <Tag className="w-5 h-5" /> NEW CODE
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                            {coupons.length === 0 && <p className="col-span-full text-center py-20 text-gray-300 font-black uppercase text-xs tracking-[0.3em]">No Active Promotions</p>}
                            {coupons.map(c => (
                                <div key={c._id} className="bg-[#FAF9F6] p-8 rounded-[40px] border-2 border-dashed border-gray-200 relative group overflow-hidden hover:bg-white hover:border-orange-200 transition-all duration-500">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="bg-gray-900 text-white font-mono text-2xl font-black px-8 py-3 rounded-2xl">
                                            {c.code}
                                        </div>
                                        <button onClick={() => fetch(`${API_URL}/api/coupons/${c._id}`, { method: 'DELETE' })} className="p-4 bg-white text-red-400 hover:text-red-500 rounded-2xl shadow-sm transition-all"><Trash2 className="w-5 h-5" /></button>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-orange-600 text-sm font-black uppercase tracking-widest">{c.discountType === 'percentage' ? 'Percentage Cut' : 'Cash Instant Off'}</p>
                                        <p className="text-gray-900 text-4xl font-black tabular-nums">{c.discountType === 'percentage' ? `${c.discountValue}%` : `₹${c.discountValue}`}</p>
                                    </div>
                                    <div className="mt-6 flex items-center gap-2 text-gray-400">
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                        <p className="text-[9px] font-black uppercase tracking-widest">Valid Above ₹{c.minPurchase} Billing</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- Order History --- */}
                {activeTab === 'orders' && (
                    <div className="bg-white rounded-[48px] shadow-2xl lg:p-12 p-6 border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-500">
                        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-12 gap-8 text-center lg:text-left">
                            <div>
                                <h2 className="text-3xl lg:text-5xl font-black text-gray-900 uppercase tracking-tighter flex items-center justify-center lg:justify-start gap-4">
                                    <History className="w-8 h-8 lg:w-12 lg:h-12 text-green-600" /> Transactions
                                </h2>
                                <p className="text-gray-400 text-[10px] font-black mt-2 uppercase tracking-[0.3em]">{invoices.length} Verified Records</p>
                            </div>
                            <div className="w-full lg:w-auto bg-gray-50 px-6 py-4 rounded-[24px] flex items-center gap-3 border border-gray-100">
                                <Search className="w-5 h-5 text-gray-300" />
                                <input placeholder="SEARCH RECORDS..." className="bg-transparent outline-none text-[10px] font-black uppercase tracking-widest flex-1 lg:w-48" />
                            </div>
                        </div>

                        {/* Mobile Optimized Cards for History */}
                        <div className="space-y-4">
                            {invoices.length === 0 && <p className="text-center py-20 text-gray-300 font-black uppercase text-xs tracking-[0.3em]">No history found</p>}
                            {invoices.map(inv => (
                                <div key={inv._id} className="p-6 rounded-[32px] bg-[#FAFAFA] border border-gray-50 hover:bg-white hover:shadow-2xl transition-all duration-500">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Receipt ID</p>
                                            <p className="font-mono text-sm font-black text-gray-900">{inv.invoiceNo}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Pay</p>
                                            <p className="text-2xl font-black text-green-600">₹{inv.total}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6 mb-6">
                                        <div>
                                            <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1">Customer</p>
                                            <p className="text-xs font-black text-gray-800 uppercase line-clamp-1">{inv.customerName}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1">Date</p>
                                            <p className="text-xs font-black text-gray-800">{new Date(inv.date).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{inv.paymentMode}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleAutofill(inv)}
                                                className="bg-gray-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-green-600 transition-all active:scale-95 flex items-center gap-2"
                                            >
                                                <Copy className="w-3.5 h-3.5" /> RE-USE
                                            </button>
                                            <button
                                                onClick={() => handleDeleteInvoice(inv._id)}
                                                className="p-3 bg-white text-red-400 hover:text-red-600 rounded-2xl border border-gray-100 transition-all active:scale-95"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* --- Modals for CMS (Touch Optimized) --- */}
            {isProductModalOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/95 backdrop-blur-xl" onClick={() => setIsProductModalOpen(false)}></div>
                    <div className="bg-white w-full max-w-5xl rounded-[40px] shadow-2xl relative z-10 max-h-[90vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom-5">
                        <div className="p-8 border-b border-gray-50 flex justify-between items-center shrink-0">
                            <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">{editingProduct ? 'Fix Inventory' : 'New Blend'}</h3>
                            <button onClick={() => setIsProductModalOpen(false)} className="p-4 hover:bg-gray-100 rounded-full transition-all"><X className="w-8 h-8 text-gray-400" /></button>
                        </div>
                        <form onSubmit={handleProductSubmit} className="p-8 overflow-y-auto space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div><label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 block">Item Name</label><input required value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} className="w-full p-5 bg-gray-50 rounded-2xl font-bold border-none outline-none focus:ring-2 focus:ring-green-500" /></div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div><label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] mb-2 block">Our Price</label><input required type="number" value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} className="w-full p-5 bg-gray-50 rounded-2xl font-black border-none" /></div>
                                        <div><label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] mb-2 block">List Price</label><input type="number" value={productForm.salePrice} onChange={e => setProductForm({ ...productForm, salePrice: e.target.value })} className="w-full p-5 bg-gray-50 rounded-2xl font-black border-none" /></div>
                                    </div>
                                    <div><label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] mb-2 block">Visuals URL</label><input required value={productForm.image} onChange={e => setProductForm({ ...productForm, image: e.target.value })} className="w-full p-5 bg-gray-50 rounded-2xl font-medium border-none" /></div>
                                </div>
                                <div className="space-y-6">
                                    <div><label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] mb-2 block">Story / Desc</label><textarea required rows="4" value={productForm.description} onChange={e => setProductForm({ ...productForm, description: e.target.value })} className="w-full p-5 bg-gray-50 rounded-[32px] font-medium border-none outline-none" /></div>
                                    <button type="submit" className="w-full py-6 mt-4 bg-gray-900 text-white rounded-[28px] font-black text-xl hover:bg-green-600 transition-all uppercase tracking-widest shadow-2xl active:scale-95">SYNC INVENTORY</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isCouponModalOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/95 backdrop-blur-xl" onClick={() => setIsCouponModalOpen(false)}></div>
                    <div className="bg-white w-full max-w-lg rounded-[48px] p-10 lg:p-14 relative z-10 animate-in zoom-in-95 shadow-2xl">
                        <h3 className="text-3xl font-black mb-10 text-center uppercase tracking-tighter">New Campaign</h3>
                        <form onSubmit={handleCouponSubmit} className="space-y-8">
                            <div><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block text-center">Secret Promo Code</label><input required placeholder="MEGA50" value={couponForm.code} onChange={e => setCouponForm({ ...couponForm, code: e.target.value })} className="w-full p-6 bg-gray-100 rounded-[28px] outline-none font-black uppercase text-2xl text-center text-orange-600 focus:bg-white focus:ring-2 focus:ring-orange-500 transition-all" /></div>
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block text-center">Trigger Price (Above this value ₹)</label>
                                <input
                                    required
                                    type="number"
                                    placeholder="Min Purchase"
                                    value={couponForm.minPurchase}
                                    onChange={e => setCouponForm({ ...couponForm, minPurchase: e.target.value })}
                                    className="p-5 w-full bg-gray-100 rounded-2xl font-black text-xl border-none outline-none focus:bg-white focus:ring-2 focus:ring-green-500 transition-all"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <select value={couponForm.discountType} onChange={e => setCouponForm({ ...couponForm, discountType: e.target.value })} className="p-5 bg-gray-100 rounded-2xl font-black text-[10px] uppercase border-none"><option value="percentage">% Cut</option><option value="flat">₹ Flat</option></select>
                                <input required type="number" placeholder="Value" value={couponForm.discountValue} onChange={e => setCouponForm({ ...couponForm, discountValue: e.target.value })} className="p-5 bg-gray-100 rounded-2xl font-black text-xl border-none" />
                            </div>
                            <button type="submit" className="w-full py-6 bg-orange-500 text-white rounded-[28px] font-black text-xl hover:bg-orange-600 transition-all uppercase tracking-widest shadow-xl shadow-orange-100 active:scale-95">ACTIVATE NOW</button>
                        </form>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default Admin;
