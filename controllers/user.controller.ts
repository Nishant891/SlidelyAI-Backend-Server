import { RefreshCookie, User } from "../types/user.types";
import { Request, Response, NextFunction } from "express";
import {
  createUser,
  findUser,
  findUserById,
  generateAccessToken,
  generateRefreshToken,
} from "../services/user.services";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getAccessToken = async (req: Request, res: Response) => {
  const refreshCookie = req.cookies.refreshCookie;
  if (!refreshCookie) {
    return res.status(400).json({
      success: false,
      message: "Cookie not received",
    });
  }

  const secret = process.env.ACTIVATION_SECRET || "qwertyuiop";
  try {
    const decode = jwt.verify(refreshCookie, secret) as RefreshCookie;
    const user = await findUserById(decode.id);
    const accessToken = await generateAccessToken(user);
    res.status(200).json({
      success: true,
      accessTokenCookie: accessToken,
      message: "Access cookie retrieved successfull",
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Token is invalid",
    });
  }
};

export const getUser = async (req: Request, res: Response) => {
  const accessCookie = req.cookies.accessCookie;
  if (!accessCookie) {
    return res.status(400).json({
      success: false,
      message: "Cookie not received",
    });
  }

  const secret = process.env.ACTIVATION_SECRET || "qwertyuiop";
  try {
    const decode = jwt.verify(accessCookie, secret) as any;
    res.status(200).json({
      success: true,
      user: decode.user,
      message: "User retrieved successfull",
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Token is invalid",
    });
  }
};

export const createNewUser = async (req: Request, res: Response) => {
  const data = req.body as User;
  const finduser = await findUser(data.email);
  if (finduser) {
    return res.status(400).json({
      success: false,
      message: "User already exits",
    });
  }
  try {
    //Create hash
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(data.password, salt);
    data.password = hashedPassword;

    //Store user
    const user = await createUser(data);
    const accessToken = await generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user.id);
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: true });
    res.status(200).json({
      success: true,
      accessTokenCookie: accessToken,
      refreshTokenCookie: refreshToken,
      message: "User created successfull",
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Unable to create user",
    });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body as User;

  const user = await findUser(email);

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "User does not exits",
    });
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    return res.status(400).json({
      success: false,
      message: "Password is incorrect",
    });
  }

  const accessToken = await generateAccessToken(user);
  const refreshToken = await generateRefreshToken(user.id);
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: true });

  res.status(200).json({
    success: true,
    accessTokenCookie: accessToken,
    refreshTokenCookie: refreshToken,
    message: "User loggedIn successfully",
  });
};
