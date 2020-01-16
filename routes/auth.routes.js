const { Router } = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const router = Router();

// /api/auth/register
router.post(
    '/register',
    [
        check('email', 'Incorrect email format').isEmail(),
        check('password', 'Minimal password length 6 symbols').isLength({ min: 6 }),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Incorrect data in registration',
                });
            }

            const { email, password } = req.body;

            const newUser = await User.findOne({ email });

            if (newUser) {
                return res.status(400).json({
                    message: 'User with this email exists',
                });
            }

            const hashedPassword = await bcrypt.hash(password, 12);
            const user = new User({ email, password: hashedPassword });

            await user.save();

            res.status(201).json({
                message: 'User created',
            });
        } catch (e) {
            res.status(500).json({
                message: 'Something went wrong, try again',
            });
        }
    }
);

// /api/auth/login
router.post(
    '/login',
    [
        check('email', 'Incorrect email format').normalizeEmail().isEmail(),
        check('password', 'Enter password').exists(),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Incorrect data in login',
                });
            }

            const { email, password } = req.body;

            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({
                    message: 'User not found',
                });
            }
            
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({
                    message: 'Password incorrect',
                });
            }

            const token = jwt.sign(
                { userId: user.id },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_TOKEN_LIFE }
            );

            res.json({ token });
        } catch (e) {
            res.status(500).json({
                message: 'Something went wrong, try again',
            });
        }
    }
);

module.exports = router;