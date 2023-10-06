import User from "../models/user.model.js";
import { errorHandler } from "../utils/errors.js";
import bycrypt from "bcryptjs";

export const auth = async (req, res, next) => {
  const err = { success: false };
  try {
    const { username, email, password } = req.body;
    if (password.length < 8) {
      err.password =
        "Password is required and length should be equal or greater then 8 character";
      return res.json(err);
    }
    const hashPassword = bycrypt.hashSync(password, 10);

    const newUser = new User({ username, email, password: hashPassword });
    await newUser.save();
    res.status(200).json({ msg: "User created successfully" });
  } catch (error) {
    if (error.code == 11000) {
      let duplicate = Object.keys(error.keyValue)[0];
      err[duplicate] = `${duplicate} is already in use`;
      res.status("400").json(err);
      return;
    }
    Object.keys(error.errors).reduce(
      (acc, current) => (err[current] = error.errors[current].message),
      {}
    );
    res.status("400").json(err);

    next(errorHandler(500, "Err"));
  }
};
