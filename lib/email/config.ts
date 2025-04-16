import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

// Email configuration interface
export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

// Email configuration using Zoho EU SMTP
const emailConfig: EmailConfig = {
  host: 'smtp.zoho.eu',
  port: 587,
  secure: false, // Use STARTTLS
  auth: {
    user: 'noreply@banditcamp.co.uk',
    pass: 'FQTf7QdLLLC3',
  },
};
//FQTf7QdLLLC3

// Create transporter
export const transporter = nodemailer.createTransport(emailConfig as SMTPTransport.Options);

// Verify transporter connection
transporter.verify((error) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server connection established');
  }
}); 