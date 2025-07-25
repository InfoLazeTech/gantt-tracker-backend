const mongoose = require('mongoose');
const Admin = require('./Models/admin.model');
require('dotenv').config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        const existingAdmin = await Admin.findOne({ email: 'admin@gmail.com' });

        if (existingAdmin) {
            console.log('✅ Admin already exists');
        } else {
            const newAdmin = new Admin({
                email: 'admin@gmail.com',
                password: 'Admin@123'  // Plain password will be hashed by pre-save hook
            });

            await newAdmin.save();
            console.log('✅ Admin created successfully');
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error('❌ Error seeding admin:', err);
        process.exit(1);
    }
};

seedAdmin();
