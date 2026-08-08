import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import prisma from './db.js';
import { config } from './env.js';

// Helper function to handle OAuth profile logic
const handleOAuthProfile = async (provider, profile, done) => {
  try {
    const email = profile.emails && profile.emails[0]?.value;
    const name = profile.displayName || profile.username;
    const avatarUrl = profile.photos && profile.photos[0]?.value;

    if (!email) {
      return done(new Error(`No email found in ${provider} profile`), null);
    }

    // Try to find the user by their OAuth ID
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          provider === 'google' ? { googleId: profile.id } : { githubId: profile.id },
          { email }
        ]
      }
    });

    if (user) {
      // User exists. Update the provider ID if it's missing (e.g. they signed up with email first)
      const updateData = {};
      if (provider === 'google' && !user.googleId) updateData.googleId = profile.id;
      if (provider === 'github' && !user.githubId) updateData.githubId = profile.id;
      if (!user.avatarUrl && avatarUrl) updateData.avatarUrl = avatarUrl;
      
      if (Object.keys(updateData).length > 0) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: updateData
        });
      }
      return done(null, user);
    }

    // New user, create them
    user = await prisma.user.create({
      data: {
        email,
        name,
        avatarUrl,
        ...(provider === 'google' ? { googleId: profile.id } : { githubId: profile.id })
      }
    });

    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
};

// Google Strategy
passport.use(new GoogleStrategy({
    clientID: config.googleClientId,
    clientSecret: config.googleClientSecret,
    callbackURL: '/api/v1/auth/google/callback'
  },
  (accessToken, refreshToken, profile, done) => handleOAuthProfile('google', profile, done)
));

// GitHub Strategy
passport.use(new GitHubStrategy({
    clientID: config.githubClientId,
    clientSecret: config.githubClientSecret,
    callbackURL: '/api/v1/auth/github/callback'
  },
  (accessToken, refreshToken, profile, done) => handleOAuthProfile('github', profile, done)
));

// Passport serialize/deserialize
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
