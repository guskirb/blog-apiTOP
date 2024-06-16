import "dotenv/config";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import User from "../models/user";

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.ACCESS_TOKEN,
};

const strategy = new JwtStrategy(options, async (payload, done) => {
  try {
    const user = await User.findOne({ _id: payload.sub });
    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  } catch (err) {
    done(err, null);
  }
});

function jwtInitialize(passport) {
  passport.use(strategy);
}

export default jwtInitialize;
