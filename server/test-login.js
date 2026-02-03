const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

async function testLogin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Find user
    const user = await User.findOne({ email: 'testuser@echonote.com' });
    
    if (!user) {
      console.log('❌ User not found');
      await mongoose.connection.close();
      return;
    }

    console.log('📋 User details:');
    console.log('   Email:', user.email);
    console.log('   Username:', user.username);
    console.log('   Auth Provider:', user.authProvider);
    console.log('   Password exists:', !!user.password);
    console.log('   Password length:', user.password?.length || 0);
    
    // Test password using the model's method
    console.log('\n🔐 Testing password verification...');
    const isValid = await user.comparePassword('TestUser@123');
    console.log('   Result using comparePassword():', isValid ? '✅ SUCCESS' : '❌ FAILED');
    
    // Also test direct bcrypt compare
    const directCompare = await bcrypt.compare('TestUser@123', user.password);
    console.log('   Result using direct bcrypt:', directCompare ? '✅ SUCCESS' : '❌ FAILED');

    // Show what the login endpoint would return
    if (isValid) {
      console.log('\n✅ LOGIN WOULD SUCCEED');
      console.log('   Token would be generated');
      console.log('   User data would be returned');
    } else {
      console.log('\n❌ LOGIN WOULD FAIL');
      console.log('   "Invalid credentials" error would be returned');
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

testLogin();
