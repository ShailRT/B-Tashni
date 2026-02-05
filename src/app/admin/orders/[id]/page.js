'use client';

import { ArrowLeft, Save, Truck, MapPin, Package as PackageIcon } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function OrderDetailsPage() {
    const params = useParams();
    const orderId = params.id;

    // Mock data - normally would fetch based on ID
    const order = {
        id: orderId,
        customer: {
            name: 'Liam Johnson',
            email: 'liam@example.com',
            phone: '+1 (555) 0123-4567'
        },
        status: 'Processing',
        date: '2024-02-04',
        shippingAddress: {
            street: '123 Main St, Apt 4B',
            city: 'New York',
            state: 'NY',
            zip: '10001',
            country: 'USA'
        },
        items: [
            { id: 1, name: 'Premium Cotton T-Shirt', quantity: 2, price: '$45.00', total: '$90.00' },
            { id: 2, name: 'Slim Fit Jeans', quantity: 1, price: '$120.00', total: '$120.00' },
        ],
        subtotal: '$210.00',
        shipping: '$15.00',
        tax: '$25.00',
        total: '$250.00'
    };

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
                    <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
                        <Save className="-ml-1 mr-2 h-4 w-4" />
                        Save Changes
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Order Items using Col Span 2 */}
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
                    {/* Customer Info */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                            <h3 className="font-semibold text-gray-900 flex items-center">
                                <MapPin className="mr-2 h-4 w-4 text-gray-500" />
                                Customer
                            </h3>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center mb-4">
                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                    {order.customer.name.charAt(0)}
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-900">{order.customer.name}</p>
                                    <p className="text-xs text-gray-500">Customer since 2023</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Email</label>
                                    <p className="text-sm text-gray-900">{order.customer.email}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Phone</label>
                                    <p className="text-sm text-gray-900">{order.customer.phone}</p>
                                </div>
                            </div>
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
                                {order.shippingAddress.street}<br />
                                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}<br />
                                {order.shippingAddress.country}
                            </address>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
