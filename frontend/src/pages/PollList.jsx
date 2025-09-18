// // // // // pages/PollList.jsx
// // // // import { useContext, useEffect, useState } from 'react';
// // // // import { PollContext } from '../context/PollContext';
// // // // import { AppContext } from '../context/AppContext';
// // // // import { Link } from 'react-router-dom';
// // // // import PollCard from '../components/PollCard';

// // // // const PollList = () => {
// // // //   const { polls, isLoading, fetchPolls } = useContext(PollContext);
// // // //   const { islogged } = useContext(AppContext);
// // // //   const [currentPage, setCurrentPage] = useState(1);
// // // //   const [totalPages, setTotalPages] = useState(1);

// // // //   useEffect(() => {
// // // //     loadPolls();
// // // //   }, [currentPage]);

// // // //   const loadPolls = async () => {
// // // //     const data = await fetchPolls(currentPage, 10);
// // // //     if (data) {
// // // //       setTotalPages(data.totalPages);
// // // //     }
// // // //   };

// // // //   if (isLoading) {
// // // //     return <div className="flex justify-center items-center h-64">Loading polls...</div>;
// // // //   }

// // // //   return (
// // // //     <div className="container mx-auto px-4 py-8">
// // // //       <div className="flex justify-between items-center mb-6">
// // // //         <h1 className="text-3xl font-bold text-gray-800">All Polls</h1>
// // // //         {islogged && (
// // // //           <Link
// // // //             to="/polls/create"
// // // //             className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
// // // //           >
// // // //             Create Poll
// // // //           </Link>
// // // //         )}
// // // //       </div>

// // // //       {polls.length === 0 ? (
// // // //         <div className="text-center py-12">
// // // //           <p className="text-gray-500 text-lg">No polls available yet.</p>
// // // //           {islogged && (
// // // //             <Link
// // // //               to="/polls/create"
// // // //               className="text-blue-600 hover:text-blue-700 mt-4 inline-block"
// // // //             >
// // // //               Be the first to create a poll!
// // // //             </Link>
// // // //           )}
// // // //         </div>
// // // //       ) : (
// // // //         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
// // // //           {polls.map(poll => (
// // // //             <PollCard key={poll._id} poll={poll} />
// // // //           ))}
// // // //         </div>
// // // //       )}

// // // //       {totalPages > 1 && (
// // // //         <div className="flex justify-center mt-8">
// // // //           <div className="flex gap-2">
// // // //             {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
// // // //               <button
// // // //                 key={page}
// // // //                 onClick={() => setCurrentPage(page)}
// // // //                 className={`px-3 py-1 rounded ${
// // // //                   currentPage === page
// // // //                     ? 'bg-blue-600 text-white'
// // // //                     : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
// // // //                 }`}
// // // //               >
// // // //                 {page}
// // // //               </button>
// // // //             ))}
// // // //           </div>
// // // //         </div>
// // // //       )}
// // // //     </div>
// // // //   );
// // // // };

// // // // export default PollList;


// // // pages/PollList.jsx
// // import { useContext, useEffect, useState } from 'react';
// // import { PollContext } from '../context/PollContext';
// // import { AppContext } from '../context/AppContext';
// // import { Link, useNavigate } from 'react-router-dom';
// // import PollCard from '../components/PollCard';

// // const PollList = () => {
// //   const { polls, isLoading, fetchPolls } = useContext(PollContext);
// //   const { islogged } = useContext(AppContext);
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [totalPages, setTotalPages] = useState(1);
// //   const navigate = useNavigate(); // Hook for navigation

 

// //   useEffect(() => {
// //     loadPolls();
// //   }, [currentPage]);

// //   const loadPolls = async () => {
// //     const data = await fetchPolls(currentPage, 10);
// //     console.log(data,"PoLl List")
// //     if (data) {
// //       setTotalPages(data.totalPages);
// //     }
// //   };

// //   const handleGoBack = () => {
// //     navigate(-1); // Go back to previous page
// //   };

// //   if (isLoading) {
// //     return <div className="flex justify-center items-center h-64">Loading polls...</div>;
// //   }

