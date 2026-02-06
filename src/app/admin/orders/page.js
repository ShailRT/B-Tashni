'use client';

import { Search, Filter, Eye } from 'lucide-react';
import Link from 'next/link';

export default function OrdersPage() {
    const orders = [
        { id: 'OD-1234', customer: 'Liam Johnson', date: '2024-02-04', amount: '₹250.00', status: 'Success', items: 3 },
        { id: 'OD-1235', customer: 'Olivia Smith', date: '2024-02-03', amount: '₹120.50', status: 'Processing', items: 1 },
        { id: 'OD-1236', customer: 'Noah Williams', date: '2024-02-03', amount: '₹450.00', status: 'Failed', items: 5 },
        { id: 'OD-1237', customer: 'Emma Brown', date: '2024-02-02', amount: '₹60.00', status: 'Success', items: 2 },
        { id: 'OD-1238', customer: 'James Jones', date: '2024-02-02', amount: '₹320.00', status: 'Success', items: 4 },
        { id: 'OD-1239', customer: 'Sophia Garcia', date: '2024-02-01', amount: '₹85.00', status: 'Pending', items: 1 },
        { id: 'OD-1240', customer: 'Lucas Miller', date: '2024-02-01', amount: '₹150.00', status: 'Success', items: 2 },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">Orders</h1>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm transition duration-150 ease-in-out"
                        placeholder="Search orders..."
                    />
                </div>
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <Filter className="-ml-1 mr-2 h-4 w-4 text-gray-400" />
                    Filter Status
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Order ID
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Customer
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th scope="col" className="relative px-6 py-3">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                                        <Link href={`/admin/orders/${order.id}`}>
                                            {order.id}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {order.customer}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {order.date}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${order.status === 'Success' ? 'bg-green-100 text-green-800' :
                                                order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                                                    order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {order.amount}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Link href={`/admin/orders/${order.id}`} className="text-gray-400 hover:text-blue-600">
                                            <Eye className="h-5 w-5" />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
