import { transporter } from './config';
import {
  EmailTemplate,
  OrderConfirmationData,
  DeliveryUpdateData,
  ContactFormData,
  generateOrderConfirmationEmail,
  generateDeliveryUpdateEmail,
  generateContactFormConfirmation,
} from './templates';

class EmailService {
  private async sendEmail(to: string, template: EmailTemplate) {
    try {
      const result = await transporter.sendMail({
        from: 'The Bandit Camp <noreply@banditcamp.co.uk>',
        to,
        subject: template.subject,
        html: template.html,
      });
      
      console.log('Email sent successfully:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error;
    }
  }

  async sendOrderConfirmation(to: string, data: OrderConfirmationData) {
    const template = generateOrderConfirmationEmail(data);
    return this.sendEmail(to, template);
  }

  async sendDeliveryUpdate(to: string, data: DeliveryUpdateData) {
    const template = generateDeliveryUpdateEmail(data);
    return this.sendEmail(to, template);
  }

  async sendContactFormConfirmation(to: string, data: ContactFormData) {
    const template = generateContactFormConfirmation(data);
    return this.sendEmail(to, template);
  }

  // Add more email sending methods as needed
}

// Export a singleton instance
export const emailService = new EmailService(); 