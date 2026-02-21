'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect } from 'react';
import { syncCurrentUser } from '@/app/actions/user';

/**
 * UserSync component
 * This component handles syncing the Clerk user data to our local Prisma database
 * without needing webhooks. It runs when a user is logged in.
 */
export default function UserSync() {
    const { isLoaded, isSignedIn, user } = useUser();

    useEffect(() => {
        if (isLoaded && isSignedIn && user) {
            // Trigger the server action to sync user
            syncCurrentUser();
        }
    }, [isLoaded, isSignedIn, user]);

    return null; // This component doesn't render anything
}
