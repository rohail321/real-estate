import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: "Username address is required",
      unique: true,
      minLength: [6, "Username should be atleast 6 character"],
    },
    email: {
      type: String,
      required: "Email address is required",
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    password: {
      type: String,
      trim: true,
      required: "Password is required",
      minLength: [8, "Password should be atleast 8 character"],
    },
    avatar: {
      type: String,
      default:
        "https://thumbs.dreamstime.com/z/creative-vector-illustration-default-avatar-profile-placeholder-isolated-background-art-design-grey-photo-blank-template-mo-107388687.jpg?w=768",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
