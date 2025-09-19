import express from 'express';
import {
  createPoll,
  getAllPolls,
  getPollById,
  getUserPolls,
  deletePoll,
  getVoters,
  getAllPublicPolls,
  updatePoll,
  getUserProfileWithPolls,
} from '../controllers/pollController.js';
import { voteOnPoll, getUserVotes } from '../controllers/voteController.js'; // Import from voteController
import { userAuthMiddleware } from '../middileware/userAuth.js';

const pollRouter = express.Router();

// Public routes
pollRouter.get('/polls',userAuthMiddleware, getAllPolls);
pollRouter.get('/polls/:id',userAuthMiddleware, getPollById);
pollRouter.get('/:userId/profile-with-polls',userAuthMiddleware,getUserProfileWithPolls)
// Protected routes (require authentication)
pollRouter.post('/polls', userAuthMiddleware, createPoll);
pollRouter.post('/polls/vote', userAuthMiddleware, voteOnPoll); // This now uses voteController
pollRouter.get('/user/polls', userAuthMiddleware, getUserPolls);
pollRouter.get('/public',getAllPublicPolls)
pollRouter.get('/user/votes', userAuthMiddleware, getUserVotes); // New route for user votes
pollRouter.delete('/polls/:id', userAuthMiddleware, deletePoll);
pollRouter.get("/polls/:id/voters",getVoters)
pollRouter.put('/:id',userAuthMiddleware,updatePoll)
export default pollRouter;