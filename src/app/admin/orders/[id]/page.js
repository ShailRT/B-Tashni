'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Save, Truck, MapPin, Package as PackageIcon, User } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getOrderByIdAction } from '@/app/actions/orders';

export default function OrderDetailsPage() {
    const params = useParams();
    const orderId = params?.id ?? null;
    console.log('OrderDetailsPage params:', params);

    const [order, setOrder] = useState(null);
    const [loadingOrder, setLoadingOrder] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    const [showCustomerModal, setShowCustomerModal] = useState(false);

    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') setShowCustomerModal(false); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    useEffect(() => {
        if (!orderId) {
            setLoadingOrder(false);
            setFetchError('Invalid order ID');
            return;
        }

        setLoadingOrder(true);
        getOrderByIdAction(orderId)
            .then(result => {
                if (result.success) {
                    setOrder(result.order);
                    setFetchError(null);
                } else {
                    setOrder(null);
                    setFetchError(result.error || 'Order not found');
                }
            })
            .catch(error => {
                console.error('Error fetching order:', error);
                setOrder(null);
                setFetchError(error?.message || 'Failed to load order');
            })
            .finally(() => setLoadingOrder(false));
    }, [orderId]);

    if (loadingOrder) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-base text-gray-500">Loading order details...</p>
            </div>
        );
    }

    if (fetchError || !order) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="max-w-xl text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-3">Unable to load order</h1>
                    <p className="text-sm text-gray-500">{fetchError || 'Order not found.'}</p>
                </div>
            </div>
        );
    }

    // Resolve shipping address fields from possible variants in real data
    const rawAddr = order.shippingAddress || {};
    console.log('OrderDetailsPage shippingAddress raw:', rawAddr);
    let addrLine1 = rawAddr.address ?? rawAddr.street ?? rawAddr.address1 ?? rawAddr.line1 ?? rawAddr['line_1'] ?? rawAddr.address_line1 ?? rawAddr['address_line_1'] ?? rawAddr.addressLine1 ?? rawAddr.street1 ?? '';
    let addrLine2 = rawAddr.apartment ?? rawAddr.address2 ?? rawAddr.line2 ?? rawAddr['line_2'] ?? rawAddr.address_line2 ?? rawAddr['address_line_2'] ?? rawAddr.addressLine2 ?? '';
    let city = rawAddr.city ?? '';
    let state = rawAddr.state ?? rawAddr.province ?? '';
    let zip = rawAddr.pincode ?? rawAddr.zip ?? rawAddr.postcode ?? rawAddr.postal_code ?? rawAddr.pin ?? rawAddr.pin_code ?? rawAddr.postalCode ?? '';
    const country = rawAddr.country ?? rawAddr.country_code ?? '';
    console.log('OrderDetailsPage shippingAddress resolved:', { addrLine1, addrLine2, city, state, zip, country });

    // If address is a single string (e.g. rawAddr.address or rawAddr.address_full), try to parse it
    const singleAddress = rawAddr.address ?? rawAddr.address_full ?? rawAddr.full_address ?? rawAddr.addressLine ?? rawAddr.addressString ?? '';
    if (!addrLine1 && singleAddress) {
        const parts = singleAddress.split(',').map(p => p.trim()).filter(Boolean);
        if (parts.length) addrLine1 = parts[0] || '';
        if (parts.length >= 2 && !city) {
            // assume second part is city
            // do not overwrite existing city/state if present
            // but if city is empty, set from parts
            // if second part contains digits at end, try to extract pin
            const second = parts[1];
            const pinMatch = second.match(/\b\d{5,6}\b/);
            if (pinMatch && !zip) zip = pinMatch[0];
            if (!city) city = second.replace(/\b\d{5,6}\b/, '').trim();
        }
        if (parts.length >= 3 && !state) {
            state = state || parts[2] || '';
        }
        // try extract pin from entire string if still missing
        if (!zip) {
            const m = singleAddress.match(/\b\d{5,6}\b/);
            if (m) zip = m[0];
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link href="/admin/orders" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft className="h-5 w-5 text-gray-500" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Order {order.id}</h1>
                        <p className="text-sm text-gray-500">{order.date} • {order.items.length} Items</p>
                    </div>
                </div>
                <div className="flex space-x-3">
                    <select
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
                        defaultValue={order.status}
                    >
                        <option>Pending</option>
                        <option>Processing</option>
                        <option>Success</option>
                        <option>Failed</option>
                    </select>
                    <button className="inline-flex items-center w-36 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
                        <Save className="-ml-1 mr-2 h-6 w-6" />
                        Save Changes
                    </button>
                </div>
            </div>
            {showCustomerModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setShowCustomerModal(false)}>
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="relative z-10 w-full max-w-2xl mx-4" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                                <h3 className="font-semibold text-gray-900 flex items-center">
                                    <User className="mr-2 h-4 w-4 text-gray-500" />
                                    Customer Details
                                </h3>
                                <button onClick={() => setShowCustomerModal(false)} className="text-sm text-gray-600 hover:text-gray-900">Close</button>
                            </div>
                            <div className="p-6">
                                <table style={{border: '1px solid #e5e7eb', borderCollapse: 'collapse', width: '100%'}} className="min-w-full w-full table-fixed text-sm">
                                    <tbody>
                                        <tr>
                                            <td style={{borderBottom: '1px solid #e5e7eb', padding: '0.5rem 0.5rem'}} className="text-gray-500 w-32">Name</td>
                                            <td style={{borderBottom: '1px solid #e5e7eb', padding: '0.5rem 0.5rem'}} className="font-medium text-gray-900">{order.customer?.name ?? '—'}</td>
                                        </tr>
                                        <tr>
                                            <td style={{borderBottom: '1px solid #e5e7eb', padding: '0.5rem 0.5rem'}} className="text-gray-500">Email</td>
                                            <td style={{borderBottom: '1px solid #e5e7eb', padding: '0.5rem 0.5rem'}} className="font-medium text-gray-900">{order.email ?? '—'}</td>
                                        </tr>
                                        <tr>
                                            <td style={{borderBottom: '1px solid #e5e7eb', padding: '0.5rem 0.5rem'}} className="text-gray-500">Phone</td>
                                            <td style={{borderBottom: '1px solid #e5e7eb', padding: '0.5rem 0.5rem'}} className="font-medium text-gray-900">{order.phone ?? '—'}</td>
                                        </tr>
                                        <tr>
                                            <td style={{borderBottom: '1px solid #e5e7eb', padding: '0.5rem 0.5rem'}} className="text-gray-500">Status</td>
                                            <td style={{borderBottom: '1px solid #e5e7eb', padding: '0.5rem 0.5rem'}} className="font-medium text-gray-900">{order.status ?? '—'}</td>
                                        </tr>
                                        <tr>
                                            <td style={{borderBottom: '1px solid #e5e7eb', padding: '0.5rem 0.5rem'}} className="text-gray-500">Address (line 1)</td>
                                            <td style={{borderBottom: '1px solid #e5e7eb', padding: '0.5rem 0.5rem'}} className="font-medium text-gray-900">{addrLine1 || '—'}</td>
                                        </tr>
                                        <tr>
                                            <td style={{borderBottom: '1px solid #e5e7eb', padding: '0.5rem 0.5rem'}} className="text-gray-500">Address (line 2)</td>
                                            <td style={{borderBottom: '1px solid #e5e7eb', padding: '0.5rem 0.5rem'}} className="font-medium text-gray-900">{addrLine2 || '—'}</td>
                                        </tr>
                                        <tr>
                                            <td style={{borderBottom: '1px solid #e5e7eb', padding: '0.5rem 0.5rem'}} className="text-gray-500">City</td>
                                            <td style={{borderBottom: '1px solid #e5e7eb', padding: '0.5rem 0.5rem'}} className="font-medium text-gray-900">{city || '—'}</td>
                                        </tr>
                                        <tr>
                                            <td style={{borderBottom: '1px solid #e5e7eb', padding: '0.5rem 0.5rem'}} className="text-gray-500">State</td>
                                            <td style={{borderBottom: '1px solid #e5e7eb', padding: '0.5rem 0.5rem'}} className="font-medium text-gray-900">{state || '—'}</td>
                                        </tr>
                                        <tr>
                                            <td style={{borderBottom: '1px solid #e5e7eb', padding: '0.5rem 0.5rem'}} className="text-gray-500">Pin / Zip</td>
                                            <td style={{borderBottom: '1px solid #e5e7eb', padding: '0.5rem 0.5rem'}} className="font-medium text-gray-900">{zip || '—'}</td>
                                        </tr>
                                        <tr>
                                            <td style={{padding: '0.5rem 0.5rem'}} className="text-gray-500">Country</td>
                                            <td style={{padding: '0.5rem 0.5rem'}} className="font-medium text-gray-900">{country || '—'}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* payment*/}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900 flex items-center">
                                <PackageIcon className="mr-2 h-4 w-4 text-gray-500" />
                                Order Items
                            </h3>
                        </div>
                        <div className="divide-y divide-gray-200">
                            {order.items.map((item) => (
                                <div key={item.id} className="p-6 flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="h-16 w-16 bg-gray-100 rounded-lg flex-shrink-0"></div>
                                        <div className="ml-4">
                                            <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                                            <p className="text-sm text-gray-500">Qty: {item.quantity} × {item.price}</p>
                                        </div>
                                    </div>
                                    <div className="text-sm font-medium text-gray-900">{item.total}</div>
                                </div>
                            ))}
                        </div>
                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                            <div className="flex justify-between text-sm py-1">
                                <span className="text-gray-500">Subtotal</span>
                                <span className="font-medium text-gray-900">{order.subtotal}</span>
                            </div>
                            <div className="flex justify-between text-sm py-1">
                                <span className="text-gray-500">Shipping</span>
                                <span className="font-medium text-gray-900">{order.shipping}</span>
                            </div>
                            <div className="flex justify-between text-sm py-1">
                                <span className="text-gray-500">Tax</span>
                                <span className="font-medium text-gray-900">{order.tax}</span>
                            </div>
                            <div className="flex justify-between text-base font-bold py-3 border-t border-gray-200 mt-2">
                                <span className="text-gray-900">Total</span>
                                <span className="text-blue-600">{order.total}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Customer & Shipping */}
                <div className="space-y-6">

                    {/* Customer Details */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900 flex items-center">
                                <User className="mr-2 h-4 w-4 text-gray-500" />
                                Customer Details
                            </h3>
                            <button
                                onClick={() => setShowCustomerModal(true)}
                                className="ml-4 inline-flex items-center px-3 py-1.5 border rounded-md text-sm bg-white hover:bg-gray-100"
                            >
                                View
                            </button>
                        </div>
                        <div className="p-6">
                            <table style={{border: '1px solid #e5e7eb', borderCollapse: 'collapse', width: '100%'}} className="min-w-full w-full table-fixed text-sm">
                                <tbody>
                                    <tr>
                                        <td style={{borderBottom: '1px solid #000000', padding: '0.5rem 0.5rem'}} className="text-gray-500 w-32">Name</td>
                                        <td style={{borderBottom: '1px solid #000000', padding: '0.5rem 0.5rem'}} className="font-medium text-gray-900">{order.customer?.name ?? '—'}</td>
                                    </tr>
                                    <tr>
                                        <td style={{borderBottom: '1px solid #000000', padding: '0.5rem 0.5rem'}} className="text-gray-500">Email</td>
                                        <td style={{borderBottom: '1px solid #000000', padding: '0.5rem 0.5rem'}} className="font-medium text-gray-900">{order.email ?? '—'}</td>
                                    </tr>
                                    <tr>
                                        <td style={{borderBottom: '1px solid #000000', padding: '0.5rem 0.5rem'}} className="text-gray-500">Phone</td>
                                        <td style={{borderBottom: '1px solid #000000', padding: '0.5rem 0.5rem'}} className="font-medium text-gray-900">{order.phone ?? '—'}</td>
                                    </tr>
                                    <tr>
                                        <td style={{borderBottom: '1px solid #000000', padding: '0.5rem 0.5rem'}} className="text-gray-500">Status</td>
                                        <td style={{borderBottom: '1px solid #000000', padding: '0.5rem 0.5rem'}} className="font-medium text-gray-900">{order.status ?? '—'}</td>
                                    </tr>
                                    <tr>
                                        <td style={{borderBottom: '1px solid #000000', padding: '0.5rem 0.5rem'}} className="text-gray-500">Address (line 1)</td>
                                        <td style={{borderBottom: '1px solid #000000', padding: '0.5rem 0.5rem'}} className="font-medium text-gray-900">{addrLine1 || '—'}</td>
                                    </tr>
                                    <tr>
                                        <td style={{borderBottom: '1px solid #000000', padding: '0.5rem 0.5rem'}} className="text-gray-500">Address (line 2)</td>
                                        <td style={{borderBottom: '1px solid #000000', padding: '0.5rem 0.5rem'}} className="font-medium text-gray-900">{addrLine2 || '—'}</td>
                                    </tr>
                                    <tr>
                                        <td style={{borderBottom: '1px solid #000000', padding: '0.5rem 0.5rem'}} className="text-gray-500">City</td>
                                        <td style={{borderBottom: '1px solid #000000', padding: '0.5rem 0.5rem'}} className="font-medium text-gray-900">{city || '—'}</td>
                                    </tr>
                                    <tr>
                                        <td style={{borderBottom: '1px solid #000000', padding: '0.5rem 0.5rem'}} className="text-gray-500">State</td>
                                        <td style={{borderBottom: '1px solid #000000', padding: '0.5rem 0.5rem'}} className="font-medium text-gray-900">{state || '—'}</td>
                                    </tr>
                                    <tr>
                                        <td style={{borderBottom: '1px solid #000000', padding: '0.5rem 0.5rem'}} className="text-gray-500">Pin / Zip</td>
                                        <td style={{borderBottom: '1px solid #000000', padding: '0.5rem 0.5rem'}} className="font-medium text-gray-900">{zip || '—'}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                            <h3 className="font-semibold text-gray-900 flex items-center">
                                <Truck className="mr-2 h-4 w-4 text-gray-500" />
                                Shipping Address
                            </h3>
                        </div>
                        <div className="p-6">
                            <address className="not-italic text-sm text-gray-700 leading-relaxed">
                                {addrLine1 || '—'}<br />
                                {addrLine2 ? `${addrLine2}<br />` : null}
                                {city || '—'}, {state || '—'} {zip || ''}<br />
                                {country || '—'}
                            </address>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
