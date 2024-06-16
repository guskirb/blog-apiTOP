import "dotenv/config";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import mongoose from "mongoose";
import passport from "passport";
import passportInitialize from "./config/passport";

passportInitialize(passport);

mongoose.set("strictQuery", false);
const mongoString: string = process.env.MONGO_STRING!;

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoString);
}

import indexRouter from "./routes/index";
import usersRouter from "./routes/users";
import postsRouter from "./routes/posts";

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/posts", postsRouter);

export default app;
