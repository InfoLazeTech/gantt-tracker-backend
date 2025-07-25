const express = require('express');
const Admin = require('../Models/admin.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';


const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { adminId: admin._id, email: admin.email },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: 'Login failed', error: err.message });
    }
};

module.exports = loginAdmin;
