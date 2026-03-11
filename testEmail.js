require("dotenv").config();
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
    to: "thirukumar3210@gmail.com", // Send to self for testing
    from: process.env.EMAIL_FROM,
    subject: "Test Password Reset Error",
    text: "Testing SendGrid authentication"
};

sgMail.send(msg)
    .then(() => {
        console.log("SUCCESS: Email sent successfully");
    })
    .catch((error) => {
        console.error("ERROR:");
        console.error(error.message);
        if (error.response) {
            console.error(error.response.body);
        }
    });
