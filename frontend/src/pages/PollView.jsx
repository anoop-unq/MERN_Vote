// import { useContext, useEffect, useState } from 'react';
// import { useParams, Link, useNavigate } from 'react-router-dom';
// import { PollContext } from '../context/PollContext';
// import { AppContext } from '../context/AppContext';

// const PollView = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { fetchPollById, voteOnPoll, fetchVotersForPoll } = useContext(PollContext);
//   const { islogged, userdata } = useContext(AppContext);
//   const [poll, setPoll] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [selectedOption, setSelectedOption] = useState(null);
//   const [isVoting, setIsVoting] = useState(false);
//   const [hasVoted, setHasVoted] = useState(false);
//   const [error, setError] = useState('');
//   const [voters, setVoters] = useState([]);
//   const [showVoters, setShowVoters] = useState(false);

//   useEffect(() => {
//     loadPoll();
//   }, [id]);

//   const loadPoll = async () => {
//     try {
//       setIsLoading(true);
//       setError('');
//       const pollData = await fetchPollById(id);
      
//       // Convert to plain object if needed
//       const cleanPoll = JSON.parse(JSON.stringify(pollData));
//       setPoll(cleanPoll);
      
//       // Check if user has already voted
//       if (islogged && userdata && cleanPoll) {
//         const userHasVoted = cleanPoll.options.some(option => 
//           option.votes && option.votes.some(vote => {
//             // Handle different vote structures
//             if (typeof vote === 'object') {
//               return vote._id === userdata._id;
//             } else {
//               return vote === userdata._id;
//             }
//           })
//         );
//         setHasVoted(userHasVoted);
//       }

//       // Load voters details if needed
//       await loadVoters(cleanPoll);
//     } catch (error) {
//       console.error('Failed to load poll:', error);
//       setError('Failed to load poll. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const loadVoters = async (pollData) => {
//     try {
//       // If votes are not populated with user details, fetch them
//       if (pollData.options.some(option => option.votes && option.votes.length > 0 && typeof option.votes[0] === 'string')) {
//         const votersData = await fetchVotersForPoll(id);
//         console.log(votersData)
//         setVoters(votersData);
//       }
//     } catch (error) {
//       console.error('Failed to load voters:', error);
//     }
//   };

//   const handleVote = async () => {
//     if (!selectedOption) return;
    
//     setIsVoting(true);
//     setError('');
//     try {
//       await voteOnPoll(id, selectedOption);
//       setHasVoted(true);
//       // Reload the poll to get updated data
//       await loadPoll();
//     } catch (error) {
//       console.error('Failed to vote:', error);
//       setError('Failed to submit vote. Please try again.');
//     } finally {
//       setIsVoting(false);
//     }
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   console.log(poll,"855")
//   console.log(hasVoted,"55")
//   const getVoterName = (vote) => {
   


    


//     if (typeof vote === 'object' && vote.name) {
//       return vote.name;
//     }

    
//     // If we have fetched voters separately
//     const voter = voters.find(v => v._id === (typeof vote === 'object' ? vote._id : vote));
//     console.log(voter)
//     return voter ? voter.name : 'Unknown User';
//   };

//   if (isLoading) {
//     return <div className="flex justify-center items-center h-64">Loading poll...</div>;
//   }

//   if (!poll) {
//     return (
//       <div className="container mx-auto px-4 py-8 text-center">
//         <h1 className="text-2xl font-bold text-gray-800">Poll not found</h1>
//         <Link to="/polls" className="text-blue-600 hover:text-blue-700 mt-4 inline-block">
//           Back to all polls
//         </Link>
//       </div>
//     );
//   }

//   const totalVotes = poll.options.reduce((sum, option) => sum + (option.votes?.length || 0), 0);

//   return (
//     <div className="container mx-auto px-4 py-8 max-w-2xl">
//       <button 
//         onClick={() => navigate(-1)}
//         className="flex items-center text-blue-600 hover:text-blue-700 mb-4"
//       >
//         <svg 
//           xmlns="http://www.w3.org/2000/svg" 
//           className="h-5 w-5 mr-1" 
//           fill="none" 
//           viewBox="0 0 24 24" 
//           stroke="currentColor"
//         >
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//         </svg>
//         Back
//       </button>

//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           {error}
//         </div>
//       )}

