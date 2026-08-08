import { authService } from '../services/auth.service.js';
import { catchAsync } from '../utils/catchAsync.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const authController = {
  register: catchAsync(async (req, res) => {
    const { user, token } = await authService.register(req.body);

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
    });

    ApiResponse.sendSuccess(res, 201, 'User registered successfully', { user, token });
  }),

  login: catchAsync(async (req, res) => {
    const { token, user } = await authService.login(req.body);
    
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
    });
    
    ApiResponse.sendSuccess(res, 200, 'User logged in successfully', { user, token });
  }),

  getProfile: catchAsync(async (req, res) => {
    const userId = req.user.userId;
    const user = await authService.getProfile(userId);
    ApiResponse.sendSuccess(res, 200, 'User profile retrieved successfully', { user });
  }),

  oauthCallback: catchAsync(async (req, res) => {
    // req.user is populated by passport
    const user = req.user;
    
    // Generate our JWT
    const jwtSecret = process.env.JWT_SECRET || 'fallback_secret';
    // Import jwt here locally to avoid circular dependency or import at top
    const jwt = (await import('jsonwebtoken')).default;
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      jwtSecret,
      { expiresIn: '15d' }
    );

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 15 * 24 * 60 * 60 * 1000,
    });

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    res.redirect(`${clientUrl}/login/callback?token=${token}`);
  }),
};
