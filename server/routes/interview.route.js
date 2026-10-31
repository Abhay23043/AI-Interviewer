import { Router } from 'express'
import authUserMiddleware from '../middlewares/authUser.middleware.js'
import { upload } from '../middlewares/multer.js'
import { analyzeResume, finishInterview, generateQuestion, getInterviewHistory, getInterviewReport, submitAnswer } from '../controllers/interview.controller.js'
const interviewRouter = Router()


interviewRouter.post("/resume", authUserMiddleware.authUser, upload.single("resume"), analyzeResume);
interviewRouter.post("/generate-questions", authUserMiddleware.authUser, generateQuestion);
interviewRouter.post("/submit-answers", authUserMiddleware.authUser, submitAnswer);
interviewRouter.post("/finish", authUserMiddleware.authUser, finishInterview);
interviewRouter.get("/history", authUserMiddleware.authUser, getInterviewHistory);
interviewRouter.get("/history/:id", authUserMiddleware.authUser, getInterviewReport);


export default interviewRouter