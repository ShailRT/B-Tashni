"use client";

import { useCart } from "@/context/CartContext";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { initiateCheckout, verifyAndCompleteOrder } from "@/app/actions/checkout";
import { ChevronRight, ShieldCheck, Truck, CreditCard, ChevronLeft } from "lucide-react";
import Link from "next/link";
import Script from "next/script";

export default function CheckoutPage() {
    const { cart, cartTotal } = useCart();
    const { user, isLoaded: isUserLoaded } = useUser();
    const [isProcessing, setIsProcessing] = useState(false);
    const [mounted, setMounted] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        firstName: "",
        lastName: "",
        phone: "",
        address: "",
        apartment: "",
        city: "",
        state: "",
        pincode: "",
    });
    const [fieldErrors, setFieldErrors] = useState({});
    const [touchedFields, setTouchedFields] = useState({});

    const validateField = (name, value) => {
        let error = null;
        switch (name) {
            case 'firstName':
                if (!value || value.trim().length < 2) error = 'First name is too short.';
                break;
            case 'lastName':
                if (!value || value.trim().length < 2) error = 'Last name is too short.';
                break;
            case 'email':
                if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Invalid email address.';
                break;
            case 'phone':
                const phoneDigits = value.replace(/\D/g, '');
                if (!value || phoneDigits.length !== 10) error = 'Phone number must be exactly 10 digits.';
                break;
            case 'address':
                if (!value || value.trim().length < 5) error = 'Please enter a valid address.';
                break;
            case 'city':
                if (!value || value.trim().length < 2) error = 'City is required.';
                break;
            case 'state':
                if (!value || value.trim().length < 2) error = 'State is required.';
                break;
            case 'pincode':
                if (!value || !/^[0-9]{6}$/.test(value)) error = 'Invalid pincode (6 digits required).';
                break;
            default:
                break;
        }
        setFieldErrors(prev => ({ ...prev, [name]: error }));
        return error;
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouchedFields(prev => ({ ...prev, [name]: true }));
        validateField(name, value);
    };

    useEffect(() => {
        setMounted(true);
        if (isUserLoaded && user) {
            setFormData((prev) => ({
                ...prev,
                email: user.primaryEmailAddress?.emailAddress || "",
                firstName: user.firstName || "",
                lastName: user.lastName || "",
            }));
        }
    }, [isUserLoaded, user]);

    if (!mounted) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'phone') {
            // Only allow numbers and + sign
            const cleaned = value.replace(/[^0-9+]/g, '');
            setFormData((prev) => ({ ...prev, [name]: cleaned }));
            if (touchedFields[name]) {
                validateField(name, cleaned);
            }
            return;
        }

        setFormData((prev) => ({ ...prev, [name]: value }));
        if (touchedFields[name]) {
            validateField(name, value);
        }
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        if (isProcessing) return;

        // Final validation check
        const errors = {};
        Object.keys(formData).forEach(key => {
            if (key !== 'apartment') { // skip optional field
                const error = validateField(key, formData[key]);
                if (error) errors[key] = error;
            }
        });

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            const touched = {};
            Object.keys(errors).forEach(key => touched[key] = true);
            setTouchedFields(touched);
            
            // Scroll to the first error
            const firstErrorField = Object.keys(errors)[0];
            const element = document.getElementsByName(firstErrorField)[0];
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                element.focus();
            }
            return;
        }

        try {
            setIsProcessing(true);

            // 1. Initiate checkout (Creates DB order and Razorpay order)
            const orderData = {
                totalAmount: cartTotal,
                shippingAddress: formData,
                email: formData.email,
                phone: formData.phone,
                items: cart.map((item) => ({
                    productId: item.originalId || item.id,
                    quantity: item.quantity,
                    price: item.priceValue || parseFloat(String(item.price).replace(/[^0-9.]/g, "")),
                })),
            };

            const result = await initiateCheckout(orderData);

            if (!result.success) {
                alert(result.error || "Failed to initiate checkout");
                return;
            }

            // 2. Options for Razorpay Checkout
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: result.amount,
                currency: result.currency,
                name: "B-TASHNI",
                description: "Premium Apparel Purchase",
                order_id: result.orderId,
                handler: async function (response) {
                    try {
                        const verificationResult = await verifyAndCompleteOrder({
                            ...response,
                            dbOrderId: result.dbOrderId,
                        });

                        if (verificationResult.success) {
                            window.location.href = `/order-success?order_id=${result.orderId}&payment_id=${response.razorpay_payment_id}`;
                        } else {
                            alert(verificationResult.error || "Payment verification failed.");
                        }
                    } catch (err) {
                        console.error("Verification error:", err);
                        alert("An error occurred while verifying your payment.");
                    } finally {
                        setIsProcessing(false);
                    }
                },
                prefill: {
                    name: `${formData.firstName} ${formData.lastName}`,
                    email: formData.email,
                    contact: formData.phone,
                },
                theme: {
                    color: "#000000",
                },
                magic: true,
            };

            let paymentFailed = false;

            const rzp = new window.Razorpay({
                ...options,
                modal: {
                    ondismiss: function() {
                        setIsProcessing(false);
                        if (paymentFailed) {
                            window.location.href = "/order-cancel";
                        }
                    }
                }
            });
            rzp.on("payment.failed", function (response) {
                console.error("Payment failed: ", response.error.description);
                paymentFailed = true;
            });
            rzp.open();
        } catch (error) {
            console.error("Checkout error:", error);
            alert(error.message || "Something went wrong.");
        } finally {
            setIsProcessing(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-bold mb-4 uppercase tracking-widest">Your cart is empty</h1>
                <Link href="/" className="bg-black text-white px-8 py-3 text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors">
                    Return to Shop
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fafafa] text-[#1c1c1c] font-sans pt-32 pb-12">
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />

            <div className="max-w-[1200px] mx-auto px-4 md:px-8">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] font-medium text-gray-400 mb-10">
                    <Link href="/" className="hover:text-black transition-colors">Home</Link>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-black">Checkout</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    {/* Left Column: Form */}
                    <div className="lg:col-span-7 space-y-10">
                        <section className="bg-white p-8 border border-gray-100 shadow-sm rounded-sm">
                            <h2 className="text-sm font-bold uppercase tracking-widest mb-8 flex items-center gap-2 border-b border-gray-100 pb-4">
                                <Truck className="w-4 h-4" /> Shipping Information
                            </h2>
                            <form id="checkout-form" onSubmit={handlePayment} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] uppercase font-bold tracking-wider text-gray-500">First Name *</label>
                                        <input
                                            required
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            onBlur={handleBlur}
                                            className={`w-full border px-4 py-3 text-sm focus:border-black transition-colors outline-none bg-gray-50/30 ${fieldErrors.firstName ? 'border-red-500 bg-red-50/10' : 'border-gray-200'}`}
                                        />
                                        {fieldErrors.firstName && <p className="text-[10px] text-red-500 font-bold uppercase tracking-tight">{fieldErrors.firstName}</p>}
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] uppercase font-bold tracking-wider text-gray-500">Last Name *</label>
                                        <input
                                            required
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            onBlur={handleBlur}
                                            className={`w-full border px-4 py-3 text-sm focus:border-black transition-colors outline-none bg-gray-50/30 ${fieldErrors.lastName ? 'border-red-500 bg-red-50/10' : 'border-gray-200'}`}
                                        />
                                        {fieldErrors.lastName && <p className="text-[10px] text-red-500 font-bold uppercase tracking-tight">{fieldErrors.lastName}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] uppercase font-bold tracking-wider text-gray-500">Email Address *</label>
                                        <input
                                            required
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            onBlur={handleBlur}
                                            className={`w-full border px-4 py-3 text-sm focus:border-black transition-colors outline-none bg-gray-50/30 ${fieldErrors.email ? 'border-red-500 bg-red-50/10' : 'border-gray-200'}`}
                                        />
                                        {fieldErrors.email && <p className="text-[10px] text-red-500 font-bold uppercase tracking-tight">{fieldErrors.email}</p>}
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] uppercase font-bold tracking-wider text-gray-500">Phone Number *</label>
                                        <input
                                            required
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            onBlur={handleBlur}
                                            placeholder="+91"
                                            className={`w-full border px-4 py-3 text-sm focus:border-black transition-colors outline-none bg-gray-50/30 ${fieldErrors.phone ? 'border-red-500 bg-red-50/10' : 'border-gray-200'}`}
                                        />
                                        {fieldErrors.phone && <p className="text-[10px] text-red-500 font-bold uppercase tracking-tight">{fieldErrors.phone}</p>}
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] uppercase font-bold tracking-wider text-gray-500">Address *</label>
                                    <input
                                        required
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        onBlur={handleBlur}
                                        placeholder="Street address"
                                        className={`w-full border px-4 py-3 text-sm focus:border-black transition-colors outline-none bg-gray-50/30 ${fieldErrors.address ? 'border-red-500 bg-red-50/10' : 'border-gray-200'}`}
                                    />
                                    {fieldErrors.address && <p className="text-[10px] text-red-500 font-bold uppercase tracking-tight">{fieldErrors.address}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] uppercase font-bold tracking-wider text-gray-500">Apartment, suite, etc. (optional)</label>
                                    <input
                                        type="text"
                                        name="apartment"
                                        value={formData.apartment}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-200 px-4 py-3 text-sm focus:border-black transition-colors outline-none bg-gray-50/30"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] uppercase font-bold tracking-wider text-gray-500">City *</label>
                                        <input
                                            required
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            onBlur={handleBlur}
                                            className={`w-full border px-4 py-3 text-sm focus:border-black transition-colors outline-none bg-gray-50/30 ${fieldErrors.city ? 'border-red-500 bg-red-50/10' : 'border-gray-200'}`}
                                        />
                                        {fieldErrors.city && <p className="text-[10px] text-red-500 font-bold uppercase tracking-tight">{fieldErrors.city}</p>}
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] uppercase font-bold tracking-wider text-gray-500">State *</label>
                                        <input
                                            required
                                            type="text"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            onBlur={handleBlur}
                                            className={`w-full border px-4 py-3 text-sm focus:border-black transition-colors outline-none bg-gray-50/30 ${fieldErrors.state ? 'border-red-500 bg-red-50/10' : 'border-gray-200'}`}
                                        />
                                        {fieldErrors.state && <p className="text-[10px] text-red-500 font-bold uppercase tracking-tight">{fieldErrors.state}</p>}
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] uppercase font-bold tracking-wider text-gray-500">Pincode *</label>
                                        <input
                                            required
                                            type="text"
                                            name="pincode"
                                            value={formData.pincode}
                                            onChange={handleInputChange}
                                            onBlur={handleBlur}
                                            className={`w-full border px-4 py-3 text-sm focus:border-black transition-colors outline-none bg-gray-50/30 ${fieldErrors.pincode ? 'border-red-500 bg-red-50/10' : 'border-gray-200'}`}
                                        />
                                        {fieldErrors.pincode && <p className="text-[10px] text-red-500 font-bold uppercase tracking-tight">{fieldErrors.pincode}</p>}
                                    </div>
                                </div>
                            </form>
                        </section>

                        <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors group">
                            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Cart
                        </Link>
                    </div>

                    {/* Right Column: Summary */}
                    <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
                        <section className="bg-white p-8 border border-gray-100 shadow-sm rounded-sm">
                            <h2 className="text-sm font-bold uppercase tracking-widest mb-8 border-b border-gray-100 pb-4 flex items-center gap-2">
                                Order Summary <span className="text-[10px] text-gray-400 font-medium">({cart.length} ITEMS)</span>
                            </h2>

                            <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto px-1 custom-scrollbar">
                                {cart.map((item) => (
                                    <div key={`${item.id}-${item.selectedSize}`} className="flex gap-4">
                                        <div className="w-20 h-24 bg-gray-50 shrink-0 border border-gray-100">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between py-1">
                                            <div>
                                                <h3 className="text-[11px] font-bold uppercase tracking-wider mb-1 leading-tight">{item.name}</h3>
                                                <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                                                    Qty: {item.quantity} {item.selectedSize && `• Size: ${item.selectedSize}`}
                                                </p>
                                            </div>
                                            <p className="text-[12px] font-bold">INR {parseFloat(item.price).toLocaleString("en-IN")}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 pt-6 border-t border-gray-100">
                                <div className="flex justify-between text-xs font-medium uppercase tracking-widest text-gray-500">
                                    <span>Subtotal</span>
                                    <span>INR {cartTotal.toLocaleString("en-IN")}</span>
                                </div>
                                <div className="flex justify-between text-xs font-medium uppercase tracking-widest text-gray-500">
                                    <span>Shipping</span>
                                    <span className="text-green-600">FREE</span>
                                </div>
                                <div className="flex justify-between text-sm font-bold uppercase tracking-widest pt-4 border-t border-gray-100 mt-2">
                                    <span>Total</span>
                                    <span>INR {cartTotal.toLocaleString("en-IN")}</span>
                                </div>
                            </div>

                            <button
                                form="checkout-form"
                                disabled={isProcessing}
                                className="w-full bg-black text-white py-4 mt-8 text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#2d2a26] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-black/5"
                            >
                                {isProcessing ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <CreditCard className="w-4 h-4" /> Secure Payment
                                    </>
                                )}
                            </button>

                            <div className="mt-8 flex items-center justify-center gap-6 opacity-40">
                                <img src="https://razorpay.com/assets/razorpay-logo-white.svg" alt="Razorpay" className="h-4 brightness-0" />
                                <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.1em]">
                                    <ShieldCheck className="w-3 h-3" /> Secure Checkout
                                </div>
                            </div>
                        </section>

                        <p className="text-[10px] text-gray-400 text-center px-4 leading-relaxed uppercase tracking-wider">
                            By placing your order, you agree to our Terms of Use and Privacy Policy.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
