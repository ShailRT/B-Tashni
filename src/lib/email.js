import nodemailer from 'nodemailer';
import { getOrderConfirmationHtml, getSubscriptionWelcomeHtml } from './email-templates';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "sandbox.smtp.mailtrap.io",
  port: parseInt(process.env.SMTP_PORT || "2525"),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Sends an email using the configured SMTP server
 * @param {Object} options Email options
 * @param {string} options.to Recipient email address
 * @param {string} options.subject Email subject
 * @param {string} options.text Plain text version of the email
 * @param {string} [options.html] HTML version of the email (optional)
 * @returns {Promise<boolean>} True if sent successfully, false otherwise
 */
export async function sendEmail({ to, subject, text, html }) {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM_EMAIL || '"B-Tashni Store" <noreply@btashni.com>',
      to,
      subject,
      text,
      html: html || text,
    });

    console.log("Message sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}

/**
 * Sends an order confirmation email to the customer
 * @param {Object} order The order object with items and user details
 */
export async function sendOrderConfirmationEmail(order) {
  const { user, totalAmount, orderNumber, shippingAddress } = order;
  
  // Determine recipient email: either from user profile or guest shipping address
  const recipientEmail = user?.email || shippingAddress?.email;
  
  if (!recipientEmail) {
    console.error("No email address found for order:", orderNumber);
    return false;
  }

  const subject = `B-TASHNI | Order Confirmed - ${orderNumber}`;
  const html = getOrderConfirmationHtml(order);

  return await sendEmail({
    to: recipientEmail,
    subject,
    text: `Order ${orderNumber} confirmed. Total: ₹${totalAmount}`,
    html
  });
}

/**
 * Sends a welcome email to a new subscriber
 * @param {string} email The subscriber's email address
 */
export async function sendSubscriptionWelcomeEmail(email) {
  const subject = 'B-TASHNI | Welcome to the Circle! 🎉';
  const html = getSubscriptionWelcomeHtml();

  return await sendEmail({
    to: email,
    subject,
    text: "You've successfully joined the BTASHNI emailer. Get ready for early access to new drops, limited releases, and exclusive updates.",
    html
  });
}

