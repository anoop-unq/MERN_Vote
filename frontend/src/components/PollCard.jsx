// // // components/PollCard.jsx
// // import { useContext, useState } from 'react';
// // import { Link } from 'react-router-dom';
// // import { PollContext } from '../context/PollContext';
// // import { AppContext } from '../context/AppContext';

// // const PollCard = ({ poll }) => {
// //   const { voteOnPoll } = useContext(PollContext);
// //   const { islogged } = useContext(AppContext);
// //   const [selectedOption, setSelectedOption] = useState(null);
// //   const [isVoting, setIsVoting] = useState(false);
// //   const [hasVoted, setHasVoted] = useState(false);

// //   const handleVote = async () => {
// //     if (!selectedOption) return;

// //     setIsVoting(true);
// //     try {
// //       await voteOnPoll(poll._id, selectedOption);
// //       setHasVoted(true);
// //       // You might want to refresh the poll data here or use WebSocket updates
// //     } catch (error) {
// //       // Error is already handled in the context
// //     } finally {
// //       setIsVoting(false);
// //     }
// //   };

// //   const totalVotes = poll.options.reduce((sum, option) => sum + (option.votes?.length || 0), 0);

// //   return (
// //     <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
// //       <Link to={`/polls/${poll._id}`}>
// //         <h3 className="text-xl font-semibold text-gray-800 mb-3 hover:text-blue-600">
// //           {poll.question}
// //         </h3>
// //       </Link>

// //       <p className="text-gray-600 mb-4">
// //         Created by: {poll.createdBy?.name || 'Unknown'} • {totalVotes} votes
// //       </p>

// //       {islogged && !hasVoted ? (
// //         <div>
// //           <div className="space-y-2 mb-4">
// //             {poll.options.map(option => (
// //               <div key={option._id} className="flex items-center">
// //                 <input
// //                   type="radio"
// //                   id={option._id}
// //                   name={`poll-${poll._id}`}
// //                   value={option._id}
// //                   checked={selectedOption === option._id}
// //                   onChange={() => setSelectedOption(option._id)}
// //                   className="mr-2"
// //                 />
// //                 <label htmlFor={option._id} className="text-gray-700">
// //                   {option.text}
// //                 </label>
// //               </div>
// //             ))}
// //           </div>

// //           <button
// //             onClick={handleVote}
// //             disabled={!selectedOption || isVoting}
// //             className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
// //           >
// //             {isVoting ? 'Voting...' : 'Vote'}
// //           </button>
// //         </div>
// //       ) : (
// //         <div>
// //           <div className="space-y-2 mb-4">
// //             {poll.options.map(option => {
// //               const optionVotes = option.votes?.length || 0;
// //               const percentage = totalVotes > 0 ? ((optionVotes / totalVotes) * 100).toFixed(1) : 0;

// //               return (
// //                 <div key={option._id} className="mb-2">
// //                   <div className="flex justify-between text-sm mb-1">
// //                     <span className="text-gray-700">{option.text}</span>
// //                     <span className="text-gray-600">{percentage}% ({optionVotes})</span>
// //                   </div>
// //                   <div className="w-full bg-gray-200 rounded-full h-2">
// //                     <div
// //                       className="bg-blue-600 h-2 rounded-full"
// //                       style={{ width: `${percentage}%` }}
// //                     ></div>
// //                   </div>
// //                 </div>
// //               );
// //             })}
// //           </div>

// //           {!islogged ? (
// //             <Link
// //               to="/login"
// //               className="block text-center bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700"
// //             >
// //               Login to vote
// //             </Link>
// //           ) : (
// //             <p className="text-green-600 text-center">You've already voted on this poll</p>
// //           )}
// //         </div>
// //       )}

// //       <div className="mt-4 pt-4 border-t border-gray-200">
// //         <Link
// //           to={`/polls/${poll._id}`}
// //           className="text-blue-600 hover:text-blue-700 font-medium"
// //         >
// //           View details →
// //         </Link>
// //       </div>
// //     </div>
// //   );
// // };

// // export default PollCard;

// import { Link } from 'react-router-dom';

// const PollCard = ({ poll }) => {
//   const totalVotes = poll.options.reduce((sum, option) => sum + (option.voteCount || 0), 0);

//   return (
//     <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
//       <Link to={`/polls/${poll._id}`}>
//         <h3 className="text-xl font-semibold text-gray-800 mb-3 hover:text-blue-600">
//           {poll.question}
//         </h3>
//       </Link>

//       <div className="mb-4">
//         <p className="text-sm text-gray-600">
//           By: {poll.createdBy?.name || 'Unknown'}
//         </p>
//         <p className="text-sm text-gray-600">
//           {totalVotes} votes • {poll.options.length} options
//         </p>

//         {/* Show voting status */}
//         {poll.userVoted && (
//           <p className="text-sm text-green-600 font-medium mt-2">
//             ✓ You have voted
//           </p>
//         )}
//       </div>

//       <div className="space-y-2 mb-4">
//         {poll.options.slice(0, 3).map((option, index) => {
//           const percentage = totalVotes > 0 ? ((option.voteCount / totalVotes) * 100).toFixed(1) : 0;

//           return (
//             <div key={option._id} className="text-sm">
//               <div className="flex justify-between mb-1">
//                 <span className="text-gray-700 truncate">
//                   {index + 1}. {option.text}
//                 </span>
//                 <span className="text-gray-500">{percentage}%</span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2">
//                 <div
//                   className="bg-blue-500 h-2 rounded-full"
//                   style={{ width: `${percentage}%` }}
//                 ></div>
//               </div>
//             </div>
//           );
//         })}

//         {poll.options.length > 3 && (
//           <p className="text-sm text-gray-500 text-center">
//             +{poll.options.length - 3} more options
//           </p>
//         )}
//       </div>

//       <Link
//         to={`/polls/${poll._id}`}
//         className="block w-full bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700 transition-colors"
//       >
//         {poll.userVoted ? 'View More' : 'Vote Now'}
//       </Link>
//     </div>
//   );
// };

// export default PollCard;

// components/PollCard.jsx (alternative approach)

import { useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const PollCard = ({ poll }) => {
  const { islogged, userdata } = useContext(AppContext);

  // Calculate total votes
  const totalVotes =
    poll.options?.reduce((sum, option) => {
      return sum + (option.votes?.length || 0);
    }, 0) || 0;

  // Check if the current user has already voted in this poll
  const hasUserVoted =
    poll.options?.some((option) =>
      option.votes?.some((vote) => vote.user === userdata?.id)
    ) || false;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow ">
      <h3 className="text-xl font-semibold text-gray-800 mb-3 line-clamp-2">
        {poll.question}
      </h3>

      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
        <span>{poll.options?.length || 0} options</span>
        <span>{totalVotes} votes</span>
        {hasUserVoted && (
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
            Voted
          </span>
        )}
      </div>

      <div className="flex justify-between items-center">
        <Link
          to={`/polls/${poll._id}`}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          View Details →
        </Link>

        {!islogged ? (
          <div className="flex space-x-2">
            <Link
              to="/login"
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        ) : hasUserVoted ? (
          <Link
            to={`/chart/${poll._id}`}
            className="ml-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
          >
            View Chart
          </Link>
        ) : (
          <Link
            to={`/polls/${poll._id}`}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Vote Now
          </Link>
        )}
      </div>
    </div>
  );
};

export default PollCard;
