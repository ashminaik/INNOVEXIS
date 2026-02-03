const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

async function fixTestUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Delete existing user
    await User.deleteOne({ email: 'testuser@echonote.com' });
    console.log('🗑️  Deleted old test user\n');

    // Create password hash manually first
    const plainPassword = 'TestUser@123';
    console.log('🔐 Creating password hash for:', plainPassword);
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);
    console.log('✅ Hash created, length:', hashedPassword.length);
    
    // Verify the hash works
    const testVerify = await bcrypt.compare(plainPassword, hashedPassword);
    console.log('✅ Hash verification test:', testVerify ? 'PASSED' : 'FAILED');
    
    if (!testVerify) {
      console.log('❌ Hash creation failed!');
      await mongoose.connection.close();
      return;
    }

    // Create user directly with the hash (bypass mongoose pre-save hook)
    const userDoc = {
      username: 'dummy user',
      email: 'testuser@echonote.com',
      password: hashedPassword,
      authProvider: 'local',
      createdAt: new Date()
    };

    // Insert directly into collection to avoid pre-save middleware
    const result = await mongoose.connection.collection('users').insertOne(userDoc);
    console.log('✅ User inserted directly with ID:', result.insertedId);

    // Now verify it works
    const savedUser = await User.findOne({ email: 'testuser@echonote.com' });
    const finalTest = await savedUser.comparePassword(plainPassword);
    console.log('\n🎯 Final verification:', finalTest ? '✅ SUCCESS' : '❌ FAILED');

    if (finalTest) {
      console.log('\n✅ Test user is ready to use!');
      console.log('   Email: testuser@echonote.com');
      console.log('   Password: TestUser@123');
      console.log('   Username: dummy user');
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

fixTestUser();
