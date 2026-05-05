'use server';

import { sendSubscriptionWelcomeEmail } from '@/lib/email';

export async function subscribeEmail(email) {
  if (!email || !email.includes('@')) {
    return { success: false, error: 'Please enter a valid email address.' };
  }

  try {
    // 1. Send the confirmation email
    const emailSent = await sendSubscriptionWelcomeEmail(email);

    if (!emailSent) {
      return { success: false, error: 'Failed to send confirmation email. Please try again later.' };
    }

    // Optional: Here you could also save the email to a database table like 'NewsletterSubscriber'
    
    return { success: true };
  } catch (error) {
    console.error("Subscription Error:", error);
    return { success: false, error: 'Something went wrong. Please try again later.' };
  }
}
