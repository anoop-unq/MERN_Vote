// controllers/voteController.js
import Poll from '../models/Poll.js';
import Vote from '../models/Vote.js';
import { getIO } from '../websocket/socket.js';

// Vote on a poll
export const voteOnPoll = async (req, res) => {
  try {
    const { pollId, optionId } = req.body;
    const userId = req.user._id;

    // Check if poll exists
    const poll = await Poll.findById(pollId);
    if (!poll) {
      return res.status(404).json({
        success: false,
        message: "Poll not found"
      });
    }

    // Check if user has already voted on this poll
    const existingVote = await Vote.findOne({ user: userId, poll: pollId });
    if (existingVote) {
      return res.status(400).json({
        success: false,
        message: "You have already voted on this poll"
      });
    }

    // Check if option exists in the poll
    const optionExists = poll.options.some(option => option._id.toString() === optionId);
    if (!optionExists) {
      return res.status(400).json({
        success: false,
        message: "Invalid option for this poll"
      });
    }

    // Create vote
    const vote = new Vote({
      user: userId,
      poll: pollId,
      option: optionId
    });

    await vote.save();

    // Add vote to poll option
    await Poll.updateOne(
      { _id: pollId, "options._id": optionId },
      { $push: { "options.$.votes": vote._id } }
    );

    // Get updated poll with vote counts
    const updatedPoll = await Poll.findById(pollId)
      .populate('createdBy', 'name email photo');

    // Calculate vote counts
    const pollWithVotes = {
      ...updatedPoll.toObject(),
      options: updatedPoll.options.map(option => ({
        ...option,
        voteCount: option.votes.length
      }))
    };

    res.status(200).json({
      success: true,
      message: "Vote recorded successfully",
      poll: pollWithVotes
    });

    // WebSocket broadcast - THIS IS WHERE YOU ADD THE WEBSOCKET CODE
    const io = getIO();
    io.to(pollId).emit('voteUpdate', pollWithVotes);

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error voting on poll",
      error: error.message
    });
  }
};

// Get user's votes
export const getUserVotes = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const votes = await Vote.find({ user: userId })
      .populate('poll', 'question')
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalVotes = await Vote.countDocuments({ user: userId });

    res.status(200).json({
      success: true,
      votes,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalVotes / limit),
      totalVotes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching user votes",
      error: error.message
    });
  }
};