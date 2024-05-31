import mongoose from 'mongoose';

const uri = "mongodb+srv://chikukumar1967:HNDO0Xm00Wvt0ts6@cluster0.phnwepp.mongodb.net/fire?retryWrites=true&w=majority&appName=Cluster0";


const connectToMongo = () => {
    mongoose.connect(uri);

    const db = mongoose.connection;

    db.on('error', (err: string) => {
        console.error('Mongoose connection error:', err);
    });

    db.once('open', () => {
        console.log('Connected to MongoDB successfully');
    });
};

export default connectToMongo;

