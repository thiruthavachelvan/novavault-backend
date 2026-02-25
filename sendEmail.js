require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.sendgrid.net",
    port: 587,
    secure: false,
    auth: {
        user: "apikey",
        pass: process.env.SENDGRID_API_KEY,
    },
});

/**
 * Send an email using SendGrid SMTP via Nodemailer
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} text - Plain text body
 * @param {string} [html] - Optional HTML body
 * @returns {Promise<object>} - Nodemailer send result
 */
const sendEmail = async (to, subject, text, html) => {
    const info = await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to,
        subject,
        text,
        html: html || undefined,
    });

    console.log("Email sent:", info.messageId);
    return info;
};

module.exports = sendEmail;

// Run directly: node sendEmail.js
if (require.main === module) {
    sendEmail(
        "receiver@email.com",
        "SendGrid Test",
        "Working successfully",
        "<b>Hello, this email is sent using SendGrid and Nodemailer</b>"
    ).catch(console.error);
}
