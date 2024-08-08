import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  imageUrl: string;
  verified: boolean;
  documents: string[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  imageUrl: { type: String, required: true },
  verified: { type: Boolean, default: false },
  documents: { type: [String], default: [] },
}, {
  timestamps: true, 
});

export default model<IUser>('User', UserSchema);
