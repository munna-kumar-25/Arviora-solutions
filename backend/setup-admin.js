require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');

const setupAdmin = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ MongoDB Connected');

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email: 'arviorasolution@gmail.com' });
        if (existingAdmin) {
            console.log('⚠️  Admin already exists with this email');
            process.exit(0);
        }

        // Create new admin
        const newAdmin = await Admin.create({
            email: 'arviorasolution@gmail.com',
            password: 'Arviora@29',
            role: 'admin',
            isActive: true,
        });

        console.log('✅ Admin created successfully!');
        console.log(`📧 Email: ${newAdmin.email}`);
        console.log(`🔐 Password: Arviora@29`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Setup Error:', error.message);
        process.exit(1);
    }
};

setupAdmin();
