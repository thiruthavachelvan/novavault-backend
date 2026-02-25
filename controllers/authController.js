const User = require("../models/User");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);


// FORGOT PASSWORD
exports.forgotPassword = async (req, res) => {

    try {

        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // generate random token
        const token = crypto.randomBytes(32).toString("hex");

        // save token in database
        user.resetToken = token;

        // token expiry (10 minutes)
        user.resetTokenExpiry = Date.now() + 10 * 60 * 1000;

        await user.save();

        const resetLink = `https://novavault-frontend.netlify.app/reset-password/${token}`;

        const msg = {
            to: user.email,
            from: "thirukumar3210@gmail.com",
            subject: "Password Reset",
            html: `
        <h2>Password Reset Request</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
    `
        };

        await sgMail.send(msg);

        res.json({
            message: "Password reset email sent successfully"
        });

    }
    catch (err) {

        console.log("SENDGRID ERROR:", err.response?.body || err);

        res.status(500).json({
            message: err.message
        });

    }

};



// RESET PASSWORD
exports.resetPassword = async (req, res) => {

    try {

        // get token from URL
        const { token } = req.params;

        // get new password from body
        const { password } = req.body;

        // find user with valid token and not expired
        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() }
        });

        // if token invalid or expired
        if (!user) {
            return res.status(400).json({
                message: "Invalid or expired token"
            });
        }

        // hash new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // update password
        user.password = hashedPassword;

        // remove reset token
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;

        await user.save();

        res.json({
            message: "Password reset successful"
        });

    }
    catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Server error"
        });

    }

};