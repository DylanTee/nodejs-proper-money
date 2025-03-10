import { Request, Response, NextFunction } from "express";
import { JWTlib } from "../../libs/jwt.lib";
import { TJwtTokenObject } from "../../nodejs-proper-money-types/types";

export function middlewareAccessToken(
  req: Request & {
    decode?: TJwtTokenObject;
  },
  res: Response,
  next: NextFunction
) {
  const authorization = req.get("authorization");

  if (!authorization) {
    return res.sendStatus(401);
  }

  const b = authorization.match(/Bearer (.+)/);

  if (!b) {
    return res.sendStatus(401);
  }

  const bearerToken: string = b[1];

  try {
    const decode = JWTlib.verifyAccessToken(bearerToken) as TJwtTokenObject;
    req.decode = decode;
    next();
  } catch (e) {
    return res.sendStatus(401);
  }
}

export function middlewareRefreshToken(
  req: Request & {
    decode?: TJwtTokenObject;
  },
  res: Response,
  next: NextFunction
) {
  const authorization = req.get("authorization");

  if (!authorization) {
    return res.sendStatus(401);
  }

  const b = authorization.match(/Bearer (.+)/);

  if (!b) {
    return res.sendStatus(401);
  }

  const bearerToken: string = b[1];

  try {
    const decode = JWTlib.verifyRefreshToken(bearerToken) as TJwtTokenObject;
    req.decode = decode;
    next();
  } catch (e) {
    return res.sendStatus(401);
  }
}

export default async function signJWTtoken(data: TJwtTokenObject) {
  const accessToken = await JWTlib.signAccessToken(data);
  const refreshToken = await JWTlib.signRefreshToken(data);
  return {
    accessToken: accessToken,
    refreshToken: refreshToken,
  };
}
