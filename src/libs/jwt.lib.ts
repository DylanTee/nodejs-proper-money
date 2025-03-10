require("dotenv").config();

import jwt from "jsonwebtoken";

const accessTokenSecret = process.env.JWT_ACCESS_ACCESS_TOKEN_SECRET as string

const refreshTokenSecret = process.env.JWT_ACCESS_REFRESH_TOKEN_SECRET as string

const signAccessToken = async (data: any) => {
  const token = await jwt.sign(data, accessTokenSecret, { expiresIn: "1d" });
  return token;
};

const signRefreshToken = async (data: any) => {
  const token = await jwt.sign(data, refreshTokenSecret);
  return token;
};

const verifyAccessToken = (bearerToken: string) => {
  return jwt.verify(bearerToken, accessTokenSecret);
};

const verifyRefreshToken = (refreshToken: string) => {
  return jwt.verify(refreshToken, refreshTokenSecret);
};

export const JWTlib = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
