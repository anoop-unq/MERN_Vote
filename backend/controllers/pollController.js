// controllers/pollController.js
import Poll from '../models/Poll.js';
import Vote from '../models/Vote.js';

// Create a new poll
export const createPoll = async (req, res) => {
  try {
    const { question, options, isPublished } = req.body;
    const userId = req.user._id;

    if (!question || !options || options.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Poll must have a question and at least two options"
      });
    }

    const poll = new Poll({
      question,
      options: options.map(option => ({ text: option })),
      createdBy: userId,
      isPublished: isPublished || false
    });

    await poll.save();
    
    // Populate creator details
    await poll.populate('createdBy', 'name email photo');

    res.status(201).json({
      success: true,
      message: "Poll created successfully",
      poll
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating poll",
      error: error.message
    });
  }
};

// Get all polls
// export const getAllPolls = async (req, res) => {
//   try {
//     const { page = 1, limit = 10 } = req.query;
//     const skip = (page - 1) * limit;

//     const polls = await Poll.find({ isPublished: true })
//       .populate('createdBy', 'name email photo')
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(parseInt(limit));

//     const totalPolls = await Poll.countDocuments({ isPublished: true });

//     res.status(200).json({
//       success: true,
//       polls,
//       currentPage: parseInt(page),
//       totalPages: Math.ceil(totalPolls / limit),
//       totalPolls
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error fetching polls",
//       error: error.message
//     });
//   }
// };

export const getAllPolls = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const polls = await Poll.find({ isPublished: true })
      .populate('createdBy', 'name email photo')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalPolls = await Poll.countDocuments({ isPublished: true });

    // Check if current user has voted on each poll
    const pollsWithVoteStatus = await Promise.all(polls.map(async (poll) => {
      const pollData = poll.toObject();
      
      let userVoted = false;
      if (req.user && req.user._id) {
        // Check if user has voted on this poll
        const voteExists = await Vote.findOne({
          user: req.user._id,
          poll: poll._id
        });
        userVoted = !!voteExists;
      }

      // Get vote counts for each option
      const voteCounts = await Vote.aggregate([
        { $match: { poll: poll._id } },
        { $group: { _id: '$option', count: { $sum: 1 } } }
      ]);

      const optionsWithVotes = pollData.options.map(option => {
        const voteCount = voteCounts.find(vc => vc._id.toString() === option._id.toString())?.count || 0;
        return {
          ...option,
          voteCount: voteCount
        };
      });

      const totalVotes = optionsWithVotes.reduce((sum, option) => sum + option.voteCount, 0);

      return {
        ...pollData,
        options: optionsWithVotes,
        userVoted: userVoted,
        totalVotes: totalVotes
      };
    }));

    res.status(200).json({
      success: true,
      polls: pollsWithVoteStatus,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalPolls / limit),
      totalPolls
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching polls",
      error: error.message
    });
  }
};

export const getAllPublicPolls = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const polls = await Poll.find({ isPublished: true })
      .populate('createdBy', 'name email photo')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalPolls = await Poll.countDocuments({ isPublished: true });

    // Get vote counts for each poll (no user authentication required)
    const pollsWithVotes = await Promise.all(polls.map(async (poll) => {
      const pollData = poll.toObject();
      
      // Get vote counts for each option
      const voteCounts = await Vote.aggregate([
        { $match: { poll: poll._id } },
        { $group: { _id: '$option', count: { $sum: 1 } } }
      ]);

      const optionsWithVotes = pollData.options.map(option => {
        const voteCount = voteCounts.find(vc => vc._id.toString() === option._id.toString())?.count || 0;
        return {
          ...option,
          voteCount: voteCount
        };
      });

      const totalVotes = optionsWithVotes.reduce((sum, option) => sum + option.voteCount, 0);

      return {
        ...pollData,
        options: optionsWithVotes,
        totalVotes: totalVotes,
        userVoted: false // Always false for public polls as we don't check user auth
      };
    }));

    res.status(200).json({
      success: true,
      polls: pollsWithVotes,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalPolls / limit),
      totalPolls
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching public polls",
      error: error.message
    });
  }
};


