const express = require("express");
const cors = require("cors");
const { Resend } = require("resend");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

// Endpoint
app.post("/send-email", async (req, res) => {
  const { firstName, lastName, email, contact, service, message } = req.body;

  if (!firstName || !lastName || !email || !contact || !service || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const response = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "Sewakmachines25@gmail.com",
      subject: `New Contact Request from ${firstName} ${lastName}`,
      text: `
      Name: ${firstName} ${lastName}
      Email: ${email}
      Contact: ${contact}
      Service: ${service}
      Message: ${message}
      `
    });

    console.log("Email sent:", response);  // Added for debugging
    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email. Please try again." });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
