import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  created_at: { type: Date, default: Date.now }
});

const pollSchema = new mongoose.Schema({
  creator_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: String,
  is_anonymous: { type: Boolean, default: false },
  expires_at: Date,
  is_published: { type: Boolean, default: false },
  is_closed: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now }
});

const questionSchema = new mongoose.Schema({
  poll_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Poll', required: true },
  text: { type: String, required: true },
  is_mandatory: { type: Boolean, default: false },
  order_index: { type: Number, required: true }
});

const optionSchema = new mongoose.Schema({
  question_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
  text: { type: String, required: true },
  order_index: { type: Number, required: true }
});

const responseSchema = new mongoose.Schema({
  poll_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Poll', required: true },
  respondent_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // nullable if anonymous
  submitted_at: { type: Date, default: Date.now }
});

const answerSchema = new mongoose.Schema({
  response_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Response', required: true },
  question_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
  option_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Option', required: true }
});

export const User = mongoose.model('User', userSchema);
export const Poll = mongoose.model('Poll', pollSchema);
export const Question = mongoose.model('Question', questionSchema);
export const Option = mongoose.model('Option', optionSchema);
export const Response = mongoose.model('Response', responseSchema);
export const Answer = mongoose.model('Answer', answerSchema);

