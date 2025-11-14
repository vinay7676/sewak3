const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Simple email endpoint using Resend
app.post('/send-email', async (req, res) => {
  const { firstName, lastName, email, contact, service, message } = req.body;

  if (!firstName || !lastName || !email || !contact || !service || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    // Using fetch API (built-in, no package needed!)
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev', // Free domain provided by Resend
        to: 'Sewakmachines25@gmail.com',
        subject: `New Contact Request from ${firstName} ${lastName}`,
        html: `
          <h2>New Contact Request</h2>
          <p><strong>Name:</strong> ${firstName} ${lastName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Contact:</strong> ${contact}</p>
          <p><strong>Service:</strong> ${service}</p>
          <p><strong>Message:</strong> ${message}</p>
        `
      })
    });

    if (response.ok) {
      console.log('Email sent successfully!');
      res.status(200).json({ message: 'Email sent successfully!' });
    } else {
      const error = await response.json();
      console.error('Resend error:', error);
      res.status(500).json({ error: 'Failed to send email.' });
    }
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email.' });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
