import { Schema, model, Document, ObjectId } from 'mongoose';

export interface IUser extends Document {
  _id: ObjectId;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  location:string;
  password: string;
  imageUrl: string;
  verified: boolean;
  documents: string[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  location: { type: String, required: true},
  password: { type: String, required: true },
  imageUrl: { type: String, required: false },
  verified: { type: Boolean, default: false },
  documents: { type: [String], default: [] },
}, { timestamps: true });

UserSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  }
});

export default model<IUser>('User', UserSchema);
