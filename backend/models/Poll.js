// models/Poll.js
import mongoose from "mongoose";

const pollSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true,
    maxlength: 300
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  options: [{
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },
    votes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vote"
    }]
  }]
}, { timestamps: true });

const Poll = mongoose.model('Poll', pollSchema);
export default Poll;