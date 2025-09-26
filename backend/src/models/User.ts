import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  gender: 'Male' | 'Female' | 'Other';
  birthday: Date;
  occupation: 'Student' | 'Engineer' | 'Teacher' | 'Unemployed';
  phone: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  gender: { 
    type: String, 
    required: true, 
    enum: ['Male', 'Female', 'Other'] 
  },
  birthday: { type: Date, required: true },
  occupation: { 
    type: String, 
    required: true, 
    enum: ['Student', 'Engineer', 'Teacher', 'Unemployed'] 
  },
  phone: { type: String, required: true },
  image: { type: String, default: '' },
}, {
  timestamps: true
});

export default mongoose.model<IUser>('User', UserSchema);