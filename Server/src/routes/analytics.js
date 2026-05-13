import express from 'express';
import { Poll, Question, Option, Response, Answer } from '../db/schema.js'
import authMiddleware from '../middleware/auth.js'
const router = express.Router();

router.get('/:pollId', authMiddleware, async (req, res) => {
    try {
        // 1. Find poll and verify ownership
        const poll = await Poll.findById(req.params.pollId)
        if (!poll) return res.status(404).json({ message: "Poll not found" })
        if (poll.creator_id.toString() !== req.user.id) {
            return res.status(403).json({ message: "Access denied" })
        }

        // 2. Total responses
        const totalResponses = await Response.countDocuments({ poll_id: poll._id })

        // 3. Build question stats
        const questions = await Question.find({ poll_id: poll._id })

        const questionsWithStats = await Promise.all(
            questions.map(async (question) => {
                const options = await Option.find({ question_id: question._id })

                const optionsWithCounts = await Promise.all(
                    options.map(async (option) => ({
                        option_id: option._id,
                        text: option.text,
                        count: await Answer.countDocuments({ option_id: option._id })
                    }))
                )

                return {
                    question_id: question._id,
                    question_text: question.text,
                    options: optionsWithCounts
                }
            })
        )

        // 4. Return
        return res.status(200).json({ totalResponses, questions: questionsWithStats })

    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message })
    }
})
export default router;
