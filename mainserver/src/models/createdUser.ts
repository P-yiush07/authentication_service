import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for the document
export interface ICreatedUser extends Document {
    name: string;
    email: string;
    password: string;
    createdBy: mongoose.Types.ObjectId;
    
}

// Define the schema for the document
const createdUserSchema: Schema = new Schema({
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
    createdBy: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
}, { collection: 'created_users' }); // Specify the collection name here

// Create the model for the document
const createdUser = mongoose.model<ICreatedUser>('CreatedUser', createdUserSchema);

// Export the model
export default createdUser;
