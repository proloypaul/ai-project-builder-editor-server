import mongoose from "mongoose";

export const connectToDB = (url) => {
  return mongoose.connect(url);
};
