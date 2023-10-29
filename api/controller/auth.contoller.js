import User from "../models/user.model.js";
import { errorHandler } from "../utils/errors.js";
import bycrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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

export const signIn = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validateUser = await User.findOne({ email });

    if (!validateUser) {
      return next(errorHandler(404, "User not found"));
    }
    const validPassword = bycrypt.compareSync(password, validateUser.password);

    if (!validPassword) return next(errorHandler(404, "Password is incorrect"));
    const token = jwt.sign({ id: validateUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = validateUser._doc;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;

      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    } else {
      const generatedPassword = Math.random().toString(36).slice(-8);
      const hashPassword = bycrypt.hashSync(generatedPassword, 10);

      const newUser = new User({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashPassword,
        avatar: req.body.photo,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = newUser._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

export const signoutUser = (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json({ message: "You are signout" });
  } catch (error) {
    next(error);
  }
};
