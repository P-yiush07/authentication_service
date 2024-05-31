import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    createdBy: mongoose.Types.ObjectId; // Define createdBy field
    apiToken?: string; // Make apiToken field optional
}

const userSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    apiToken: {
        type: String,
        unique: true, // Ensure apiToken uniqueness
        default: undefined,
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
    },
}, { collection: 'user' }); // Specify the collection name here

const CreateUser = mongoose.model<IUser>('User', userSchema);

export default CreateUser;