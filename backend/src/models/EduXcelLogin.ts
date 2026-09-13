import mongoose, { Document, Schema } from 'mongoose';

export interface IEduXcelLogin extends Document {
  userId: mongoose.Types.ObjectId;
  loginDate: Date;
  lastLoginDate: Date;
  currentStreak: number;
  highestStreak: number;
  loginHistory: Date[];
}

const EduXcelLoginSchema = new Schema<IEduXcelLogin>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    loginDate: { type: Date, required: true },
    lastLoginDate: { type: Date, required: true },
    currentStreak: { type: Number, default: 1, min: 0 },
    highestStreak: { type: Number, default: 1, min: 0 },
    loginHistory: { type: [Date], default: [] },
  },
  {
    timestamps: true,
  }
);

EduXcelLoginSchema.index({ userId: 1 });
EduXcelLoginSchema.index({ loginDate: 1 });

const EduXcelLogin = mongoose.model<IEduXcelLogin>('EduXcelLogin', EduXcelLoginSchema, 'users.EduXcel');


export const updateLoginStreak = async (userId: string): Promise<number> => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let loginData = await EduXcelLogin.findOne({ userId });

    if (!loginData) {
      await EduXcelLogin.create({
        userId,
        loginDate: today,
        lastLoginDate: today,
        currentStreak: 1,
        highestStreak: 1,
        loginHistory: [today],
      });
      return 1;
    }

    const lastLogin = new Date(loginData.lastLoginDate);
    lastLogin.setHours(0, 0, 0, 0);

    const diffTime = Math.abs(today.getTime() - lastLogin.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return loginData.currentStreak;
    }

    if (diffDays === 1) {
      loginData.currentStreak += 1;
      if (loginData.currentStreak > loginData.highestStreak) {
        loginData.highestStreak = loginData.currentStreak;
      }
    } else {
      loginData.currentStreak = 1;
    }

    loginData.loginDate = today;
    loginData.lastLoginDate = today;
    loginData.loginHistory.push(today);
    if (loginData.loginHistory.length > 90) {
      loginData.loginHistory = loginData.loginHistory.slice(-90);
    }
    await loginData.save();

    return loginData.currentStreak;
  } catch (error) {
    console.error('Failed to update login streak:', error);
    return 0;
  }
};

export const getUserStreak = async (userId: string): Promise<{ currentStreak: number; highestStreak: number }> => {
  try {
    const loginData = await EduXcelLogin.findOne({ userId });
    if (!loginData) {
      return { currentStreak: 0, highestStreak: 0 };
    }
    return {
      currentStreak: loginData.currentStreak,
      highestStreak: loginData.highestStreak,
    };
  } catch (error) {
    console.error('Failed to fetch user streak:', error);
    return { currentStreak: 0, highestStreak: 0 };
  }
};

export default EduXcelLogin;
