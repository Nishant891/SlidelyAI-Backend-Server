import express from 'express';
import { Request, Response, NextFunction } from "express";
import { createNewUser, getAccessToken, getUser, loginUser } from "../controllers/user.controller";
import { getRecords } from "../controllers/aws.controller";

export const router = express.Router();

router.get("/", (req:Request, res:Response) => {
    res.send("<h1>Hello! This is Alpha.</h1>")
});

router.get("/getAccessToken", getAccessToken);

router.get("/getUser", getUser);

router.get("/getRecords", getRecords);

router.post("/signup", createNewUser);

router.post("/login", loginUser);