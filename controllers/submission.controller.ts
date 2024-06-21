import { Submission, SubmissionAndSize } from "../types/submission.types";
import fs from "fs";
import path from "path";

export const addSubmission = async (newSubmission: Submission): Promise<void> => {
  try {
    //Acquire the path to db.json
    const filePath = path.join(__dirname, "../db.json");

    //If path exists read the file or create one
    const data = fs.existsSync(filePath)
      ? fs.readFileSync(filePath, "utf-8")
      : "[]";

    //Parse the json data
    const submissions: Submission[] = JSON.parse(data);

    submissions.push(newSubmission);

    await fs.writeFileSync(filePath, JSON.stringify(submissions, null, 2), "utf-8");
  } catch (error) {
    throw Error("Failed to add submission");
  }
};

export const findSubmission = async (
  index: number
): Promise<SubmissionAndSize | undefined> => {
  try {
    const filePath = path.join(__dirname, "../db.json");
    const data = fs.existsSync(filePath)
      ? fs.readFileSync(filePath, "utf-8")
      : "[]";
    const submissions: Submission[] = JSON.parse(data);

    //If the provided index is out of bounds return undefined
    return index < submissions.length
      ? { size: submissions.length, submission: submissions[index] }
      : undefined;
  } catch (error) {
    throw Error("Failed to fetch submission");
  }
};

export const deleteSubmission = async (
  index: number
): Promise<number | undefined> => {
  try {
    const filePath = path.join(__dirname, "../db.json");
    const data = fs.existsSync(filePath)
      ? fs.readFileSync(filePath, "utf-8")
      : "[]";
    const submissions: Submission[] = JSON.parse(data);

    if(index < 0 || index > submissions.length-1){
      return undefined
    }

    submissions.splice(index,1);

    await fs.writeFileSync(filePath, JSON.stringify(submissions, null, 2), "utf-8");

    return submissions.length
  } catch (error) {
    throw Error("Failed to fetch submission");
  }
};
