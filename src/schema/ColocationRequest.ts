import { Schema, model, Document } from 'mongoose';
import { IUser } from './User';

export interface IColocationRequest extends Document {
  user: IUser['_id'];
  location: string;
  maxRent: number;
  housingType: string;
  genderPreference: string;
  smokerPreference: boolean;
  additionalCriteria: string[];
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const ColocationRequestSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  location: { type: String, required: true },
  maxRent: { type: Number, required: true },
  housingType: { type: String, required: true },
  genderPreference: { type: String, required: true },
  smokerPreference: { type: Boolean, required: true },
  additionalCriteria: { type: [String], default: [] },
  description: { type: String, required: true },
}, {
  timestamps: true,
});

export default model<IColocationRequest>('ColocationRequest', ColocationRequestSchema);