// //   return (
// //     <div className="container mx-auto px-4 py-8">
// //       <div className="flex items-center mb-6">
// //         {/* Back Button */}
// //         <button
// //           onClick={handleGoBack}
// //           className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
// //           aria-label="Go back"
// //         >
// //           <svg 
// //             xmlns="http://www.w3.org/2000/svg" 
// //             className="h-6 w-6 mr-1" 
// //             fill="none" 
// //             viewBox="0 0 24 24" 
// //             stroke="currentColor"
// //           >
// //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
// //           </svg>
// //           Back
// //         </button>
        
// //         <h1 className="text-3xl font-bold text-gray-800 flex-grow">All Polls</h1>
        
// //         {islogged && (
// //           <Link
// //             to="/polls/create"
// //             className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
// //           >
// //             Create Poll
// //           </Link>
// //         )}
// //       </div>
      

// //       {polls.length === 0 ? (
// //         <div className="text-center py-12">
// //           <p className="text-gray-500 text-lg">No polls available yet.</p>
        
// //           {islogged && (
// //             <Link
// //               to="/polls/create"
// //               className="text-blue-600 hover:text-blue-700 mt-4 inline-block"
// //             >
// //               Be the first to create a poll!
// //             </Link>
// //           )}
// //         </div>
// //       ) : (
// //         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
// //           {polls.map(poll => (
// //             <PollCard key={poll._id} poll={poll} />
// //           ))}
// //         </div>
// //       )}

  
// //       {totalPages > 1 && (
// //         <div className="flex justify-center mt-8">
// //           <div className="flex gap-2">
// //             {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
// //               <button
// //                 key={page}
// //                 onClick={() => setCurrentPage(page)}
// //                 className={`px-3 py-1 rounded ${
// //                   currentPage === page
// //                     ? 'bg-blue-600 text-white'
// //                     : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
// //                 }`}
// //               >
// //                 {page}
// //               </button>
// //             ))}
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default PollList;



// // pages/PollList.jsx
// import { useContext, useEffect, useState } from 'react';
// import { PollContext } from '../context/PollContext';
// import { AppContext } from '../context/AppContext';
// import { Link, useNavigate } from 'react-router-dom';
// import PollCard from '../components/PollCard';
// import { 
//   FaArrowLeft, 
//   FaPlus, 
//   FaUser, 
//   FaClock, 
//   FaChartBar,
//   FaExclamationCircle
// } from 'react-icons/fa';
// import Navbar from './Navbar';

// const PollList = () => {
//   const { polls, isLoading, fetchPolls } = useContext(PollContext);
//   const { islogged } = useContext(AppContext);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   useEffect(() => {
//     loadPolls();
//   }, [currentPage]);

//   const loadPolls = async () => {
//     try {
//       setError('');
//       const data = await fetchPolls(currentPage, 9); // Show 9 polls per page for a perfect grid
//       if (data) {
//         setTotalPages(data.totalPages);
//       }
//     } catch (err) {
//       console.error('Failed to load polls:', err);
//       setError('Failed to load polls. Please try again.');
//     }
//   };


//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     const now = new Date();
//     const diffTime = Math.abs(now - date);
//     const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
//     if (diffDays === 0) {
//       return 'Today';
//     } else if (diffDays === 1) {
//       return 'Yesterday';
//     } else if (diffDays < 7) {
//       return `${diffDays} days ago`;
//     } else {
//       return date.toLocaleDateString('en-US', {
//         month: 'short',
//         day: 'numeric',
//         year: 'numeric'
//       });
//     }
//   };

//   const getInitials = (name) => {
//     if (!name) return '?';
//     return name
//       .split(' ')
//       .map(part => part[0])
//       .join('')
//       .toUpperCase()
//       .slice(0, 2);
//   };

//   if (isLoading && polls.length === 0) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-700 text-lg">Loading polls...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 mt-20">
//       <div className="container mx-auto max-w-6xl">
//         {/* Header Section */}
//        <Navbar />
        

//         {error && (
//           <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 flex items-start">
//             <FaExclamationCircle className="text-red-500 mr-3 mt-1 flex-shrink-0" />
//             <p>{error}</p>
//           </div>
//         )}

