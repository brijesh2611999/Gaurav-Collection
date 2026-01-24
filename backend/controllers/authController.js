const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const nodemailer = require('nodemailer');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Send OTP Email
const sendOtpEmail = async (email, otp) => {
    try {
        console.log('🔗 [DEBUG] Attempting to connect to email server:', process.env.MAIL_HOST);
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: 587, // Port 587 is more reliable on cloud platforms like Render
            secure: false, // true for 465, false for 587
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            },
            connectionTimeout: 10000, // 10 seconds
        });

        // Quick check if the connection to the email server works
        try {
            await transporter.verify();
            console.log('✅ [DEBUG] Transporter verified - ready to send');
        } catch (verifyErr) {
            console.error('❌ [DEBUG] Transporter verification failed:', verifyErr.message);
            // We ignore and try to send anyway, or return false early
        }

        const mailOptions = {
            from: `"Gaurav Collection" <${process.env.MAIL_USER}>`,
            to: email,
            subject: 'Verify Your Account - Gaurav Collection',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h1 style="color: #FF0000; margin: 0;">Gaurav Collection</h1>
                    </div>
                    <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; text-align: center;">
                        <h2 style="color: #333; margin-top: 0;">Verification Code</h2>
                        <p style="color: #666; font-size: 16px;">Please use the following OTP to verify your account:</p>
                        <div style="font-size: 32px; font-weight: bold; color: #FF0000; letter-spacing: 5px; margin: 20px 0;">
                            ${otp}
                        </div>
                        <p style="color: #999; font-size: 14px;">This code will expire in 10 minutes.</p>
                    </div>
                    <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #aaa;">
                        <p>If you didn't request this code, you can ignore this email.</p>
                        <p>&copy; ${new Date().getFullYear()} Gaurav Collection. All rights reserved.</p>
                    </div>
                </div>
            `
        };

        const result = await transporter.sendMail(mailOptions);
        console.log(`✅ [DEBUG] Email sent successfully: ${result.messageId}`);
        return true;
    } catch (error) {
        console.error('❌ [DEBUG] sendOtpEmail function failed:', error.message);
        return false;
    }
};

// Register User
exports.registerUser = async (req, res) => {
    try {
        console.log('📝 [DEBUG] Registration started for:', req.body?.email);
        const { name, email, password } = req.body;

        if (!email || !password || !name) {
            console.log('⚠️ [DEBUG] Validation failed: Missing fields');
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const normalizedEmail = email.toLowerCase();
        console.log('🔍 [DEBUG] Checking user existence for:', normalizedEmail);
        const userExists = await User.findOne({ email: normalizedEmail });

        if (userExists) {
            if (!userExists.isVerified) {
                console.log('🔄 [DEBUG] User exists but unverified. Updating...');
                const otp = Math.floor(100000 + Math.random() * 900000).toString();
                userExists.otp = otp;
                userExists.otpExpires = Date.now() + 10 * 60 * 1000;
                userExists.name = name;
                userExists.password = password;
                await userExists.save();
                console.log('✅ [DEBUG] User updated/saved in DB');

                try {
                    await sendOtpEmail(normalizedEmail, otp);
                    console.log('📧 [DEBUG] OTP Email (re)sent');
                } catch (emailErr) {
                    console.error('❌ [DEBUG] Email resend failed:', emailErr.message);
                }

                return res.status(200).json({ message: 'OTP sent to email', email: normalizedEmail, requireOtp: true });
            }
            console.log('🚫 [DEBUG] User already exists and verified');
            return res.status(400).json({ message: 'User already exists' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        console.log('🆕 [DEBUG] Creating new User document...');

        const user = new User({
            name,
            email: normalizedEmail,
            password,
            otp,
            otpExpires: Date.now() + 10 * 60 * 1000,
            isVerified: false
        });

        console.log('💾 [DEBUG] Executing user.save()...');
        await user.save();
        console.log('✅ [DEBUG] User saved to DB successfully');

        console.log('📧 [DEBUG] Attempting to send OTP email...');
        try {
            await sendOtpEmail(normalizedEmail, otp);
            console.log('✅ [DEBUG] OTP Email sent');
        } catch (emailErr) {
            console.error('❌ [DEBUG] Email service error (continuing):', emailErr.message);
        }

        console.log('🚀 [DEBUG] Sending 201 response to client');
        return res.status(201).json({
            message: 'OTP sent to email',
            email: user.email,
            requireOtp: true
        });
    } catch (error) {
        console.error('❌ [FATAL ERROR] Registration process crashed:', error);
        return res.status(500).json({
            message: error.message || 'Internal Server Error',
            details: error.name
        });
    }
};

// Verify OTP
exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const normalizedEmail = email.toLowerCase();

        const user = await User.findOne({
            email: normalizedEmail,
            otp,
            otpExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            role: user.role,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Login User
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const normalizedEmail = email.toLowerCase();

        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        if (!user.isVerified) {
            return res.status(401).json({ message: 'Account not verified. Please signup again to verify.' });
        }

        const isMatch = await user.comparePassword(password);
        if (isMatch) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Google Login
exports.googleLogin = async (req, res) => {
    try {
        const { token } = req.body;

        // Verify Google token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const { name, email, picture, sub: googleId } = ticket.getPayload();

        if (!email) return res.status(400).json({ message: 'Email required' });

        const normalizedEmail = email.toLowerCase();
        let user = await User.findOne({ email: normalizedEmail });

        if (user) {
            // Link google ID if not linked
            if (!user.googleId) {
                user.googleId = googleId;
                await user.save();
            }
            // Auto verify if not
            if (!user.isVerified) {
                user.isVerified = true;
                await user.save();
            }
        } else {
            // Create new Google user
            user = await User.create({
                name,
                email: normalizedEmail,
                password: await require('bcryptjs').hash(Math.random().toString(36), 10), // Random password
                avatar: picture,
                googleId,
                isVerified: true,
                role: 'user'
            });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            role: user.role,
            token: generateToken(user._id),
        });

    } catch (error) {
        console.error('Google Login Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get User Profile
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                role: user.role,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get All Users (Admin only)
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
