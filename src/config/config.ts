import dotenv from "dotenv";

dotenv.config();

export default {
  port: process.env.PORT || 8080,
  accessSecret: process.env.ACCESS_SECRET,
  refreshSecret: process.env.REFRESH_SECRET,
};