//         {polls.length === 0 ? (
//           <div className="bg-white rounded-2xl shadow-md p-8 text-center max-w-2xl mx-auto">
//             <div className="mx-auto w-20 h-20 flex items-center justify-center bg-blue-100 rounded-full mb-6">
//               <FaChartBar className="text-3xl text-blue-600" />
//             </div>
//             <h2 className="text-2xl font-bold text-gray-800 mb-3">No polls yet</h2>
//             <p className="text-gray-600 mb-6">
//               There are no polls available at the moment. Be the first to create one!
//             </p>
//             {islogged ? (
//               <Link
//                 to="/polls/create"
//                 className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
//               >
//                 <FaPlus className="mr-2" />
//                 Create Your First Poll
//               </Link>
//             ) : (
//               <Link
//                 to="/login"
//                 className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
//               >
//                 Login to Create a Poll
//               </Link>
//             )}
//           </div>
//         ) : (
//           <>
//             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//               {polls.map(poll => {
//                 const totalVotes = poll.options.reduce(
//                   (sum, option) => sum + (option.voteCount || 0),
//                   0
//                 );
                
//                 return (
//                   <div key={poll._id} className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1">
//                     {/* Poll Header with Creator Info */}
//                     <div className="p-4 border-b border-gray-100 flex items-center justify-between">
//                       <div className="flex items-center">
//                         {poll.createdBy?.photo ? (
//                           <Link to={`/view-user/${poll.createdBy._id}`}>
//                           <img 
//                             src={poll.createdBy.photo} 
//                             alt={poll.createdBy.name}
//                             className="w-8 h-8 rounded-full object-cover mr-3"
//                           />
//                           </Link>
//                         ) : (
//                           <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium text-xs mr-3">
//                             {getInitials(poll.createdBy?.name)}
//                           </div>
//                         )}
//                         <div>
//                           <p className="text-sm font-medium text-gray-800">
//                             {poll.createdBy?.name || 'Unknown User'}
//                           </p>
//                           <p className="text-xs text-gray-500 flex items-center">
//                             <FaClock className="mr-1" />
//                             {formatDate(poll.createdAt)}
//                           </p>
//                         </div>
//                       </div>
                      
//                       <div className="text-xs text-gray-500 flex items-center">
//                         <FaChartBar className="mr-1" />
//                         {totalVotes} votes
//                       </div>
//                     </div>
                    
//                     {/* Poll Content */}
//                     <div className="p-5">
//                       <h3 className="text-lg font-semibold text-gray-800 mb-3 line-clamp-2">
//                         {poll.question}
//                       </h3>
                      
//                       <div className="flex items-center gap-2 mb-4">
//                         <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
//                           poll.isPublished 
//                             ? "bg-green-100 text-green-800" 
//                             : "bg-yellow-100 text-yellow-800"
//                         }`}>
//                           {poll.isPublished ? "Published" : "Draft"}
//                         </span>
//                         <span className="text-xs text-gray-500">
//                           {poll.options.length} options
//                         </span>
//                       </div>
//                       <div className='flex justify-between items-center'>
//                            <Link
//                         to={`/polls/${poll._id}`}
//                         className="block w-100 p-2  text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
//                       >
//                         View Poll
//                       </Link>

//                                 <Link
//                                   to={`/chart/${poll._id}`}
//                                   className="ml-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
//                                 >
//                                   View Chart
//                                 </Link>

//                       </div>
                     
                      
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>

//             {/* Pagination */}
//             {totalPages > 1 && (
//               <div className="flex justify-center mt-10">
//                 <div className="flex items-center gap-2 bg-white p-2 rounded-xl shadow-md">
//                   <button
//                     onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                     disabled={currentPage === 1}
//                     className="px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     Previous
//                   </button>
                  
//                   {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
//                     let pageNum;
//                     if (totalPages <= 5) {
//                       pageNum = i + 1;
//                     } else if (currentPage <= 3) {
//                       pageNum = i + 1;
//                     } else if (currentPage >= totalPages - 2) {
//                       pageNum = totalPages - 4 + i;
//                     } else {
//                       pageNum = currentPage - 2 + i;
//                     }
                    
//                     return (
//                       <button
//                         key={pageNum}
//                         onClick={() => setCurrentPage(pageNum)}
//                         className={`w-10 h-10 rounded-lg flex items-center justify-center ${
//                           currentPage === pageNum
//                             ? 'bg-blue-600 text-white'
//                             : 'text-gray-700 hover:bg-gray-100'
//                         }`}
//                       >
//                         {pageNum}
//                       </button>
//                     );
//                   })}
                  
