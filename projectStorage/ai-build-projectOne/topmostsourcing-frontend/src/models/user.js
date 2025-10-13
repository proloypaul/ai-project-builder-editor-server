import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: [true, "username required"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Please provide email"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  role: {
    type: String,
    default: "ADMIN",
  },
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatched = await bcrypt.compare(candidatePassword, this.password);
  return isMatched;
};

export const User = mongoose.model("User", UserSchema);
