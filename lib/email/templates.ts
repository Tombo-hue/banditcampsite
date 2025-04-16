// Email template interfaces
export interface EmailTemplate {
  subject: string;
  html: string;
}

export interface OrderConfirmationData {
  orderNumber: string;
  customerName: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    config?: Record<string, any>;
  }>;
  total: number;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  shippingMethod?: string;
}

export interface DeliveryUpdateData {
  orderNumber: string;
  customerName: string;
  status: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Template generators
export const generateOrderConfirmationEmail = (data: OrderConfirmationData): EmailTemplate => {
  const currentYear = new Date().getFullYear();
  const itemsList = data.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 16px; border-bottom: 1px solid #f0f0f0;">
          <p style="margin: 0; color: #1a1a1a; font-size: 16px;">${item.name}</p>
          ${item.config ? `
          <p style="margin: 4px 0 0; color: #6a6a6a; font-size: 14px;">
            ${Object.entries(item.config)
              .map(([key, value]) => {
                if (key === 'extras' && typeof value === 'object') {
                  const extras = Object.entries(value)
                    .filter(([_, enabled]) => enabled)
                    .map(([name]) => name)
                    .join(', ');
                  return extras ? `Extras: ${extras}` : '';
                }
                return `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`;
              })
              .filter(Boolean)
              .join(', ')}
          </p>
          ` : ''}
        </td>
        <td style="padding: 16px; border-bottom: 1px solid #f0f0f0; text-align: center;">
          <p style="margin: 0; color: #1a1a1a; font-size: 16px;">${item.quantity}</p>
        </td>
        <td style="padding: 16px; border-bottom: 1px solid #f0f0f0; text-align: right;">
          <p style="margin: 0; color: #1a1a1a; font-size: 16px;">£${item.price.toFixed(2)}</p>
        </td>
        <td style="padding: 16px; border-bottom: 1px solid #f0f0f0; text-align: right;">
          <p style="margin: 0; color: #1a1a1a; font-size: 16px;">£${(item.quantity * item.price).toFixed(2)}</p>
        </td>
      </tr>
    `
    )
    .join('');

  // Check if this is a differential service order (reinforcement or sending in a diff)
  const isDiffService = data.items.some(item => 
    item.name === 'reinforced-differentials' && 
    item.config && 
    ['reinforcement-with-diff', 'reinforcement-only'].includes(item.config.diffType)
  );

  // Generate special notes based on order type
  const specialNotes = [];
  if (data.shippingMethod === 'pickup') {
    specialNotes.push(`
      <div style="background-color: #f0f7ff; border-radius: 8px; padding: 16px; margin-top: 20px;">
        <p style="margin: 0; color: #1a1a1a; font-size: 14px;">
          <strong>Pickup Note:</strong> We will contact you shortly to arrange a convenient pickup time from our Chester/Flint location.
        </p>
      </div>
    `);
  }
  if (isDiffService) {
    specialNotes.push(`
      <div style="background-color: #f0f7ff; border-radius: 8px; padding: 16px; margin-top: 20px;">
        <p style="margin: 0; color: #1a1a1a; font-size: 14px;">
          <strong>Service Note:</strong> Our team will contact you within 1-2 business days to arrange the delivery/collection of your differential for servicing.
        </p>
      </div>
    `);
  }

  return {
    subject: `Order Confirmed - ${data.orderNumber}`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Confirmation</title>
          <style>
            body {
              margin: 0;
              padding: 0;
              font-family: 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #1a1a1a;
              background-color: #f8f8f8;
            }
          </style>
        </head>
        <body>
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #ffffff;">
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 40px;">
              <svg width="48" height="48" viewBox="0 0 24 24" style="margin: 0 auto;">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" 
                      stroke="#1a1a1a" 
                      fill="none" 
                      stroke-width="1.5"
                      stroke-linecap="round" 
                      stroke-linejoin="round"/>
              </svg>
              <h1 style="margin: 20px 0 0; color: #1a1a1a; font-size: 24px; font-weight: 600;">
                Order Confirmation
              </h1>
              <p style="margin: 10px 0 0; color: #6a6a6a; font-size: 16px;">
                Order #${data.orderNumber}
              </p>
            </div>

            <!-- Main Content -->
            <div style="background: linear-gradient(to bottom right, #f8f8f8, #ffffff); border-radius: 12px; padding: 30px; margin-bottom: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
              <p style="margin: 0 0 20px; color: #1a1a1a; font-size: 16px;">
                Hi ${data.customerName},
              </p>
              <p style="margin: 0 0 20px; color: #4a4a4a; font-size: 16px;">
                Thank you for your order! We're excited to confirm that your order has been received and is being processed. Below you'll find your order details and receipt.
              </p>

              <!-- Order Summary -->
              <div style="background-color: #ffffff; border-radius: 8px; padding: 20px; margin: 30px 0; border: 1px solid #f0f0f0;">
                <h2 style="margin: 0 0 20px; color: #1a1a1a; font-size: 18px; font-weight: 600;">
                  Order Summary
                </h2>

                <!-- Items Table -->
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                  <thead>
                    <tr>
                      <th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #f0f0f0; color: #6a6a6a; font-size: 14px; font-weight: 500;">Item</th>
                      <th style="padding: 12px 16px; text-align: center; border-bottom: 2px solid #f0f0f0; color: #6a6a6a; font-size: 14px; font-weight: 500;">Qty</th>
                      <th style="padding: 12px 16px; text-align: right; border-bottom: 2px solid #f0f0f0; color: #6a6a6a; font-size: 14px; font-weight: 500;">Price</th>
                      <th style="padding: 12px 16px; text-align: right; border-bottom: 2px solid #f0f0f0; color: #6a6a6a; font-size: 14px; font-weight: 500;">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsList}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colspan="3" style="padding: 16px; text-align: right; color: #1a1a1a; font-size: 16px; font-weight: 600;">Total:</td>
                      <td style="padding: 16px; text-align: right; color: #1a1a1a; font-size: 16px; font-weight: 600;">£${data.total.toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>

                <!-- Shipping Details -->
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #f0f0f0;">
                  <h3 style="margin: 0 0 15px; color: #1a1a1a; font-size: 16px; font-weight: 600;">Shipping Details</h3>
                  <p style="margin: 0; color: #4a4a4a; font-size: 14px; line-height: 1.6;">
                    ${data.shippingAddress.street}<br>
                    ${data.shippingAddress.city}<br>
                    ${data.shippingAddress.state}<br>
                    ${data.shippingAddress.postalCode}<br>
                    ${data.shippingAddress.country}
                  </p>
                </div>

                ${specialNotes.join('')}
              </div>

              <!-- Next Steps -->
              <div style="background-color: #f8f8f8; border-radius: 8px; padding: 20px; margin: 30px 0;">
                <h3 style="margin: 0 0 15px; color: #1a1a1a; font-size: 16px; font-weight: 600;">What's Next?</h3>
                <p style="margin: 0; color: #4a4a4a; font-size: 14px;">
                  1. We'll begin processing your order immediately.<br>
                  2. You'll receive updates about your order status via email.<br>
                  3. If you have any questions about your order, please don't hesitate to contact us.
                </p>
              </div>
            </div>

            <!-- Footer -->
            <div style="text-align: center; padding-top: 30px; border-top: 1px solid #f0f0f0;">
              <p style="margin: 0 0 10px; color: #6a6a6a; font-size: 14px;">
                Thank you for choosing The Bandit Camp!<br>
                The Bandit Camp Team
              </p>
              <div style="margin-top: 20px;">
                <p style="margin: 0; color: #8a8a8a; font-size: 12px;">
                  © ${currentYear} The Bandit Camp. All rights reserved.
                </p>
                <p style="margin: 5px 0 0; color: #8a8a8a; font-size: 12px;">
                  Chester/Flint, United Kingdom
                </p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
  };
};

export const generateDeliveryUpdateEmail = (data: DeliveryUpdateData): EmailTemplate => {
  return {
    subject: `Delivery Update - Order ${data.orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Delivery Update</h1>
        <p>Dear ${data.customerName},</p>
        
        <p>We have an update regarding your order #${data.orderNumber}:</p>
        <p><strong>Status:</strong> ${data.status}</p>
        
        ${data.trackingNumber ? `<p><strong>Tracking Number:</strong> ${data.trackingNumber}</p>` : ''}
        ${data.estimatedDelivery ? `<p><strong>Estimated Delivery:</strong> ${data.estimatedDelivery}</p>` : ''}
        
        <p>If you have any questions, please don't hesitate to contact us.</p>
        
        <p>Best regards,<br>The Bandit Camp Team</p>
      </div>
    `,
  };
};

export const generateContactFormConfirmation = (data: ContactFormData): EmailTemplate => {
  const currentYear = new Date().getFullYear();
  
  return {
    subject: `We've received your message - ${data.subject}`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Contact Form Submission</title>
          <style>
            body {
              margin: 0;
              padding: 0;
              font-family: 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #1a1a1a;
              background-color: #f8f8f8;
            }
          </style>
        </head>
        <body>
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #ffffff;">
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 40px;">
              <svg width="48" height="48" viewBox="0 0 24 24" style="margin: 0 auto;">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" 
                      stroke="#1a1a1a" 
                      fill="none" 
                      stroke-width="1.5"
                      stroke-linecap="round" 
                      stroke-linejoin="round"/>
              </svg>
              <h1 style="margin: 20px 0 0; color: #1a1a1a; font-size: 24px; font-weight: 600;">
                Message Received
              </h1>
            </div>

            <!-- Main Content -->
            <div style="background: linear-gradient(to bottom right, #f8f8f8, #ffffff); border-radius: 12px; padding: 30px; margin-bottom: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
              <p style="margin: 0 0 20px; color: #1a1a1a; font-size: 16px;">
                Hi ${data.name},
              </p>
              <p style="margin: 0 0 20px; color: #4a4a4a; font-size: 16px;">
                Thank you for reaching out to The Bandit Camp. We've received your message and our team will review it shortly. You can expect to hear back from us within 1-2 business days.
              </p>
              
              <!-- Message Details -->
              <div style="background-color: #ffffff; border-radius: 8px; padding: 20px; margin: 30px 0; border: 1px solid #f0f0f0;">
                <h2 style="margin: 0 0 20px; color: #1a1a1a; font-size: 18px; font-weight: 600;">
                  Your Message Details
                </h2>
                
                <div style="margin-bottom: 15px;">
                  <p style="margin: 0 0 5px; color: #6a6a6a; font-size: 14px;">Subject</p>
                  <p style="margin: 0; color: #1a1a1a; font-size: 16px;">${data.subject}</p>
                </div>
                
                <div style="margin-bottom: 15px;">
                  <p style="margin: 0 0 5px; color: #6a6a6a; font-size: 14px;">Email</p>
                  <p style="margin: 0; color: #1a1a1a; font-size: 16px;">${data.email}</p>
                </div>
                
                <div>
                  <p style="margin: 0 0 5px; color: #6a6a6a; font-size: 14px;">Message</p>
                  <p style="margin: 0; color: #1a1a1a; font-size: 16px; white-space: pre-wrap;">${data.message}</p>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div style="text-align: center; padding-top: 30px; border-top: 1px solid #f0f0f0;">
              <p style="margin: 0 0 10px; color: #6a6a6a; font-size: 14px;">
                Best regards,<br>
                The Bandit Camp Team
              </p>
              <div style="margin-top: 20px;">
                <p style="margin: 0; color: #8a8a8a; font-size: 12px;">
                  © ${currentYear} The Bandit Camp. All rights reserved.
                </p>
                <p style="margin: 5px 0 0; color: #8a8a8a; font-size: 12px;">
                  Chester/Flint, United Kingdom
                </p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
  };
}; 