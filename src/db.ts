import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL || 'mongodb+srv://admin:LNprNWd4RbbJq4S1@nf-backend-1.bhetjux.mongodb.net/?retryWrites=true&w=majority&appName=nf-backend-1');
        console.log('MongoDB connected...');
    } catch (err:any) {
        console.error(err.message);
        process.exit(1);
    }
};

export default connectDB;