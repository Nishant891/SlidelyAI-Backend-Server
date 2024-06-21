import express, { query } from 'express';
import { Request, Response } from "express";
import { addSubmission, findSubmission, deleteSubmission } from "../controllers/submission.controller";
import { Submission, SubmissionAndSize } from "../types/submission.types";

export const router = express.Router();

router.get("/ping", (req:Request, res:Response) => {
    res.send({
        "success" : true
    })
});

router.post("/submit", async (req:Request, res:Response) => {
    const newSubmission : Submission = req.body;

    //Add the new submission
    try {
        await addSubmission(newSubmission);
        res.status(201).json({
            success : true,
            message : "Submission added successfully"
        })
    } catch (error) {
        res.status(400).json({
            success : false,
            message : error.message
        })
    }
});

router.get("/read", async (req:Request, res:Response) => {
    //Get the index from the url and parse it to integer
    const requestIndex = req.query.index as string;
    const index = parseInt(requestIndex);

    //If Not a Number reply with an error message
    if (isNaN(index)) {
        return res.status(400).json({
          success: false,
          message: "Invalid index"
        });
    }

    try {
        //Find the submission in db.json
        const data : SubmissionAndSize = await findSubmission(index);

        if(data != undefined){
            res.status(201).json({
                size: data.size,
                data: data.submission,
                success : true,
                message : "Submission fetched successfully"
            })
        }

        //If index was out of bounds throw reply with error message
        else{
            res.status(400).json({
                success : false,
                message : "Submission not found"
            })
        }
    } catch (error) {
        res.status(400).json({
            success : false,
            message : error.message
        })
    }
});

router.delete("/delete", async (req:Request, res:Response) => {
    //Get the index from the url and parse it to integer
    const requestIndex = req.query.index as string;
    const index = parseInt(requestIndex);

    //If Not a Number reply with an error message
    if (isNaN(index)) {
        return res.status(400).json({
          success: false,
          message: "Invalid index"
        });
    }

    try {
        const size : number= await deleteSubmission(index);

        if(size != undefined){
            res.status(201).json({
                size: size,
                success : true,
                message : "Submission deleted successfully"
            })
        }

        //If index was out of bounds throw reply with error message
        else{
            res.status(400).json({
                success : false,
                message : "Submission not found"
            })
        }

    } catch (error) {
        res.status(400).json({
            success : false,
            message : error.message
        })
    }
});