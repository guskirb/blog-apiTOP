import LocalStrategy from "passport-local";
import bcrypt from "bcrypt";
import User from "../models/user";

const customFields = {
  usernameField: "username",
  passwordField: "password",
};

const verify = async (username: string, password: string, done) => {
  try {
    const user = await User.findOne({
      $or: [{ email: username }, { username: username }],
    });
    if (!user) {
      return done(null, false, {});
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return done(null, false, {});
    }

    return done(null, user);
  } catch (err) {
    return done(err);
  }
};

const serialize = (user: object, done) => {
  done(null, user._id);
};

const deserialize = async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
};

function passportInitialize(passport) {
  passport.use(new LocalStrategy(customFields, verify));
  passport.serialize(serialize);
  passport.deserialize(deserialize);
}

export default passportInitialize;
