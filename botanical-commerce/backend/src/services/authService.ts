import { User, IUser } from '../models/User.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import { UserRole } from '../types/index.js';

export class AuthService {
  static async register(data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role?: UserRole;
    companyName?: string;
    gstin?: string;
  }) {
    const existingUser = await User.findOne({ email: data.email.toLowerCase() });
    if (existingUser) {
      throw new Error('An account with this email address already exists.');
    }

    const passwordHash = await hashPassword(data.password);
    const user = await User.create({
      name: data.name,
      email: data.email.toLowerCase(),
      passwordHash,
      role: data.role || UserRole.CUSTOMER,
      phone: data.phone,
      companyName: data.companyName,
      gstin: data.gstin,
      isEmailVerified: true, // Auto-verify in development/staging
    });

    const accessToken = signAccessToken({
      userId: user._id.toString(),
      role: user.role,
      email: user.email,
    });

    const refreshToken = signRefreshToken({
      userId: user._id.toString(),
      role: user.role,
      email: user.email,
    });

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        companyName: user.companyName,
      },
      accessToken,
      refreshToken,
    };
  }

  static async login(email: string, password: string) {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw new Error('Invalid email or password.');
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      throw new Error('Invalid email or password.');
    }

    const accessToken = signAccessToken({
      userId: user._id.toString(),
      role: user.role,
      email: user.email,
    });

    const refreshToken = signRefreshToken({
      userId: user._id.toString(),
      role: user.role,
      email: user.email,
    });

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        companyName: user.companyName,
      },
      accessToken,
      refreshToken,
    };
  }

  static async refreshToken(token: string) {
    const decoded = verifyRefreshToken(token);
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new Error('User no longer exists.');
    }

    const accessToken = signAccessToken({
      userId: user._id.toString(),
      role: user.role,
      email: user.email,
    });

    return { accessToken };
  }

  static async getProfile(userId: string) {
    const user = await User.findById(userId).select('-passwordHash');
    if (!user) {
      throw new Error('User not found.');
    }
    return user;
  }
}
