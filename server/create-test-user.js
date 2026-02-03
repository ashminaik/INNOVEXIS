const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import User model
const User = require('./models/User');

async function createTestUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if test user already exists
    const existingUser = await User.findOne({ email: 'testuser@echonote.com' });
    
    if (existingUser) {
      console.log('ℹ️  Test user already exists');
      console.log('Email:', existingUser.email);
      console.log('Username:', existingUser.username);
      await mongoose.connection.close();
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('TestUser@123', salt);

    // Create test user
    const testUser = new User({
      username: 'testuser',
      email: 'testuser@echonote.com',
      password: hashedPassword,
      authProvider: 'local'
    });

    await testUser.save();
    
    console.log('✅ Test user created successfully!');
    console.log('Email: testuser@echonote.com');
    console.log('Password: TestUser@123');
    console.log('Username: testuser');

    await mongoose.connection.close();
    console.log('✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createTestUser();
