'use client';

import { MoreVertical, Edit, Trash2, Search, Filter, Plus, Loader2, Shield, User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getUsers, deleteUser, updateUserRole } from '@/app/actions/user';
import Image from 'next/image';

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await getUsers(search);
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchUsers();
        }, 300);
        return () => clearTimeout(timer);
    }, [search]);

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this user?')) return;
        setActionLoading(true);
        try {
            await deleteUser(id);
            await fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Failed to delete user');
        } finally {
            setActionLoading(false);
        }
    };

    const handleRoleUpdate = async (id, currentRole) => {
        const newRole = currentRole === 'ADMIN' ? 'CUSTOMER' : 'ADMIN';
        if (!confirm(`Change role to ${newRole}?`)) return;
        setActionLoading(true);
        try {
            await updateUserRole(id, newRole);
            await fetchUsers();
        } catch (error) {
            console.error('Error updating role:', error);
            alert('Failed to update role');
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">Users</h1>
                <Link href="/admin/users/create" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                    <Plus className="-ml-1 mr-2 h-4 w-4" />
                    Add User
                </Link>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm bg-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        placeholder="Search by name or email..."
                    />
                </div>
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                    <Filter className="-ml-1 mr-2 h-4 w-4 text-gray-400" />
                    Filters
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    User
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Role
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Joined
                                </th>
                                <th scope="col" className="relative px-6 py-3">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center">
                                            <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-2" />
                                            <p>Loading users...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                                        <p>No users found matching your search.</p>
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0 relative">
                                                    {user.imageUrl ? (
                                                        <Image
                                                            src={user.imageUrl}
                                                            alt=""
                                                            fill
                                                            className="rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                                            {(user.firstName || user.email).charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-semibold text-gray-900">
                                                        {user.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Guest User'}
                                                    </div>
                                                    <div className="text-sm text-gray-500">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(user.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end space-x-3">
                                                <button
                                                    onClick={() => handleRoleUpdate(user.id, user.role)}
                                                    disabled={actionLoading}
                                                    title="Toggle Role"
                                                    className="p-1.5 text-gray-400 hover:text-purple-600 rounded-lg hover:bg-purple-50 transition-all disabled:opacity-50"
                                                >
                                                    <Shield size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    disabled={actionLoading}
                                                    title="Delete User"
                                                    className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all disabled:opacity-50"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination (Simplified for now) */}
                <div className="bg-white px-4 py-3 border-t border-gray-200 flex items-center justify-between sm:px-6">
                    <div className="flex-1 flex justify-between sm:hidden">
                        <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                            Previous
                        </button>
                        <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                            Next
                        </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                Showing <span className="font-medium">{users.length}</span> results
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

