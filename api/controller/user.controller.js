import Listing from "../models/listing.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/errors.js";
import bycypt from "bcryptjs";
export const test = (req, res) => {
  res.status(200).json({ msg: "testing" });
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(403, "Forbidden"));
  }
  try {
    if (req.body.password) {
      req.body.password = bycypt.hashSync(req.body.password, 10);
    }
    const oldUser = await User.findById(req.params.id);

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username:
            req.body.username.length === 0
              ? oldUser.username
              : req.body.username,
          email: req.body.email.length === 0 ? oldUser.email : req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );
    const { pasasword: pass, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {}
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, "You can only delete your account"));
  }
  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.log(error);
  }
};

export const getUserListing = async (req, res, next) => {
  if (req.user.id === req.params.id) {
    try {
      const data = await Listing.find({ userRef: req.params.id });
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      next(next);
    }
  } else {
    next(401, "Listing not available");
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(errorHandler(404, "User does not exist"));
    const { passwod: pass, ...rest } = user;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
