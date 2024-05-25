import {UserModel} from "../schemas/user.schema"
import { User } from "../types/user.types";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

export const createUser = async (user : User) => {
    return await UserModel.create(user);
} 

export const findUser = async (email : string) => {
    return await UserModel.findOne({email});
} 

export const findUserById = async (id : string) => {
    return await UserModel.findById(id);
} 

export const generateAccessToken = async (user : User) => {
    const token = jwt.sign({
        user
    },
    process.env.ACTIVATION_SECRET || "qwertyuiop",
    {
        expiresIn : 15 * 60 * 1000 
    })
    return token;
}

export const generateRefreshToken = async (id : string) => {
    const token = jwt.sign({
        id
    },
    process.env.ACTIVATION_SECRET || "qwertyuiop",
    {
        expiresIn : 15 * 60 * 1000 
    })
    return token;
}