import express from 'express';
import authMiddleware from '../middleware/auth.js'
import {Poll, Question, Option} from '../db/schema.js'

const router = express.Router();


router.post('/', authMiddleware, async (req, res) => {
    try {
        const creatorId = req.user.id
        const { title, description, is_anonymous, expires_at, questions } = req.body

        //Create the Poll document
        const poll = await Poll.create({
            title,
            description,    
            is_anonymous,
            expires_at,
            creator_id: creatorId
        })
        
        //Loop through questions array:
        for (const questionData of questions) {
            //Create each Question linked to poll._id
            const question = await Question.create({
                text: questionData.text,
                is_mandatory: questionData.is_mandatory,
                order_index: questionData.order_index,
                poll_id: poll._id
            });

            //Loop through that question's options array
            for (const optionData of questionData.options) {
                //Create each Option linked to question._id
                await Option.create({
                    text: optionData.text,
                    order_index: optionData.order_index,
                    question_id: question._id
                });
            }
        }
        return res.status(201).json({
            message: "Poll created successfully",
            poll
        })

    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message })
    } 
})

router.get('/my', authMiddleware, async (req, res) => {
  try {
        //Find all polls where creator_id === req.user.id
        const polls = await Poll.find({ creator_id: req.user.id })
        return res.status(200).json({ polls })
  } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message })
  }
  
})

router.get('/:id',async (req, res) => {
  try {
      // Find poll by id
      const poll = await Poll.findById(req.params.id)
      if (!poll) {
          return res.status(404).json({ message: "Poll not found" })
      }

    const now = new Date()
    const isExpired = poll.expires_at && new Date(poll.expires_at) < now

      // Find all questions for that poll
      const questions = await Question.find({ poll_id: poll._id })

      // Find all options for those questions
      const options = await Option.find({ question_id: { $in: questions.map(q => q._id) } })
      // Return everything together
      return res.status(200).json({ poll, questions, options, isExpired })

  } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message })
  }
})

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        //Verify the poll belongs to req.user.id
        const poll = await Poll.findById(req.params.id)
        if (!poll) {
            return res.status(404).json({ message: "Poll not found" })
        }
        if (poll.creator_id.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized to delete this poll" })
        }

        // Delete poll, its questions and options
        const questionIds = await Question.find({ poll: poll._id }).distinct('_id')
        await Option.deleteMany({ question: { $in: questionIds } })
        await Question.deleteMany({ poll: poll._id })
        await Poll.findByIdAndDelete(req.params.id)

        return res.status(200).json({ message: "Poll deleted successfully" })
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message })
    }
})  

router.patch('/:id/publish', authMiddleware, async (req, res) => {
    try {
        const poll = await Poll.findById(req.params.id)
        if (!poll) {
            return res.status(404).json({ message: "Poll not found" })
        }
        if (poll.creator_id.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized to update this poll" })
        }

        poll.is_published = true
        await poll.save()

        return res.status(200).json({ message: "Poll updated successfully", poll })
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message })
    }
})

export default router;    
