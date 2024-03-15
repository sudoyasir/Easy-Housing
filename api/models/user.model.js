import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default:
        "https://static.vecteezy.com/system/resources/thumbnails/002/534/006/small_2x/social-media-chatting-online-blank-profile-picture-head-and-body-icon-people-standing-icon-grey-background-free-vector.jpg",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