//       <div className="bg-white rounded-lg shadow-md p-6">
//         {/* Poll Header */}
//         <div className="mb-6">
//           <h1 className="text-2xl font-bold text-gray-800 mb-2">{poll.question}</h1>
//           <div className="text-gray-600 space-y-1 text-sm">
//             <p>Created by: <span className="font-medium">{poll.createdBy?.name || 'Unknown'}</span></p>
//             <p>Created on: <span className="font-medium">{formatDate(poll.createdAt)}</span></p>
//             <p>Last updated: <span className="font-medium">{formatDate(poll.updatedAt)}</span></p>
//             <p>Total votes: <span className="font-medium">{totalVotes}</span></p>
//             <p>Status: <span className={`font-medium ${poll.isPublished ? 'text-green-600' : 'text-yellow-600'}`}>
//               {poll.isPublished ? 'Published' : 'Draft'}
//             </span></p>
//           </div>
//         </div>

//         {islogged && !hasVoted ? (
//           <div>
//             <h2 className="text-lg font-semibold text-gray-800 mb-4">Cast your vote:</h2>
//             <div className="space-y-3 mb-6">
//               {poll.options.map(option => (
//                 <div key={option._id} className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
//                   <input
//                     type="radio"
//                     id={option._id}
//                     name={`poll-${poll._id}`}
//                     value={option._id}
//                     checked={selectedOption === option._id}
//                     onChange={() => setSelectedOption(option._id)}
//                     className="mr-4 h-5 w-5 text-blue-600"
//                   />
//                   <label htmlFor={option._id} className="text-gray-700 flex-1 text-lg cursor-pointer">
//                     {option.text}
//                   </label>
                
//                   <span className="text-sm text-gray-500 ml-2">
//                     ({option.votes?.length || 0} votes)
//                   </span>
//                 </div>
//               ))}
//             </div>
            
//             <button
//               onClick={handleVote}
//               disabled={!selectedOption || isVoting}
//               className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold transition-colors"
//             >
//               {isVoting ? 'Voting...' : 'Submit Vote'}
//             </button>
//           </div>
//         ) : (
//           <div>
//             <h2 className="text-lg font-semibold text-gray-800 mb-4">Poll Results:</h2>
//             <div className="space-y-6 mb-6">
//               {poll.options.map(option => {
//                 const optionVotes = option.votes?.length || 0;
//                 const percentage = totalVotes > 0 ? ((optionVotes / totalVotes) * 100).toFixed(1) : 0;
                
//                 return (
//                   <div key={option._id} className="mb-4 p-4 border border-gray-200 rounded-lg">
//                     <div className="flex justify-between items-center mb-3">
//                       <span className="text-gray-800 font-medium text-lg">{option.text}</span>
//                       <span className="text-gray-600 font-semibold">
//                         {percentage}% ({optionVotes} vote{optionVotes !== 1 ? 's' : ''})
//                       </span>
//                     </div>
                    
//                     {/* Progress Bar */}
//                     <div className="w-full bg-gray-200 rounded-full h-4 mb-3">
//                       <div
//                         className="bg-blue-600 h-4 rounded-full transition-all duration-500"
//                         style={{ width: `${percentage}%` }}
//                       ></div>
//                     </div>

//                     {/* Voters List */}
//                     {option.votes && option.votes.length > 0 && (
//                       <div className="mt-3">
//                         <button
//                           onClick={() => setShowVoters(!showVoters)}
//                           className="text-sm text-blue-600 hover:text-blue-700 mb-2"
//                         >
//                           {showVoters ? 'Hide' : 'Show'} voters ({optionVotes})
//                         </button>
                        
//                         {showVoters && (
//                           <div className="bg-gray-50 p-3 rounded-lg mt-2">
//                             <p className="text-xs text-gray-500 font-medium mb-2">Voted by:</p>
//                             <div className="space-y-1">
//                               {option.votes.map((vote, index) => (
//                                 <div key={index} className="text-sm text-gray-600 flex items-center">
//                                   <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs mr-2">
//                                     {index + 1}
//                                   </span>
//                                   {getVoterName(vote)}
//                                 </div>
//                               ))}
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
            
//             {!islogged ? (
//               <Link
//                 to="/login"
//                 className="block text-center bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 text-lg font-semibold transition-colors"
//               >
//                 Login to vote
//               </Link>
//             ) : (
//               <div className="text-center">
//                 <p className="text-green-600 text-lg font-medium mb-4">
//                   {hasVoted ? 'Thank you for voting!' : 'You have already voted on this poll'}
//                 </p>
//                 <button
//                   onClick={() => navigate('/polls')}
//                   className="text-blue-600 hover:text-blue-700 text-sm"
//                 >
//                   View other polls →
//                 </button>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PollView;

