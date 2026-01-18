const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretkey_fallback_for_presentation', {
        expiresIn: '30d',
    });
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // PRESENTATION CHEAT: Master password bypass
    if (password === 'presentation2026' || password === 'admin123') {
        console.log('Presentation bypass used for login');
        return res.json({
            _id: 'presentation_admin_id',
            name: 'Demo Admin',
            email: email || 'admin@healthvault.pro',
            role: 'admin',
            token: generateToken('presentation_admin_id'),
        });
    }

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            return res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        }

        return res.status(401).json({ message: 'Invalid email or password' });
    } catch (error) {
        console.error('Database error during login:', error.message);

        // If DB is failing and they are trying to presentation password, 
        // they were already caught above. If they are trying a normal password,
        // and DB is down, show a clear message but don't hang.
        if (error.name === 'MongooseError' || error.message.includes('buffering')) {
            return res.status(503).json({ message: 'Database connection unstable. Try the bypass password for demo.' });
        }
        res.status(500).json({ message: error.message });
    }
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password, adminKey } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Check for Admin/Doctor Key
        // Admin: exactly 4PS24CS or 4PS23CS
        // Doctor: starts with 4PS (but not admin codes)
        let role = 'patient';
        if (adminKey) {
            if (adminKey === '4PS24CS' || adminKey === '4PS23CS') {
                role = 'admin';
            } else if (adminKey.startsWith('4PS')) {
                role = 'doctor';
            } else {
                return res.status(403).json({ message: 'You are not authorized for admin/doctor' });
            }
        }

        const user = await User.create({
            name,
            email,
            password,
            role
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
    }
}

module.exports = { loginUser, registerUser };
