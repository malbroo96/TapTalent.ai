import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";

export const configurePassport = () => {
  const clientID = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientID || !clientSecret) {
    throw new Error("Google OAuth credentials are not configured");
  }

  const callbackURL =
    process.env.GOOGLE_CALLBACK_URL ||
    `http://localhost:${process.env.PORT || 5000}/api/auth/google/callback`;

  passport.use(
    new GoogleStrategy(
      {
        clientID,
        clientSecret,
        callbackURL,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) {
            return done(new Error("Google account does not provide an email"));
          }

          let user = await User.findOne({ googleId: profile.id });
          if (!user) {
            user = await User.findOne({ email });
          }

          if (!user) {
            user = await User.create({
              googleId: profile.id,
              name: profile.displayName,
              email,
              profilePicture: profile.photos?.[0]?.value || "",
            });
          } else {
            user.googleId = profile.id;
            user.name = profile.displayName || user.name;
            user.profilePicture = profile.photos?.[0]?.value || user.profilePicture;
            await user.save();
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      },
    ),
  );
};
