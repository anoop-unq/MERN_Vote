// components/DumpyPolls.jsx
import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Link, useNavigate } from 'react-router-dom';
import { PublicPollContext } from '../context/PublicPollContext';

export const DumpyPolls = () => {
  const { polls, isLoading, fetchPublicPolls } = useContext(PublicPollContext);
  const { islogged } = useContext(AppContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    loadPolls();
  }, [currentPage]);

  const loadPolls = async () => {
    const data = await fetchPublicPolls(currentPage, 10);
    if (data) {
      setTotalPages(data.totalPages);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">Loading polls...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-12">
      {/* Fixed Back Button */}
      <button
  onClick={handleBack}
  className="fixed top-0 left-0 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 z-50 flex items-center"
>
  <svg
    className="w-7 h-7 mr-2 transform hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:rounded-full bg-none hover:bg-white text-gray-300 hover:text-blue-600 p-0"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
  <span className="font-semibold"></span>
</button>

      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center mt-4">Public Polls</h1>

      {polls.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-block p-4 bg-blue-50 rounded-full mb-4">
            <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <p className="text-gray-500 text-lg">No public polls available yet.</p>
          <p className="text-gray-400 mt-2">Be the first to create a poll!</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {polls.map(poll => (
            <div key={poll._id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-1">
              <div className="flex items-center mb-4">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                <h3 className="text-xl font-semibold text-gray-800   transition-all duration-300">
                  {poll.question}
                </h3>
              </div>
              
              {poll.options.map(option => (
                <div key={option._id} className="mb-3 p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors duration-200">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium  transition-all duration-300">
                      {option.text}
                    </span>
                    <span className="text-sm bg-blue-100 text-blue-800 py-1 px-2 rounded-full">
                      {option.voteCount} votes
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${poll.totalVotes > 0 ? (option.voteCount / poll.totalVotes) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              ))}
              
              <div className="mt-4 text-sm text-gray-500 flex justify-between items-center">
                <span>Total Votes: {poll.totalVotes}</span>
                {/* <span className="text-xs text-gray-400">ID: {poll._id.substring(0, 6)}...</span> */}
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-100">
                {islogged ? (
                  <Link
                    to={`/polls/${poll._id}`}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-5 py-2.5 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 inline-flex items-center shadow-md hover:shadow-lg"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View Poll
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-5 py-2.5 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 inline-flex items-center shadow-md hover:shadow-lg"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Login to Vote
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-12">
          <div className="flex gap-2 bg-white p-3 rounded-xl shadow-md">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Prev
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (currentPage <= 3) {
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
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === pageNum
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } transition-all`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              Next
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};