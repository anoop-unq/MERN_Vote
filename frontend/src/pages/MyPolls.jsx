// pages/MyPolls.jsx
import { useContext, useEffect, useState } from "react";
import { PollContext } from "../context/PollContext";
import { AppContext } from "../context/AppContext";
import { Link, useNavigate } from "react-router-dom";
import { FaTrash, FaPlus, FaSync, FaArrowLeft, FaEye, FaChartBar } from "react-icons/fa";
import { BiSolidBarChartSquare } from "react-icons/bi";
import Navbar from "./Navbar";

const MyPolls = () => {
  const { myPolls, fetchMyPolls, deletePoll, isLoading } =
    useContext(PollContext);
  const { islogged } = useContext(AppContext);
  const [deletingIds, setDeletingIds] = useState(new Set());
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pollToDelete, setPollToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (islogged) {
      fetchMyPolls();

      // Set up polling for real-time updates (every 10 seconds)
      const intervalId = setInterval(fetchMyPolls, 10000);

      return () => clearInterval(intervalId);
    }
  }, [islogged]);

  const handleDeleteClick = (poll) => {
    setPollToDelete(poll);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (pollToDelete) {
      try {
        setDeletingIds((prev) => new Set(prev).add(pollToDelete._id));
        await deletePoll(pollToDelete._id);
        // Refresh the list after deletion
        await fetchMyPolls();
      } catch (error) {
        // Error handling is done in the context
      } finally {
        setDeletingIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(pollToDelete._id);
          return newSet;
        });
        setShowDeleteModal(false);
        setPollToDelete(null);
      }
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setPollToDelete(null);
  };

  if (!islogged) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="mx-auto w-16 h-16 flex items-center justify-center bg-blue-100 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please login to view your polls</p>
          <button 
            onClick={() => navigate('/login')}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (isLoading && myPolls.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700">Loading your polls...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header Section */}
          <Navbar  />

        {/* Polls Grid */}
        {myPolls.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-8 text-center max-w-2xl mx-auto ">
            <div className="mx-auto w-20 h-20 flex items-center justify-center bg-blue-100 rounded-full mb-6">
              <BiSolidBarChartSquare className="text-3xl text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">No polls yet</h2>
            <p className="text-gray-600 mb-6">
              You haven't created any polls yet. Start by creating your first poll to gather opinions and insights.
            </p>
            <Link
              to="/polls/create"
              className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <FaPlus className="mr-2" />
              Create your first poll
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-10">
            {myPolls.map((poll) => {
              const totalVotes = poll.options.reduce(
                (sum, option) => sum + (option.voteCount || 0),
                0
              );
              const isDeleting = deletingIds.has(poll._id);

              return (
                <div
                  key={poll._id}
                  className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1 relative"
                >
                  {isDeleting && (
                    <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center rounded-xl z-10">
                      <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                        <span className="text-gray-700">Deleting...</span>
                      </div>
                    </div>
                  )}

                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-3 line-clamp-2">
                      {poll.question}
                    </h3>

                    <div className="flex items-center gap-2 mb-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        poll.isPublished 
                          ? "bg-green-100 text-green-800" 
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {poll.isPublished ? "Published" : "Draft"}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(poll.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex justify-between items-center mb-5 text-sm text-gray-600">
                      <span className="flex items-center">
                        <FaChartBar className="mr-1" />
                        {totalVotes} votes
                      </span>
                      <span>{poll.options.length} options</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Link
                        to={`/poll/${poll._id}/voters`}
                        className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <FaEye className="mr-2" />
                        View   
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(poll)}
                        disabled={isDeleting}
                        className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50"
                      >
                        <FaTrash className="mr-2" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 mx-4">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Delete Poll</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the poll "{pollToDelete?.question}"? This action cannot be undone.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleDeleteCancel}
                className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center"
              >
                <FaTrash className="mr-2" />
                Delete Poll
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPolls;