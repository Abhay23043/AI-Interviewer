import fs from 'fs'
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs'
import { askAI } from '../services/openRouter.service.js'
import googleUserModel from '../model/googleuser.model.js'
import userModel from '../model/user.model.js'
import interviewModel from '../model/interview.model.js'

export const analyzeResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "Resume required."
            })

        }

        const filePath = req.file.path

        const fileBuffer = await fs.promises.readFile(filePath)
        const uint8Array = new Uint8Array(fileBuffer)

        const pdf = await pdfjsLib.getDocument({ data: uint8Array }).promise;

        let resumeText = "";

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const content = await page.getTextContent();

            const pageText = content.items.map(item => item.str).join(" ");

            resumeText += pageText + "\n";
        }

        resumeText = resumeText
            .replace(/\s+/g, " ")
            .trim();

        const messages = [
            {
                role: "system",
                content: `
            Extract structured data from resume.
            Return strictly JSON:
            {
                "role": "string",
                "experience": "string",
                "projects": ["project 1","project 2","project n"],
                "skills": ["skills 1","skills 2","skills n"]
            }
            `

            },
            {
                role: "user",
                content: resumeText
            }
        ];

        const aiResponse = await askAI(messages)

        const parsed = JSON.parse(aiResponse);

        fs.unlinkSync(filePath)

        res.json({
            role: parsed.role,
            experience: parsed.experience,
            projects: parsed.projects,
            skills: parsed.skills,
            resumeText
        });

    } catch (error) {
        console.error(error)

        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        return res.status(500).json({
            message: error.message
        })
    }

}

export const generateQuestion = async (req, res) => {
    try {
        let { role, experience, mode, resumeText, projects, skills } = req.body;
        role = role?.trim()
        experience = experience?.trim()
        mode = mode?.trim()
        if (!role || !experience || !mode) {
            return res.status(400).json({
                message: "Please enter Role,Experience and Mode of interview"
            })

        }
        let user = await userModel.findById(req.userId);
        let onModel = "userModel";

        if (!user) {
            user = await googleUserModel.findById(req.userId);
            onModel = "googleUserModel";
        }

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (user.credits < 50) {
            return res.status(400).json({
                message: "Not enough credits. Minimum 50 required."
            })
        }

        const projectText = Array.isArray(projects) && projects.length ? projects.join(", ") : "None";
        const skillsText = Array.isArray(skills) && skills.length ? skills.join(", ") : "None";
        const safeResume = resumeText?.trim() || "None";

        const userPrompt = `
    Role = ${role}
    Experience = ${experience}
    Mode = ${mode}
    Projects = ${projectText}
    Skills = ${skillsText}
    Resume = ${safeResume}



    `
        if (!userPrompt.trim()) {
            return res.status(400).json({
                message: "Prompt Content is empty"
            })
        }
        const messages = [
            {
                role: "system",
                content: `
You are a real human interviewer conducting a professional interview.
Speak in simple, natural English as if you are directly talking to the
candidate.

Generate exactly 5 interview questions.

Strict Rules:
- Each question must contain between 15 and 25 words.
- Each question must be a single complete sentence.
- Do NOT number them.
- Do NOT add explanations.
- Do NOT add extra text before or after.
- One question per line only.
- Keep language simple and conversational.
- Questions must feel practical and realistic.

    Difficulty progression:
    Question 1 -> easy
    Question 2 -> easy
    Question 3 -> medium
    Question 4 -> medium
    Question 5 -> hard

    Make questions based on the candidate's role, experience, interviewMode, projects, skills,
    and resume details.

    
        `
            },
            {
                role: "user",
                content: userPrompt
            }
        ];


        const airesponse = await askAI(messages)

        if (!airesponse || !airesponse.trim()) {
            return res.status(500).json({
                message: "AI returned empty response."
            })
        }

        const questionsArray = airesponse
            .split(/\r?\n/)
            .map(q => q.trim())
            .filter(q => q.length > 0)
            .slice(0, 5);

        if (questionsArray.length === 0) {
            return res.status(500).json({
                message: "AI failed to genrate questions."
            })
        }

        user.credits -= 50;
        await user.save();

        const interview = await interviewModel.create({
            userId: user._id,
            onModel: onModel,
            role,
            experience,
            mode,
            resumeText,
            questions: questionsArray.map((q, index) => ({
                question: q,
                difficulty: ["easy", "easy", "medium", "medium", "hard"][index],
                timeLimit: [60, 60, 90, 90, 120][index],
            }))
        })

        return res.json({
            interviewId: interview._id,
            creditsLeft: user.credits,
            userName: user.name,
            questions: interview.questions
        })

    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }

}


export const submitAnswer = async (req, res) => {
    try {
        const { interviewId, questionIndex, answer, timeTaken } = req.body;
        if (!interviewId) {
            return res.status(400).json({
                message: "Interview ID is required."
            });
        }
        const interview = await interviewModel.findById(interviewId);
        if (!interview) {
            return res.status(404).json({
                message: "Interview not found."
            });
        }
        if (interview.userId.toString() !== req.userId.toString()) {
            return res.status(403).json({
                message: "You are not allowed to submit answers for this interview."
            });
        }
        if (interview.status === "Completed") {
            return res.status(400).json({
                message: "This interview has already been completed."
            });
        }
        if (!Number.isInteger(questionIndex) || !interview.questions[questionIndex]) {
            return res.status(400).json({
                message: "Invalid question."
            });
        }
        const question = interview.questions[questionIndex]
        //if no answer 
        const submittedAnswer = typeof answer === "string" ? answer.trim() : "";
        if (!submittedAnswer) {
            question.score = 0;
            question.confidence = 0;
            question.communication = 0;
            question.correctness = 0;
            question.feedback = "You did not Submit an answer.";
            question.answer = "";

            await interview.save();

            return res.json({
                feedback: question.feedback,
                confidence: 0,
                communication: 0,
                correctness: 0,
                score: 0
            })
        }

        //if time exceeded
        const numericTimeTaken = Number(timeTaken);
        if (!Number.isFinite(numericTimeTaken) || numericTimeTaken < 0) {
            return res.status(400).json({
                message: "Invalid answer time."
            });
        }
        if (numericTimeTaken > question.timeLimit) {
            question.score = 0;
            question.confidence = 0;
            question.communication = 0;
            question.correctness = 0;
            question.feedback = "Time limit exceeded. Answer not evaluated";
            question.answer = submittedAnswer;

            await interview.save();

            return res.json({
                feedback: question.feedback,
                confidence: 0,
                communication: 0,
                correctness: 0,
                score: 0
            })
        }

        const messages = [
            {
                role: "system",
                content: `
              You are a professional human interviewer evaluating a candidate's answer in a
              real interview.

              Evaluate naturally and fairly, like a real person would.
              Score the answer in these areas (0 to 10) :

              1. Confidence - Does the answer sound clear, confident, and well-presented?
              2. Communication - Is the language simple,clear and easy to understand?
              3. Correctness - Is the answer accurate, relevant and complete?

              Rules:
                - Be realistic and unbiased.
                - Do not give random high scores.
                - If the answer is weak, score low.
                - If the answer is strong and detailed, score high.
                - Consider clarity, structure, and relevance.

                Calculate:
                finalScore = average of confidence, communication, and correctness (rounded to
                nearest whole number).

                Feedback Rules:
                - Write natural human feedback.
                - 10 to 15 words only.
                - Sound like real interview feedback.
                - can suggest improvement if needed.
                - Do NOT repeat the question.
                - Do NOT explain scoring.
                - Keep tone professional and honest.


                Return only valid JSON with exactly these lower-case keys:

                {
                  "confidence": number,
                  "communication": number,
                  "correctness": number,
                  "finalScore": number,
                  "feedback": "short human feedback"
                }

                finalScore must be the rounded average of confidence, communication,
                and correctness. Use numbers from 0 to 10.
              `
            }, {
                role: "user",
                content: `
                Question: ${question.question}
                Answer: ${answer}
                
                `
            }]

        let parsed = {};
        try {
            const aiResponse = await askAI(messages);
            const jsonMatch = aiResponse?.match(/\{[\s\S]*\}/);
            parsed = JSON.parse(jsonMatch ? jsonMatch[0] : aiResponse);
        } catch (error) {
            console.error("Answer evaluation failed:", error.message);
        }

        const toScore = (value) => {
            const score = Number(value);
            return Number.isFinite(score) ? Math.min(10, Math.max(0, Math.round(score))) : 0;
        };
        const normalized = {};
        Object.entries(parsed).forEach(([key, value]) => {
            const normalizedKey = key.toLowerCase().replace(/[\s_-]/g, "");
            normalized[normalizedKey] = value;
        });

        question.answer = submittedAnswer;
        question.confidence = toScore(normalized.confidence);
        question.communication = toScore(normalized.communication);
        question.correctness = toScore(normalized.correctness);
        question.score = toScore(normalized.finalscore ??
            (question.confidence + question.communication + question.correctness) / 3);
        question.feedback = String(normalized.feedback ?? "").trim() ||
            "Answer submitted successfully. Review the question and provide a more detailed response next time.";

        await interview.save();

        return res.status(200).json({
            feedback: question.feedback,
            confidence: question.confidence,
            communication: question.communication,
            correctness: question.correctness,
            score: question.score
        })




    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}


export const finishInterview = async (req, res) => {
    try {
        const { interviewId } = req.body;
        if (!interviewId) {
            return res.status(400).json({
                message: "Interview ID is required."
            });
        }
        const interview = await interviewModel.findById(interviewId);
        if (!interview) {
            return res.status(400).json({
                message: "failed to find interview, Please try again."
            })
        }
        if (interview.userId.toString() !== req.userId.toString()) {
            return res.status(403).json({
                message: "You are not allowed to finish this interview."
            });
        }

        const unansweredQuestion = interview.questions.findIndex((question) =>
            question.answer === undefined || question.answer === null
        );
        if (unansweredQuestion !== -1 && interview.status !== "Completed") {
            return res.status(400).json({
                message: `Please submit an answer for question ${unansweredQuestion + 1} before finishing.`,
                unansweredQuestionIndex: unansweredQuestion
            });
        }

        const totalQuestions = interview.questions.length;

        let totalScore = 0;
        let totalConfidence = 0;
        let totalCommunication = 0;
        let totalCorrectness = 0;

        interview.questions.forEach((q) => {
            totalScore += q.score || 0;
            totalConfidence += q.confidence || 0;
            totalCommunication += q.communication || 0;
            totalCorrectness += q.correctness || 0;
        })

        const finalScore = totalQuestions ? totalScore / totalQuestions : 0;
        const avgConfidence = totalQuestions ? totalConfidence / totalQuestions : 0;
        const avgCommunication = totalQuestions ? totalCommunication / totalQuestions : 0;
        const avgCorrectness = totalQuestions ? totalCorrectness / totalQuestions : 0;

        interview.finalScore = finalScore;
        interview.status = "Completed";
        await interview.save();

        return res.status(200).json({
            interviewId: interview._id,
            role: interview.role,
            experience: interview.experience,
            mode: interview.mode,
            finalScore: Number(finalScore.toFixed(1)),
            confidence: Number(avgConfidence.toFixed(1)),
            communication: Number(avgCommunication.toFixed(1)),
            correctness: Number(avgCorrectness.toFixed(1)),

            questionWiseScore: interview.questions.map((q) => ({
                question: q.question,
                answer: q.answer ?? "",
                score: q.score ?? 0,
                feedback: q.feedback ?? "",
                confidence: q.confidence ?? 0,
                communication: q.communication ?? 0,
                correctness: q.correctness ?? 0,
            })),


        })

    } catch (error) {

        return res.status(500).json({
            message: error.message
        })
    }
}

export const getInterviewHistory = async (req, res) => {
    try {
        const interviews = await interviewModel.find({
            userId: req.userId,
            status: "Completed"
        }).sort({ createdAt: -1 }).lean();

        return res.status(200).json({
            interviews: interviews.map((interview) => ({
                _id: interview._id,
                role: interview.role,
                experience: interview.experience,
                mode: interview.mode,
                finalScore: Number((interview.finalScore || 0).toFixed(1)),
                status: interview.status,
                createdAt: interview.createdAt,
                questionWiseScore: (interview.questions || []).map((question) => ({
                    question: question.question,
                    answer: question.answer ?? "",
                    score: question.score ?? 0,
                    feedback: question.feedback ?? "",
                    confidence: question.confidence ?? 0,
                    communication: question.communication ?? 0,
                    correctness: question.correctness ?? 0
                }))
            }))
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getInterviewReport = async (req, res) => {
    try {
        const interview = await interviewModel.findOne({
            _id: req.params.id,
            userId: req.userId
        }).lean();
        if (!interview) {
            return res.status(404).json({ message: "Interview report not found." });
        }

        const questions = interview.questions || [];
        const average = (field) => questions.length
            ? questions.reduce((total, question) => total + Number(question[field] || 0), 0) / questions.length
            : 0;

        return res.status(200).json({
            interviewId: interview._id,
            role: interview.role,
            experience: interview.experience,
            mode: interview.mode,
            finalScore: Number((interview.finalScore || 0).toFixed(1)),
            confidence: Number(average("confidence").toFixed(1)),
            communication: Number(average("communication").toFixed(1)),
            correctness: Number(average("correctness").toFixed(1)),
            questionWiseScore: questions.map((question) => ({
                question: question.question,
                answer: question.answer ?? "",
                score: question.score ?? 0,
                feedback: question.feedback ?? "",
                confidence: question.confidence ?? 0,
                communication: question.communication ?? 0,
                correctness: question.correctness ?? 0
            }))
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
