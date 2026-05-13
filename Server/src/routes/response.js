import express from 'express';
import { Poll, Question, Response, Answer } from '../db/schema.js'
import jwt from 'jsonwebtoken'
import authMiddleware from '../middleware/auth.js';
import { getIO } from '../socket/socketInstance.js'

const router = express.Router();



router.post('/:pollId', async (req, res) => {
    try {
        const { answers } = req.body

        // Find poll
        const poll = await Poll.findById(req.params.pollId)
        if (!poll) return res.status(404).json({ message: "Poll not found" })

        //Check if poll is active
        if (poll.is_closed) return res.status(400).json({ message: "Poll is closed" })
        if (poll.expires_at && new Date(poll.expires_at) < new Date()) {
            return res.status(400).json({ message: "Poll has expired" })
        }

        //  Check mandatory questions
        const mandatoryQuestions = await Question.find({ poll_id: poll._id, is_mandatory: true })
        const answeredIds = answers.map(a => a.question_id)
        for (const q of mandatoryQuestions) {
            if (!answeredIds.includes(q._id.toString())) {
                return res.status(400).json({ message: "Please answer all mandatory questions" })
            }
        }

        //Get respondent if logged in
        let respondentId = null
        const authHeader = req.headers.authorization
        if (authHeader) {
            try {
                const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET)
                respondentId = decoded.id
            } catch(e) {}
        }

        //Save response
        const response = await Response.create({ poll_id: poll._id, respondent_id: respondentId })

        // Save answers
        for (const a of answers) {
            await Answer.create({ response_id: response._id, question_id: a.question_id, option_id: a.option_id })
        }
        const io = getIO()
        if(io) io.to(req.params.pollId).emit('new_response', { pollId: req.params.pollId })

        

        return res.status(201).json({ message: "Response submitted successfully" })

    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message })
    }
})

router.get('/:pollId',authMiddleware, async (req, res) => {
    try {
        // Verify token → get req.user.id
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        // Find poll → verify creator owns it
        const poll = await Poll.findById(req.params.pollId);
        if (!poll) {
            return res.status(404).json({ message: "Poll not found" });
        }
        if (poll.creator_id.toString() !== req.user.id) {
            return res.status(403).json({ message: "Access denied" });
        }

        // Find all responses for that poll
        const responses = await Response.find({ poll_id: poll._id });
        // Return them
        return res.status(200).json({ responses });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
})




export default router;