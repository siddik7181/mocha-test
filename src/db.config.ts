import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/server_test');
    console.log("connected database 'server_test'");
  } catch (err) {
    console.error('Error connecting to MongoDB', err);
    process.exit(1);
  }
};

export default connectDB;
