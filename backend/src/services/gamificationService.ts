import User from '../models/User';
import EduXcelLogin from '../models/EduXcelLogin';

const XP_THRESHOLDS = [0, 100, 250, 500, 1000, 2000, 3500, 5000, 7500, 10000];

export const awardXP = async (userId: string, amount: number, reason: string): Promise<{ xpAdded: number; newTotal: number; levelUp: boolean; newLevel: number }> => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    const oldLevel = user.level || 1;
    user.xp = (user.xp || 0) + amount;
    
    let newLevel = 1;
    for (let i = 0; i < XP_THRESHOLDS.length; i++) {
      if (user.xp >= XP_THRESHOLDS[i]) {
        newLevel = i + 1;
      }
    }

    const levelUp = newLevel > oldLevel;
    user.level = newLevel;

    // Check badges
    const newBadges: string[] = [];
    if (newLevel >= 5 && !user.badges.includes('Scholar')) newBadges.push('Scholar');
    if (newLevel >= 10 && !user.badges.includes('Master')) newBadges.push('Master');

    if (newBadges.length > 0) {
      user.badges = [...(user.badges || []), ...newBadges];
    }

    await user.save();
    return { xpAdded: amount, newTotal: user.xp, levelUp, newLevel };
  } catch (error) {
    console.error('Failed to award XP:', error);
    return { xpAdded: 0, newTotal: 0, levelUp: false, newLevel: 1 };
  }
};

export const processDailyLoginGamification = async (userId: string, currentStreak: number): Promise<void> => {
  // Base XP for login
  let xpToAward = 10;
  
  // Bonus XP for streaks
  if (currentStreak >= 7) xpToAward += 50; // 7 day streak bonus
  else if (currentStreak >= 3) xpToAward += 20; // 3 day streak bonus
  
  await awardXP(userId, xpToAward, 'Daily Login');
};

