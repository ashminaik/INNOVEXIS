const mongoose = require('mongoose');
require('dotenv').config();

// Import User model
const User = require('./models/User');

async function updateTestUsername() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find and update test user
    const result = await User.findOneAndUpdate(
      { email: 'testuser@echonote.com' },
      { username: 'dummy user' },
      { new: true }
    );

    if (result) {
      console.log('✅ Test user updated successfully!');
      console.log('Email:', result.email);
      console.log('Username:', result.username);
    } else {
      console.log('❌ Test user not found');
    }

    await mongoose.connection.close();
    console.log('✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

updateTestUsername();
