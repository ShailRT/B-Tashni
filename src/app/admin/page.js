'use client';

import { useState, useEffect } from 'react';
import {
    DollarSign,
    Users,
    ShoppingBag,
    TrendingUp,
    CreditCard
} from 'lucide-react';
import { fetchAllOrders } from '@/app/actions/orders';
import { getUsers } from '@/app/actions/user';
import { getAdminProductsAction } from '@/app/actions/products';

export default function AdminDashboard() {
    const [statsData, setStatsData] = useState({
        totalRevenue: 0,
        totalCustomers: 0,
        totalOrders: 0,
        totalProducts: 0,
        loading: true
    });
    const [recentTransactions, setRecentTransactions] = useState([]);

    useEffect(() => {
        async function loadDashboardData() {
            try {
                // Fetch orders from the same API used by the orders page for consistency
                const res = await fetch('/api/admin/orders?limit=100');
                const ordersResult = await res.json();
                const orders = ordersResult.orders || [];

                // Calculate revenue from non-cancelled and non-refunded orders
                const revenue = orders
                    .filter(order => !['CANCELLED', 'REFUNDED'].includes(order.status))
                    .reduce((sum, order) => sum + (order.totalAmount || 0), 0);

                // Fetch users and products in parallel
                const [users, productsRes] = await Promise.all([
                    getUsers(),
                    getAdminProductsAction({ limit: 1 })
                ]);

                setStatsData({
                    totalRevenue: revenue,
                    totalCustomers: users.length,
                    totalOrders: ordersResult.total || orders.length,
                    totalProducts: productsRes.total || 0,
                    loading: false
                });

                // Recent transactions - robust mapping
                const formattedRecent = orders.slice(0, 5).map(order => {
                    // Fallback to shipping address if user relation is missing (Guest checkout)
                    const shipping = order.shippingAddress || {};

                    return {
                        id: order.id.slice(-6).toUpperCase(),
                        firstName: order.user?.firstName || shipping.firstName || "Guest",
                        lastName: order.user?.lastName || shipping.lastName || "",
                        email: order.user?.email || shipping.email || "N/A",
                        amount: `₹${order.totalAmount?.toLocaleString('en-IN')}`,
                        status: order.status,
                        date: new Date(order.createdAt).toISOString().split('T')[0]
                    };
                });
                setRecentTransactions(formattedRecent);
            } catch (error) {
                console.error("Dashboard Load Error:", error);
                setStatsData(prev => ({ ...prev, loading: false }));
            }
        }

        loadDashboardData();
    }, []);

    const stats = [
        {
            title: 'Total Revenue',
            value: statsData.loading ? '...' : `₹${statsData.totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`,
            change: '',
            icon: DollarSign,
            color: 'bg-green-500'
        },
        {
            title: 'Total Customers',
            value: statsData.loading ? '...' : statsData.totalCustomers.toLocaleString(),
            change: '',
            icon: Users,
            color: 'bg-blue-500'
        },
        {
            title: 'Total Orders',
            value: statsData.loading ? '...' : statsData.totalOrders.toLocaleString(),
            change: '',
            icon: ShoppingBag,
            color: 'bg-purple-500'
        },
        {
            title: 'Total Products',
            value: statsData.loading ? '...' : statsData.totalProducts.toLocaleString(),
            change: '',

            icon: TrendingUp,
            color: 'bg-orange-500'
        }
    ];

    if (statsData.loading) {
        return (
            <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[100] flex flex-col items-center justify-center">
                <div className="flex flex-col items-center">
                    <img src="/logo.png" alt="B-Tashni" className="h-8 mb-8 animate-pulse grayscale" />
                    <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-6 text-[10px] font-bold text-black tracking-[0.2em] uppercase">Initializing BTASHNI Admin</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard</h1>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between space-y-0 pb-2">
                                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                                <div className={`p-2 rounded-full ${stat.color} bg-opacity-10 text-opacity-100`}>
                                    <Icon className={`h-4 w-4 text-black`} />
                                </div>
                            </div>
                            <div className="mt-2">
                                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>

                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Recent Sales/Orders */}
                <div className="col-span-4 rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-900">Recent Orders</h3>
                        <p className="text-sm text-gray-500">You have {statsData.totalOrders} total sales.</p>
                    </div>
                    <div className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3">Customer</th>
                                        <th className="px-6 py-3">Status</th>
                                        <th className="px-6 py-3">Amount</th>
                                        <th className="px-6 py-3">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentTransactions.map((transaction) => (
                                        <tr key={transaction.id} className="border-b last:border-0 hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-gray-900">{transaction.firstName} {transaction.lastName}</span>
                                                    <span className="text-[10px] text-gray-400">{transaction.email}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`
                            px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${transaction.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                                                        transaction.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                            transaction.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                                                                'bg-gray-100 text-gray-800'}
                          `}>
                                                    {transaction.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">{transaction.amount}</td>
                                            <td className="px-6 py-4 text-gray-500">{transaction.date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Recent Activity/Overview - Placeholder for another widget */}
                <div className="col-span-3 rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-900">Overview</h3>
                        <p className="text-sm text-gray-500">Monthly sales performance</p>
                    </div>
                    <div className="p-6 flex items-center justify-center h-64">
                        <div className="text-center text-gray-500">
                            <CreditCard className="h-12 w-12 mx-auto mb-2 opacity-20" />
                            <p>Chart visualization would go here</p>
                            <p className="text-xs">(Requires chart library)</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
