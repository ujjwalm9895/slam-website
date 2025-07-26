const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();

// Enable CORS
app.use(cors({ origin: true }));
app.use(express.json());

// Email configuration
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: 'slam.robots@gmail.com',
    pass: process.env.CONTACT_EMAIL_PASS || 'rgeu ouzv ebeb borr'
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', message: 'SLAM Robotics API is running' });
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, linkedin, message } = req.body;

    const mailOptions = {
      from: 'slam.robots@gmail.com',
      to: 'slam.robots@gmail.com',
      subject: `Contact from ${name}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>LinkedIn:</strong> ${linkedin || 'Not provided'}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ success: false, message: 'Failed to send email' });
  }
});

// Product consultation endpoint
app.post('/api/consultation', async (req, res) => {
  try {
    const { name, email, phone, serviceType, preferredDate, notes } = req.body;

    const mailOptions = {
      from: 'slam.robots@gmail.com',
      to: 'slam.robots@gmail.com',
      subject: `Consultation Request from ${name}`,
      html: `
        <h3>New Consultation Request</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Service Type:</strong> ${serviceType}</p>
        <p><strong>Preferred Date:</strong> ${preferredDate}</p>
        <p><strong>Notes:</strong></p>
        <p>${notes}</p>
      `
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Consultation request sent successfully' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ success: false, message: 'Failed to send consultation request' });
  }
});

// Export the Express app as a Cloud Function
exports.api = functions.https.onRequest(app); 