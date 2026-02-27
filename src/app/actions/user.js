'use server';

import prisma from '../../lib/prisma';
import { revalidatePath } from 'next/cache';
import { currentUser, clerkClient } from '@clerk/nextjs/server';
import { syncUserFromClerk } from '../../lib/prisma-queries';

/**
 * Triggered on every page load via UserSync component
 */
export async function syncCurrentUser() {
    try {
        const user = await currentUser();
        if (!user) return null;
        return await syncUserFromClerk(user);
    } catch (error) {
        console.error('Error syncing user:', error);
        return null;
    }
}

/**
 * Fetch users from Prisma for the admin dashboard
 */
export async function getUsers(search = '') {
    try {
        const where = search ? {
            OR: [
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
            ],
        } : {};

        return await prisma.user.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });
    } catch (error) {
        console.error('Error in getUsers action:', error);
        return [];
    }
}

/**
 * Delete user from both Clerk and local database
 */
export async function deleteUser(id) {
    try {
        const client = await clerkClient();
        await client.users.deleteUser(id);

        await prisma.user.delete({
            where: { id: id },
        });

        revalidatePath('/admin/users');
        return { success: true };
    } catch (error) {
        console.error('Error deleting user:', error);
        throw new Error('Failed to delete user');
    }
}

/**
 * Toggle user role between ADMIN and CUSTOMER
 */
export async function updateUserRole(id, role) {
    try {
        await prisma.user.update({
            where: { id: id },
            data: { role },
        });

        revalidatePath('/admin/users');
        return { success: true };
    } catch (error) {
        console.error('Error updating role:', error);
        throw new Error('Failed to update role');
    }
}

/**
 * Create a new user in Clerk and the local database
 */
export async function createNewUser(data) {
    try {
        const client = await clerkClient();

        // 1. Create user in Clerk
        const clerkUser = await client.users.createUser({
            emailAddress: [data.email],
            firstName: data.firstName,
            lastName: data.lastName,
            password: data.password,
            skipPasswordChecks: true,
        });

        // 2. Sync to local database
        const newUser = await prisma.user.create({
            data: {
                id: clerkUser.id,
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                role: data.role || 'CUSTOMER',
            },
        });

        revalidatePath('/admin/users');
        return { success: true, user: newUser };
    } catch (error) {
        console.error('Error creating user:', error);
        throw new Error(error.message || 'Failed to create user');
    }
}

