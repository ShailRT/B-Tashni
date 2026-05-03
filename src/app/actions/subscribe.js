'use server';

import { sendEmail } from '@/lib/email';

export async function subscribeEmail(email) {
  if (!email || !email.includes('@')) {
    return { success: false, error: 'Please enter a valid email address.' };
  }

  try {
    // 1. Send the confirmation email
    const emailSent = await sendEmail({
      to: email,
      subject: 'Welcome to the BTASHNI Circle! 🎉',
      text: "You've successfully joined the BTASHNI emailer. Get ready for early access to new drops, limited releases, and exclusive updates.",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #191919;">
          <h2 style="text-transform: uppercase; letter-spacing: 2px;">Welcome to BTASHNI</h2>
          <p>You've successfully joined our inner circle.</p>
          <p>Get ready for early access to new drops, limited releases, and exclusive updates.</p>
          <br/>
          <p>Stay tuned,</p>
          <p><strong>The BTASHNI Team</strong></p>
        </div>
      `
    });

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
