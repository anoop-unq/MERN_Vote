// models/Vote.js
import mongoose from "mongoose";

const voteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  poll: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Poll",
    required: true
  },
  option: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
}, { timestamps: true });

// Create compound index to ensure one vote per user per poll
voteSchema.index({ user: 1, poll: 1 }, { unique: true });

const Vote = mongoose.model('Vote', voteSchema);
export default Vote;