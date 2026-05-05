/**
 * Email templates for B-Tashni Store
 */

/**
 * Generates the HTML for an order confirmation email
 * @param {Object} order The order object
 * @returns {string} HTML content
 */
export function getOrderConfirmationHtml(order) {
  const { user, items, totalAmount, orderNumber, shippingAddress } = order;

  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        ${item.product.name} (x${item.quantity})
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
        ₹${item.price.toLocaleString()}
      </td>
    </tr>
  `).join('');

  return `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
      <!-- Header -->
      <div style="background-color: #ffffff; padding: 40px 20px; text-align: center; border-top: 4px solid #000000; border-bottom: 1px solid #eeeeee;">
        <img src="${process.env.NEXT_PUBLIC_APP_URL || 'https://btashni.in'}/logo.png" alt="B-TASHNI" style="height: 60px; width: auto; display: block; margin: 0 auto;">
      </div>

      <div style="padding: 40px;">
        <h2 style="color: #1a1a1a; margin-top: 0; font-size: 22px; font-weight: 600;">Order Confirmed</h2>
        <p style="color: #666666; font-size: 16px; line-height: 1.5;">
          Hello ${user?.firstName || shippingAddress?.firstName || 'Customer'},<br>
          Your order <span style="color: #000; font-weight: 600;">${orderNumber}</span> has been successfully placed and is now being prepared for shipment.
        </p>
        
        <!-- Order Items -->
        <table style="width: 100%; border-collapse: collapse; margin-top: 30px;">
          <thead>
            <tr>
              <th style="padding-bottom: 15px; text-align: left; border-bottom: 2px solid #000; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #000;">Product</th>
              <th style="padding-bottom: 15px; text-align: right; border-bottom: 2px solid #000; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #000;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td style="padding-top: 20px; font-weight: 700; font-size: 18px; color: #000; text-transform: uppercase;">Amount Paid</td>
              <td style="padding-top: 20px; font-weight: 700; font-size: 18px; color: #000; text-align: right;">₹${totalAmount.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>
        
        <!-- Customer Info -->
        <div style="margin-top: 40px; padding: 25px; background-color: #f8f8f8; border-radius: 4px;">
          <h3 style="margin-top: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #666; border-bottom: 1px solid #ddd; padding-bottom: 10px;">Customer Details</h3>
          <p style="margin: 15px 0 5px 0; font-size: 15px; color: #333;">
            <strong style="color: #000;">Name:</strong> ${shippingAddress?.firstName} ${shippingAddress?.lastName}
          </p>
          <p style="margin: 5px 0; font-size: 15px; color: #333;">
            <strong style="color: #000;">Email:</strong> ${user?.email || shippingAddress?.email}
          </p>
          <p style="margin: 5px 0; font-size: 15px; color: #333;">
            <strong style="color: #000;">Phone:</strong> ${shippingAddress?.phone}
          </p>
        </div>
        
        <div style="margin-top: 40px; text-align: center;">
          <p style="font-size: 14px; color: #999;">
            Thank you for choosing <strong style="color: #000;">B-TASHNI</strong>. We appreciate your business.
          </p>
          <p style="margin-top: 20px; font-size: 12px; color: #bbb;">
            If you have any questions regarding your order, please reply to this email.
          </p>
        </div>
      </div>
      
      <div style="background-color: #fcfcfc; padding: 20px; text-align: center; border-top: 1px solid #eee;">
        <p style="font-size: 11px; color: #aaa; margin: 0; letter-spacing: 1px; text-transform: uppercase;">
          © ${new Date().getFullYear()} B-TASHNI. All Rights Reserved.
        </p>
      </div>
    </div>
  `;
}

/**
 * Generates the HTML for a subscription welcome email
 * @returns {string} HTML content
 */
export function getSubscriptionWelcomeHtml() {
  return `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
      <!-- Header -->
      <div style="background-color: #ffffff; padding: 40px 20px; text-align: center; border-top: 4px solid #000000; border-bottom: 1px solid #eeeeee;">
        <img src="${process.env.NEXT_PUBLIC_APP_URL}/logo.png" alt="B-TASHNI" style="height: 60px; width: auto; display: block; margin: 0 auto;">
      </div>

      <div style="padding: 40px; text-align: center;">
        <h2 style="color: #1a1a1a; margin-top: 0; font-size: 22px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Welcome to the Circle</h2>
        <p style="color: #666666; font-size: 16px; line-height: 1.6; margin-top: 20px;">
          You've successfully joined the <strong style="color: #000;">B-TASHNI</strong> inner circle.
        </p>
        <p style="color: #666666; font-size: 16px; line-height: 1.6;">
          Get ready for early access to new drops, limited releases, and exclusive updates that define modern elegance.
        </p>
        
        <div style="margin: 40px 0; padding: 30px; background-color: #f8f8f8; border-radius: 4px; border-left: 4px solid #000;">
          <p style="margin: 0; font-size: 18px; font-weight: 500; color: #000;">Your exclusive access starts now.</p>
        </div>
        
        <p style="color: #666666; font-size: 16px; line-height: 1.6;">
          Stay tuned for what's coming next.
        </p>
        
        <div style="margin-top: 40px; border-top: 1px solid #eee; padding-top: 30px;">
          <p style="margin: 0; color: #000; font-weight: 600;">The B-TASHNI Team</p>
        </div>
      </div>
      
      <div style="background-color: #fcfcfc; padding: 20px; text-align: center; border-top: 1px solid #eee;">
        <p style="font-size: 11px; color: #aaa; margin: 0; letter-spacing: 1px; text-transform: uppercase;">
          © ${new Date().getFullYear()} B-TASHNI. All Rights Reserved.
        </p>
      </div>
    </div>
  `;
}
