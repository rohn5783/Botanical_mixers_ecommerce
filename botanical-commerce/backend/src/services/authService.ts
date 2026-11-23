import { User, IUser } from '../models/User.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import { UserRole } from '../types/index.js';
import { AppError } from '../utils/errors.js';

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
    const cleanEmail = data.email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      throw new AppError('An account with this email address already exists.', 409);
    }

    const passwordHash = await hashPassword(data.password);
    const user = await User.create({
      name: data.name.trim(),
      email: cleanEmail,
      passwordHash,
      role: data.role || UserRole.CUSTOMER,
      phone: data.phone?.trim(),
      companyName: data.companyName?.trim(),
      gstin: data.gstin?.trim(),
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
        id: user._id.toString(),
        _id: user._id.toString(),
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
    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      throw new AppError('Invalid email or password.', 401);
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      throw new AppError('Invalid email or password.', 401);
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
        id: user._id.toString(),
        _id: user._id.toString(),
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
      throw new AppError('User session expired or user no longer exists.', 401);
    }

    const accessToken = signAccessToken({
      userId: user._id.toString(),
      role: user.role,
      email: user.email,
    });

    return { accessToken };
  }

  static async getProfile(userId: string) {
    const user = await User.findById(userId).select('-passwordHash').lean();
    if (!user) {
      throw new AppError('User not found.', 404);
    }
    return {
      ...user,
      id: user._id.toString(),
      _id: user._id.toString(),
    };
  }
}
