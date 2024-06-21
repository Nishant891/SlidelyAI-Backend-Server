export interface Submission{
    name: string;
    email: string;
    phone_number: string;
    github_link: string;
    stopwatch_time: string;
}

export interface SubmissionAndSize{
    size: number;
    submission: Submission;
}