const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Transcript = require('./models/Transcript');

async function cleanupDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Find the dummy user
    const dummyUser = await User.findOne({ email: 'testuser@echonote.com' });
    
    if (!dummyUser) {
      console.log('❌ Dummy user not found! Please create it first.');
      await mongoose.connection.close();
      return;
    }

    console.log('🎯 Keeping dummy user:');
    console.log('   Email:', dummyUser.email);
    console.log('   Username:', dummyUser.username);
    console.log('   ID:', dummyUser._id);

    // Delete all other users
    const userDeleteResult = await User.deleteMany({ 
      email: { $ne: 'testuser@echonote.com' } 
    });
    console.log(`\n🗑️  Deleted ${userDeleteResult.deletedCount} other users`);

    // Delete all transcripts (since they belong to other users)
    const transcriptDeleteResult = await Transcript.deleteMany({});
    console.log(`🗑️  Deleted ${transcriptDeleteResult.deletedCount} transcripts`);

    // Verify what's left
    const remainingUsers = await User.countDocuments();
    const remainingTranscripts = await Transcript.countDocuments();

    console.log('\n✅ Database cleaned successfully!');
    console.log(`   Remaining users: ${remainingUsers} (only dummy user)`);
    console.log(`   Remaining transcripts: ${remainingTranscripts}`);

    console.log('\n🎬 Database is ready for test video recording!');
    console.log('   Login with: testuser@echonote.com / TestUser@123');

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

cleanupDatabase();
