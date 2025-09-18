import { useContext, useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { PollContext } from '../context/PollContext';
import { AppContext } from '../context/AppContext';
import Navbar from '../pages/Navbar';

const VotersList = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchPollById } = useContext(PollContext);
  const { islogged, userdata } = useContext(AppContext);
  const [poll, setPoll] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPoll();
  }, [id]);

  const loadPoll = async () => {
    try {
      setIsLoading(true);
      setError('');
      const pollData = await fetchPollById(id);
      setPoll(pollData);
    } catch (error) {
      console.error('Failed to load poll:', error);
      setError('Failed to load poll. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading poll...</div>;
  }

  if (!poll) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800">Poll not found</h1>
        <Link to="/polls" className="text-blue-600 hover:text-blue-700 mt-4 inline-block">
          Back to all polls
        </Link>
      </div>
    );
  }

  const totalVotes = poll.options.reduce((sum, option) => sum + (option.voteCount || 0), 0);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
     <Navbar />

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-6 mt-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{poll.question}</h1>
          <div className="text-gray-600 space-y-1 text-sm">
            <p>Created by: <span className="font-medium">{poll.createdBy?.name || 'Unknown'}</span></p>
            <p>Created on: <span className="font-medium">{formatDate(poll.createdAt)}</span></p>
            <p>Total votes: <span className="font-medium">{totalVotes}</span></p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Voters List</h2>
        
        {poll.options.map(option => (
          <div key={option._id} className="mb-8 last:mb-0">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">{option.text}</h3>
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
                {option.voteCount || 0} vote{option.voteCount !== 1 ? 's' : ''}
              </span>
            </div>
            
            {option.votes && option.votes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {option.votes.map(voter => (
                  <div key={voter._id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <span className="text-blue-800 font-medium">
                        {voter.name ? voter.name.charAt(0).toUpperCase() : 'U'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{voter.name || 'Unknown User'}</p>
                      <p className="text-xs text-gray-500">Voted on: {formatDate(voter.votedAt || poll.updatedAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic py-4">No votes for this option yet.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VotersList;