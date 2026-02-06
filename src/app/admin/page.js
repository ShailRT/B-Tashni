'use client';

import {
    DollarSign,
    Users,
    ShoppingBag,
    TrendingUp,
    CreditCard,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';

export default function AdminDashboard() {
    const stats = [
        {
            title: 'Total Revenue',
            value: '₹45,231.89',
            change: '+20.1% from last month',
            trend: 'up',
            icon: DollarSign,
            color: 'bg-green-500'
        },
        {
            title: 'Total Customers',
            value: '2,350',
            change: '+180.1% from last month',
            trend: 'up',
            icon: Users,
            color: 'bg-blue-500'
        },
        {
            title: 'Total Orders',
            value: '12,234',
            change: '+19% from last month',
            trend: 'up',
            icon: ShoppingBag,
            color: 'bg-purple-500'
        },
        {
            title: 'Active Now',
            value: '+573',
            change: '+201 since last hour',
            trend: 'up',
            icon: TrendingUp,
            color: 'bg-orange-500'
        }
    ];

    const recentTransactions = [
        {
            id: "OD-1234",
            user: "Liam Johnson",
            email: "liam@example.com",
            amount: "₹250.00",
            status: "Success",
            date: "2024-02-04"
        },
        {
            id: "OD-1235",
            user: "Olivia Smith",
            email: "olivia@example.com",
            amount: "₹120.50",
            status: "Processing",
            date: "2024-02-03"
        },
        {
            id: "OD-1236",
            user: "Noah Williams",
            email: "noah@example.com",
            amount: "₹450.00",
            status: "Failed",
            date: "2024-02-03"
        },
        {
            id: "OD-1237",
            user: "Emma Brown",
            email: "emma@example.com",
            amount: "₹60.00",
            status: "Success",
            date: "2024-02-02"
        },
        {
            id: "OD-1238",
            user: "James Jones",
            email: "james@example.com",
            amount: "₹320.00",
            status: "Success",
            date: "2024-02-02"
        }
    ];

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
                                <p className="text-xs text-gray-500 mt-1 flex items-center">
                                    {stat.trend === 'up' ? (
                                        <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                                    ) : (
                                        <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                                    )}
                                    <span className={stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                                        {stat.change}
                                    </span>
                                </p>
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
                        <p className="text-sm text-gray-500">You made 265 sales this month.</p>
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
                                            <td className="px-6 py-4 font-medium text-gray-900">
                                                <div className="flex flex-col">
                                                    <span>{transaction.user}</span>
                                                    <span className="text-xs text-gray-500">{transaction.email}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`
                           px-2.5 py-0.5 rounded-full text-xs font-medium
                           ${transaction.status === 'Success' ? 'bg-green-100 text-green-800' :
                                                        transaction.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                                                            'bg-red-100 text-red-800'}
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
