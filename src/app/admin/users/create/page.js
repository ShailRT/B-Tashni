'use client';

import { ArrowLeft, Save, UserPlus, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createNewUser } from '@/app/actions/user';

export default function CreateUserPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        role: 'CUSTOMER',
        password: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const result = await createNewUser(formData);
            if (result.success) {
                router.push('/admin/users');
            }
        } catch (err) {
            setError(err.message || 'Failed to create user');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        // Map form IDs to formData keys
        const keyMap = {
            'first-name': 'firstName',
            'last-name': 'lastName',
            'email': 'email',
            'role': 'role',
            'password': 'password'
        };
        setFormData(prev => ({ ...prev, [keyMap[id] || id]: value }));
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link href="/admin/users" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft className="h-5 w-5 text-gray-500" />
                    </Link>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Add New User</h1>
                </div>
            </div>

            <div className="max-w-2xl">
                <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center">
                        <UserPlus className="mr-2 h-4 w-4 text-gray-500" />
                        <h3 className="font-semibold text-gray-900">User Details</h3>
                    </div>

                    {error && (
                        <div className="px-6 pt-4">
                            <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
                                {error}
                            </div>
                        </div>
                    )}

                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div className="col-span-2 sm:col-span-1">
                                <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">First Name</label>
                                <input
                                    type="text"
                                    id="first-name"
                                    required
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="John"
                                />
                            </div>

                            <div className="col-span-2 sm:col-span-1">
                                <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">Last Name</label>
                                <input
                                    type="text"
                                    id="last-name"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Doe"
                                />
                            </div>

                            <div className="col-span-2">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="john.doe@example.com"
                                />
                            </div>

                            <div className="col-span-2 sm:col-span-1">
                                <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                                <select
                                    id="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
                                >
                                    <option value="CUSTOMER">Customer</option>
                                    <option value="ADMIN">Admin</option>
                                </select>
                            </div>

                            <div className="col-span-2 sm:col-span-1">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Temporary Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    required
                                    minLength={8}
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="pt-4 flex items-center justify-end space-x-3 border-t border-gray-100 mt-6">
                            <Link href="/admin/users" className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="-ml-1 mr-2 h-4 w-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <Save className="-ml-1 mr-2 h-4 w-4" />
                                        Create User
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