export const updatePoll = async (req, res) => {
  try {
    console.log("=== UPDATE POLL REQUEST ===");
    console.log("Request params:", req.params);
    console.log("Request body:", req.body);
    console.log("Authenticated user:", req.user ? req.user : "No user");

    const { question, options, allowAddOptions } = req.body;
    
    // Validate input
    if (!question || !options || options.length < 2) {
      console.log("Validation failed: missing question or options");
      return res.status(400).json({
        success: false,
        message: 'Poll must have a question and at least 2 options'
      });
    }

    // Find the poll
    const poll = await Poll.findById(req.params.id);
    console.log("Found poll:", poll);
    
    if (!poll) {
      console.log("Poll not found with ID:", req.params.id);
      return res.status(404).json({ 
        success: false,
        message: 'Poll not found' 
      });
    }

    // Debug: Check what's actually in req.user
    console.log("req.user object:", JSON.stringify(req.user, null, 2));
    console.log("req.user._id:", req.user._id);
    console.log("req.user.id:", req.user.id);
    
    // Get the user ID properly - try different ways MongoDB might store it
    const userId = req.user._id ? req.user._id.toString() : req.user.id;
    
    if (!userId) {
      console.log("Could not extract user ID from req.user");
      return res.status(403).json({ 
        success: false,
        message: 'Authentication error: User ID not found' 
      });
    }

    // Check if user is the creator
    console.log("Poll creator ID:", poll.createdBy.toString());
    console.log("Request user ID:", userId);
    
    if (poll.createdBy.toString() !== userId) {
      console.log("Unauthorized: User is not the poll creator");
      return res.status(403).json({ 
        success: false,
        message: 'You can only edit your own polls' 
      });
    }

    // Check if poll has votes
    const hasVotes = poll.options.some(option => option.votes.length > 0 || option.voteCount > 0);
    console.log("Poll has votes:", hasVotes);
    
    if (hasVotes && !allowAddOptions) {
      console.log("Cannot edit poll with votes without allowAddOptions");
      return res.status(400).json({ 
        success: false,
        message: 'Cannot edit a poll that already has votes. Use allowAddOptions to add new options only.' 
      });
    }

    // Update logic based on whether poll has votes
    if (hasVotes && allowAddOptions) {
      console.log("Adding new options to existing poll with votes");
      // Only add new options logic
      const existingOptionTexts = poll.options.map(opt => opt.text);
      const newOptions = options.filter(opt => !existingOptionTexts.includes(opt.text));
      
      console.log("New options to add:", newOptions);
      
      if (newOptions.length === 0) {
        return res.status(400).json({ 
          success: false,
          message: 'No new options to add' 
        });
      }
      
      poll.options.push(...newOptions.map(opt => ({
        text: opt.text,
        voteCount: 0,
        votes: []
      })));
      
    } else {
      console.log("Full poll update (no votes or allowAddOptions is false)");
      // Full update allowed
      poll.question = question;
      poll.options = options.map(opt => ({
        text: opt.text,
        voteCount: 0,
        votes: []
      }));
    }

    const updatedPoll = await poll.save();
    console.log("Poll updated successfully");
    
    // Populate creator details
    await updatedPoll.populate('createdBy', 'name email');
    
    res.json({
      success: true,
      message: hasVotes ? 'New options added successfully' : 'Poll updated successfully',
      poll: updatedPoll
    });
    
  } catch (error) {
    console.error('Error updating poll:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
}



// Get single poll by ID
// export const getPollById = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     const poll = await Poll.findById(id)
//       .populate('createdBy', 'name email photo')
//       .populate('options.votes', 'user')
        

//     if (!poll) {
//       return res.status(404).json({
//         success: false,
//         message: "Poll not found"
//       });
//     }

//     // Calculate vote counts for each option
//     const pollWithVotes = {
//       ...poll.toObject(),
//       options: poll.options.map(option => ({
//         ...option,
//         voteCount: option.votes.length
//       }))
//     };
//     //  return poll.toObject();
    
//     res.status(200).json({
//       success: true,
//       poll: pollWithVotes
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error fetching poll",
//       error: error.message
//     });
//   }
// };

// // In your backend poll controller
// export const getPollById = async (req, res) => {
//   try {
//     const poll = await Poll.findById(req.params.id)
//       .populate('createdBy', 'name email photo')
//       .populate('options.votes', 'name email') // Populate votes with user info
//       .lean(); // Convert to plain JavaScript object

//     if (!poll) {
//       return res.status(404).json({ success: false, message: 'Poll not found' });
//     }

//     res.status(200).json({ success: true, poll });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

export const getPollById = async (req, res) => {
  try {
    const { id } = req.params;
    // console.log(req.user)
    
    const poll = await Poll.findById(id)
      .populate('createdBy', 'name email photo')
      .populate({
        path: 'options.votes',
        select: 'user',
        populate: {
          path: 'user',
          select: 'name email _id'
        }
      });

    if (!poll) {
      return res.status(404).json({
        success: false,
        message: "Poll not found"
      });
    }

    // Convert to plain object and structure the data properly
    const pollData = poll.toObject();
    
    // Check if current user has voted (if authenticated)
    let userVoted = false;
    if (req.user && req.user._id) {
      userVoted = pollData.options.some(option => 
        option.votes && option.votes.some(vote => 
          vote.user && vote.user._id && vote.user._id.toString() === req.user._id.toString()
        )
      );
    }

    // Calculate vote counts and structure options
    const optionsWithVotes = pollData.options.map(option => ({
      _id: option._id,
      text: option.text,
      votes: option.votes ? option.votes.map(vote => ({
        _id: vote.user?._id,
        name: vote.user?.name || 'Unknown',
        email: vote.user?.email
      })).filter(vote => vote._id) : [],
      voteCount: option.votes ? option.votes.length : 0
    }));

    const responseData = {
      ...pollData,
      options: optionsWithVotes,
      userVoted: userVoted,
      totalVotes: optionsWithVotes.reduce((sum, option) => sum + option.voteCount, 0)
    };

    // Remove the original votes array to avoid duplication
    delete responseData.options.$;

    res.status(200).json({
      success: true,
      poll: responseData
    });
  } catch (error) {
    console.error('Error in getPollById:', error);
    res.status(500).json({
      success: false,
      message: "Error fetching poll",
      error: error.message
    });
  }
};



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

// Get user's polls
// export const getUserPolls = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const { page = 1, limit = 10 } = req.query;
//     const skip = (page - 1) * limit;

//     const polls = await Poll.find({ createdBy: userId })
//       .populate('createdBy', 'name email photo')
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(parseInt(limit));

//     const totalPolls = await Poll.countDocuments({ createdBy: userId });

//     res.status(200).json({
//       success: true,
//       polls,
//       currentPage: parseInt(page),
//       totalPages: Math.ceil(totalPolls / limit),
//       totalPolls
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error fetching user polls",
//       error: error.message
//     });
//   }
// };

export const getUserPolls = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const polls = await Poll.find({ createdBy: userId })
      .populate('createdBy', 'name email photo')
      .populate({
        path: 'options.votes',
        select: 'votedAt', // You can select specific fields if needed
        options: { limit: 1000 } // Increase limit if you have many votes
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Calculate voteCount for each option
    const pollsWithVoteCounts = polls.map(poll => {
      const pollObj = poll.toObject();
      pollObj.options = pollObj.options.map(option => {
        return {
          ...option,
          voteCount: option.votes ? option.votes.length : 0
        };
      });
      return pollObj;
    });

    const totalPolls = await Poll.countDocuments({ createdBy: userId });

    res.status(200).json({
      success: true,
      polls: pollsWithVoteCounts,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalPolls / limit),
      totalPolls
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching user polls",
      error: error.message
    });
  }
};

// Delete a poll
export const deletePoll = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const poll = await Poll.findById(id);
    
    if (!poll) {
      return res.status(404).json({
        success: false,
        message: "Poll not found"
      });
    }

    // Check if user owns the poll
    if (poll.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own polls"
      });
    }

    // Delete all votes associated with this poll
    await Vote.deleteMany({ poll: id });
    
    // Delete the poll
    await Poll.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Poll deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting poll",
      error: error.message
    });
  }
};

export const getVoters = async (req,res)=>{
 try {
    const poll = await Poll.findById(req.params.id).populate('options.votes', 'name email');
    
    if (!poll) {
      return res.status(404).json({ success: false, message: 'Poll not found' });
    }

    // Extract unique voters
    const voterIds = new Set();
    poll.options.forEach(option => {
      option.votes.forEach(vote => {
        if (typeof vote === 'object') {
          voterIds.add(vote._id.toString());
        }
      });
    });

    const voters = await User.find({ _id: { $in: Array.from(voterIds) } }, 'name email');
    
    res.status(200).json({ success: true, voters });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}