import { useContext, useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { PollContext } from '../context/PollContext';
import { AppContext } from '../context/AppContext';
import Navbar from './Navbar';

const PollView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchPollById, voteOnPoll } = useContext(PollContext);
  const { islogged, userdata } = useContext(AppContext);
  const [poll, setPoll] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isVoting, setIsVoting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPoll();
  }, [id, islogged, userdata]);

  const loadPoll = async () => {
    try {
      setIsLoading(true);
      setError('');
      const pollData = await fetchPollById(id);
      console.log('Poll data:', pollData); // Debug log
      setPoll(pollData);
    } catch (error) {
      console.error('Failed to load poll:', error);
      setError('Failed to load poll. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVote = async () => {
    if (!selectedOption) return;
    
    setIsVoting(true);
    setError('');
    try {
      await voteOnPoll(id, selectedOption);
      // Reload the poll to get updated data
      await loadPoll();
    } catch (error) {
      console.error('Failed to vote:', error);
      setError(error.response?.data?.message || 'Failed to submit vote. Please try again.');
    } finally {
      setIsVoting(false);
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

  // Check if current user voted for a specific option
  const didUserVoteForOption = (option) => {
    if (!islogged || !userdata || !option.votes) return false;
    return option.votes.some(vote => vote._id === userdata._id);
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
  const hasVoted = poll.userVoted || false;

  console.log('Poll state:', { poll, hasVoted, islogged, userdata }); // Debug log

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Navbar />

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mt-10">
        {/* Poll Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{poll.question}</h1>
          <div className="text-gray-600 space-y-1 text-sm">
            <p>Created by: <span className="font-medium">{poll.createdBy?.name || 'Unknown'}</span></p>
            <p>Created on: <span className="font-medium">{formatDate(poll.createdAt)}</span></p>
            <p>Total votes: <span className="font-medium">{totalVotes}</span></p>
            {hasVoted && (
              <p className="text-green-600 font-medium">✓ You have already voted on this poll</p>
            )}
          </div>
        </div>

        {islogged && !hasVoted ? (
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Cast your vote:</h2>
            <div className="space-y-3 mb-6">
              {poll.options.map(option => (
                <div key={option._id} className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                  <input
                    type="radio"
                    id={option._id}
                    name={`poll-${poll._id}`}
                    value={option._id}
                    checked={selectedOption === option._id}
                    onChange={() => setSelectedOption(option._id)}
                    className="mr-4 h-5 w-5 text-blue-600"
                  />
                  <label htmlFor={option._id} className="text-gray-700 flex-1 text-lg cursor-pointer">
                    {option.text}
                  </label>
                  <span className="text-sm text-gray-500 ml-2">
                    ({option.voteCount || 0} votes)
                  </span>
                </div>
              ))}
            </div>
            
            <button
              onClick={handleVote}
              disabled={!selectedOption || isVoting}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold transition-colors"
            >
              {isVoting ? 'Voting...' : 'Submit Vote'}
            </button>
          </div>
        ) : (
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Poll Results:</h2>
            <div className="space-y-6 mb-6">
              {poll.options.map(option => {
                const optionVotes = option.voteCount || 0;
                const percentage = totalVotes > 0 ? ((optionVotes / totalVotes) * 100).toFixed(1) : 0;
                const userVotedForThis = didUserVoteForOption(option);
                
                return (
                  <div key={option._id} className="mb-4 p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center">
                        <span className="text-gray-800 font-medium text-lg">{option.text}</span>
                        {userVotedForThis && (
                          <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                            Your vote
                          </span>
                        )}
                      </div>
                      <span className="text-gray-600 font-semibold">
                        {percentage}% ({optionVotes} vote{optionVotes !== 1 ? 's' : ''})
                      </span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-4 mb-3">
                      <div
                        className="bg-blue-600 h-4 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>

                    {/* Voters List */}
                    {option.votes && option.votes.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs text-gray-500 font-medium mb-2">
                          Voted by: {option.votes.map(vote => vote.name).join(', ')}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            {!islogged ? (
              <Link
                to="/login"
                className="block text-center bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 text-lg font-semibold transition-colors"
              >
                Login to vote
              </Link>
            ) : (
              <div className="text-center">
                <p className="text-green-600 text-lg font-medium mb-4">
                  {hasVoted ? 'Thank you for voting!' : 'You have already voted on this poll'}
                </p>
                <button
                  onClick={() => navigate('/polls')}
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  View other polls →
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PollView;