// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const  loginAdmin = require('../Controllers/auth.controller');

// POST /api/admin/login
router.post('/login', loginAdmin);

module.exports = router;
