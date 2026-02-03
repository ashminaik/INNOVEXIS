const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import User model
const User = require('./models/User');

async function verifyTestUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find test user
    const user = await User.findOne({ email: 'testuser@echonote.com' });
    
    if (!user) {
      console.log('❌ Test user NOT found in database');
      await mongoose.connection.close();
      return;
    }

    console.log('✅ Test user found:');
    console.log('   Email:', user.email);
    console.log('   Username:', user.username);
    console.log('   Auth Provider:', user.authProvider);
    console.log('   Has Password:', !!user.password);
    console.log('   Google ID:', user.googleId || 'N/A');

    // Test password verification
    const isMatch = await bcrypt.compare('TestUser@123', user.password);
    console.log('\n🔐 Password verification:', isMatch ? '✅ CORRECT' : '❌ FAILED');

    if (!isMatch) {
      console.log('\n⚠️  Password hash mismatch! Recreating user...');
      
      // Delete and recreate
      await User.deleteOne({ email: 'testuser@echonote.com' });
      
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('TestUser@123', salt);
      
      const newUser = new User({
        username: 'dummy user',
        email: 'testuser@echonote.com',
        password: hashedPassword,
        authProvider: 'local'
      });
      
      await newUser.save();
      console.log('✅ User recreated with correct password hash');
    }

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

verifyTestUser();