//                   {totalPages > 5 && (
//                     <span className="px-2 text-gray-500">...</span>
//                   )}
                  
//                   <button
//                     onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//                     disabled={currentPage === totalPages}
//                     className="px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     Next
//                   </button>
//                 </div>
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PollList;



// pages/PollList.jsx
import { useContext, useEffect, useState } from 'react';
import { PollContext } from '../context/PollContext';
import { AppContext } from '../context/AppContext';
import { Link, useNavigate } from 'react-router-dom';
import PollCard from '../components/PollCard';
import { 
  FaArrowLeft, 
  FaPlus, 
  FaUser, 
  FaClock, 
  FaChartBar,
  FaExclamationCircle
} from 'react-icons/fa';
import Navbar from './Navbar';

const PollList = () => {
  const { polls, isLoading, fetchPolls } = useContext(PollContext);
  const { islogged } = useContext(AppContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadPolls();
  }, [currentPage]);

  const loadPolls = async () => {
    try {
      setError('');
      const data = await fetchPolls(currentPage, 9);
      if (data) {
        setTotalPages(data.totalPages);
      }
    } catch (err) {
      console.error('Failed to load polls:', err);
      setError('Failed to load polls. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Function to handle user profile click
  const handleUserProfileClick = (userId, e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(userId)
    if (userId) {
      navigate(`/view-user/${userId}`);
    }
  };

  if (isLoading && polls.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg">Loading polls...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 mt-20">
      <div className="container mx-auto max-w-6xl">
        <Navbar />
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 flex items-start">
            <FaExclamationCircle className="text-red-500 mr-3 mt-1 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {polls.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-8 text-center max-w-2xl mx-auto">
            <div className="mx-auto w-20 h-20 flex items-center justify-center bg-blue-100 rounded-full mb-6">
              <FaChartBar className="text-3xl text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">No polls yet</h2>
            <p className="text-gray-600 mb-6">
              There are no polls available at the moment. Be the first to create one!
            </p>
            {islogged ? (
              <Link
                to="/polls/create"
                className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <FaPlus className="mr-2" />
                Create Your First Poll
              </Link>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Login to Create a Poll
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {polls.map(poll => {
                const totalVotes = poll.options.reduce(
                  (sum, option) => sum + (option.voteCount || 0),
                  0
                );
                
                return (
                  <div key={poll._id} className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1">
                    {/* Poll Header with Creator Info */}
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                      <div className="flex items-center">
                        {poll.createdBy?.photo ? (
                          <div 
                            onClick={(e) => handleUserProfileClick(poll.createdBy._id, e)}
                            className="cursor-pointer"
                          >
                            <img 
                              src={poll.createdBy.photo} 
                              alt={poll.createdBy.name}
                              className="w-8 h-8 rounded-full object-cover mr-3"
                            />
                          </div>
                        ) : (
                          <div 
                            onClick={(e) => handleUserProfileClick(poll.createdBy?._id, e)}
                            className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium text-xs mr-3 cursor-pointer"
                          >
                            {getInitials(poll.createdBy?.name)}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {poll.createdBy?.name || 'Unknown User'}
                          </p>
                          <p className="text-xs text-gray-500 flex items-center">
                            <FaClock className="mr-1" />
                            {formatDate(poll.createdAt)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-500 flex items-center">
                        <FaChartBar className="mr-1" />
                        {totalVotes} votes
                      </div>
                    </div>
                    
                    {/* Poll Content */}
                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3 line-clamp-2">
                        {poll.question}
                      </h3>
                      
                      <div className="flex items-center gap-2 mb-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          poll.isPublished 
                            ? "bg-green-100 text-green-800" 
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {poll.isPublished ? "Published" : "Draft"}
                        </span>
                        <span className="text-xs text-gray-500">
                          {poll.options.length} options
                        </span>
                      </div>
                      <div className='flex justify-between items-center'>
                        <Link
                          to={`/polls/${poll._id}`}
                          className="block w-100 p-2 text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                          View Poll
                        </Link>

                        <Link
                          to={`/chart/${poll._id}`}
                          className="ml-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
                        >
                          View Chart
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-10">
                <div className="flex items-center gap-2 bg-white p-2 rounded-xl shadow-md">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  {totalPages > 5 && (
                    <span className="px-2 text-gray-500">...</span>
                  )}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PollList;