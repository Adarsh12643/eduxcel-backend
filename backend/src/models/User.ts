import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password?: string;
  name: string;
  role: 'student' | 'faculty' | 'admin';
  department?: string;
  avatar?: string;
  rollNumber?: string;
  employeeId?: string;
  semester?: number;
  section?: string;
  batch?: string;
  googleId?: string;
  authProvider: 'local' | 'google';
  isActive?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: false },
  name: { type: String, required: true },
  role: { type: String, required: true, enum: ['student', 'faculty', 'admin'] },
  department: { type: String, required: false },
  avatar: { type: String, required: false },
  rollNumber: { type: String, required: false },
  employeeId: { type: String, required: false },
  semester: { type: Number, required: false },
  section: { type: String, required: false },
  batch: { type: String, required: false },
  googleId: { type: String, required: false },
  authProvider: { type: String, required: true, enum: ['local', 'google'], default: 'local' },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true,
  autoIndex: false,
});

UserSchema.index({ email: 1 });
UserSchema.index({ googleId: 1 });

export default mongoose.model<IUser>('User', UserSchema);
