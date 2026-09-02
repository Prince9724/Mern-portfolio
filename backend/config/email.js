const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Verify transporter connection
const verifyTransporter = async () => {
  try {
    await transporter.verify();
    console.log('✅ Email transporter verified successfully');
    return true;
  } catch (error) {
    console.error('❌ Email transporter verification failed:', error.message);
    console.error('💡 Please check your email credentials in .env file');
    return false;
  }
};

// Send email function
const sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Prince Gond Portfolio" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      html: html,
    });
    console.log('✅ Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Email error:', error.message);
    throw error;
  }
};

// Send contact notification to admin
const sendContactNotification = async (contactData) => {
  const { name, email, subject, message } = contactData;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #7c3aed, #a78bfa); padding: 20px; border-radius: 10px 10px 0 0; color: white; text-align: center; }
        .content { padding: 20px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #555; }
        .value { color: #333; padding: 8px 12px; background: #f9f9f9; border-radius: 5px; margin-top: 5px; }
        .footer { text-align: center; padding-top: 20px; border-top: 1px solid #eee; color: #888; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>📩 New Contact Message</h2>
          <p>From your portfolio website</p>
        </div>
        <div class="content">
          <div class="field">
            <div class="label">👤 Name</div>
            <div class="value">${name}</div>
          </div>
          <div class="field">
            <div class="label">📧 Email</div>
            <div class="value">${email}</div>
          </div>
          <div class="field">
            <div class="label">📝 Subject</div>
            <div class="value">${subject}</div>
          </div>
          <div class="field">
            <div class="label">💬 Message</div>
            <div class="value" style="white-space: pre-wrap;">${message}</div>
          </div>
        </div>
        <div class="footer">
          <p>This message was sent from your portfolio contact form.</p>
          <p>Reply to: <a href="mailto:${email}">${email}</a></p>
        </div>
      </div>
    </body>
    </html>
  `;

  const adminEmail = process.env.ADMIN_EMAIL || 'princegondrw123@gmail.com';
  
  return await sendEmail(
    adminEmail,
    `📩 New Contact: ${subject} from ${name}`,
    html
  );
};

// Send auto-reply to user
const sendAutoReply = async (userEmail, userName) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #7c3aed, #a78bfa); padding: 20px; border-radius: 10px 10px 0 0; color: white; text-align: center; }
        .content { padding: 20px; }
        .footer { text-align: center; padding-top: 20px; border-top: 1px solid #eee; color: #888; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>✅ Thank You for Contacting Me!</h2>
        </div>
        <div class="content">
          <p>Dear ${userName},</p>
          <p>Thank you for reaching out to me. I have received your message and will get back to you within 24-48 hours.</p>
          <p>In the meantime, feel free to:</p>
          <ul>
            <li>Check out my <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/#projects">projects</a></li>
            <li>Connect with me on <a href="https://linkedin.com/in/prince-gond-69090b375/">LinkedIn</a></li>
            <li>View my <a href="https://github.com/Prince9724">GitHub</a></li>
          </ul>
          <br>
          <p>Best regards,</p>
          <p><strong>Prince Gond</strong></p>
          <p><em>Full Stack MERN Developer</em></p>
        </div>
        <div class="footer">
          <p>This is an automated response. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail(
    userEmail,
    '✅ Thank You for Contacting Me - Prince Gond',
    html
  );
};

module.exports = { 
  sendEmail, 
  sendContactNotification, 
  sendAutoReply,
  verifyTransporter 
};