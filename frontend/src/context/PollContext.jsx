// // context/PollContext.jsx
// import { createContext, useState, useContext } from 'react';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import { AppContext } from './AppContext';

// const PollContext = createContext();

// const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3800';

// export const PollProvider = ({ children }) => {
//   const [polls, setPolls] = useState([]);
//   const [myPolls, setMyPolls] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const { islogged } = useContext(AppContext);

//   // Fetch all polls (public)
//   const fetchPolls = async (page = 1, limit = 10) => {
//     try {
//       setIsLoading(true);
//       const response = await axios.get(`${backendUrl}/api/poll/polls`, {
//         params: { page, limit }
//       });

//       if (response.data.success) {
//         setPolls(response.data.polls);
//         return {
//           polls: response.data.polls,
//           currentPage: response.data.currentPage,
//           totalPages: response.data.totalPages,
//           totalPolls: response.data.totalPolls
//         };
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Failed to fetch polls');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Fetch user's polls (protected)
//   const fetchMyPolls = async () => {
//     if (!islogged) return;
    
//     try {
//       setIsLoading(true);
//       const response = await axios.get(`${backendUrl}/api/poll/user/polls`, {
//         withCredentials: true
//       });

//       if (response.data.success) {
//         setMyPolls(response.data.polls);
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Failed to fetch your polls');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Create a new poll
//   const createPoll = async (pollData) => {
//     try {
//       setIsLoading(true);
//       const response = await axios.post(`${backendUrl}/api/poll/polls`, pollData, {
//         withCredentials: true
//       });

//       if (response.data.success) {
//         toast.success('Poll created successfully!');
//         return response.data.poll;
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Failed to create poll');
//       throw error;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Vote on a poll
//   const voteOnPoll = async (pollId, optionId) => {
//     try {
//       const response = await axios.post(`${backendUrl}/api/poll/vote`, {
//         pollId,
//         optionId
//       }, {
//         withCredentials: true
//       });

//       if (response.data.success) {
//         toast.success('Vote recorded!');
//         return response.data.poll;
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Failed to vote');
//       throw error;
//     }
//   };

//   // Get a single poll
//   const fetchPollById = async (pollId) => {
//     try {
//       setIsLoading(true);
//       const response = await axios.get(`${backendUrl}/api/poll/polls/${pollId}`);

//       if (response.data.success) {
//         return response.data.poll;
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Failed to fetch poll');
//       throw error;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Delete a poll
//   const deletePoll = async (pollId) => {
//     try {
//       const response = await axios.delete(`${backendUrl}/api/poll/polls/${pollId}`, {
//         withCredentials: true
//       });

//       if (response.data.success) {
//         toast.success('Poll deleted successfully!');
//         return true;
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Failed to delete poll');
//       throw error;
//     }
//   };

//   return (
//     <PollContext.Provider value={{
//       polls,
//       myPolls,
//       isLoading,
//       fetchPolls,
//       fetchMyPolls,
//       createPoll,
//       voteOnPoll,
//       fetchPollById,
//       deletePoll
//     }}>
//       {children}
//     </PollContext.Provider>
//   );
// };

// export { PollContext };
// context/PollContext.jsx
import { createContext, useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from './AppContext';

const PollContext = createContext();

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3800';

export const PollProvider = ({ children }) => {
  const [polls, setPolls] = useState([]);
  const [myPolls, setMyPolls] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { islogged } = useContext(AppContext);

  // Fetch all polls (public)
  // const fetchPolls = async (page = 1, limit = 10) => {
  //   try {
  //     setIsLoading(true);
  //     const response = await axios.get(`${backendUrl}/api/poll/polls`, {
  //       params: { page, limit }
  //     });

  //     if (response.data.success) {
  //       setPolls(response.data.polls);
  //       return {
  //         polls: response.data.polls,
  //         currentPage: response.data.currentPage,
  //         totalPages: response.data.totalPages,
  //         totalPolls: response.data.totalPolls
  //       };
  //     }
  //   } catch (error) {
  //     toast.error(error.response?.data?.message || 'Failed to fetch polls');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const fetchPolls = async (page = 1, limit = 10) => {
  try {
    setIsLoading(true);
    const response = await axios.get(`${backendUrl}/api/poll/polls`, {
      params: { page, limit },
      withCredentials: true // ADD THIS LINE
    });

    if (response.data.success) {
      setPolls(response.data.polls);
      return {
        polls: response.data.polls,
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        totalPolls: response.data.totalPolls
      };
    }
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to fetch polls');
  } finally {
    setIsLoading(false);
  }
};


  // In your PollContext
const fetchVotersForPoll = async (pollId) => {
  try {
    const response = await axios.get(`${backendUrl}/api/poll/polls/${pollId}/voters`);
    return response.data.voters;
  } catch (error) {
    console.error('Failed to fetch voters:', error);
    return [];
  }
};


const editPoll = async (pollId, updatedData) => {
  try {
    console.log("Sending update data to backend:", updatedData);
    
    const response = await axios.put(`${backendUrl}/api/poll/${pollId}`, updatedData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      }
    });

    console.log('Backend response:', response.data);

    if (response.data.success) {
      // Update state
      setPolls(prevPolls => 
        prevPolls.map(poll => 
          poll._id === pollId ? response.data.poll : poll
        )
      );
      
      setPolls(prevPolls => 
        prevPolls.map(poll => 
          poll._id === pollId ? response.data.poll : poll
        )
      );

      return response.data.poll;
    } else {
      throw new Error(response.data.message || 'Failed to update poll');
    }
  } catch (error) {
    console.error('Error updating poll:', error);
    
    // More detailed error logging
    if (error.response) {
      console.error('Server responded with:', error.response.status);
      console.error('Error data:', error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    
    throw error;
  }
};

  // Fetch user's polls (protected)
  // const fetchMyPolls = async () => {
  //   if (!islogged) return;
    
  //   try {
  //     setIsLoading(true);
  //     const response = await axios.get(`${backendUrl}/api/poll/user/polls`, {
  //       withCredentials: true
  //     });

  //     if (response.data.success) {
  //       setMyPolls(response.data.polls);
  //     }
  //   } catch (error) {
  //     toast.error(error.response?.data?.message || 'Failed to fetch your polls');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const fetchMyPolls = async () => {
  if (!islogged) return;
  
  try {
    setIsLoading(true);
    const response = await axios.get(`${backendUrl}/api/poll/user/polls`, {
      withCredentials: true
    });

    console.log('API Response:', response.data); // Add this to check the data
    
    if (response.data.success) {
      setMyPolls(response.data.polls);
      console.log('Polls with vote counts:', response.data.polls); // Verify vote counts
    }
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to fetch your polls');
  } finally {
    setIsLoading(false);
  }
};

  // Create a new poll
  const createPoll = async (pollData) => {
    try {
      setIsLoading(true);
      const response = await axios.post(`${backendUrl}/api/poll/polls`, pollData, {
        withCredentials: true
      });

      if (response.data.success) {
        toast.success('Poll created successfully!');
        return response.data.poll;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create poll');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Vote on a poll - FIXED THE ENDPOINT
  const voteOnPoll = async (pollId, optionId) => {
    try {
      const response = await axios.post(`${backendUrl}/api/poll/polls/vote`, {
        pollId,
        optionId
      }, {
        withCredentials: true
      });

      if (response.data.success) {
        toast.success('Vote recorded!');
        return response.data.poll;
      }
    } catch (error) {
      // Handle specific error for already voted
      if (error.response?.status === 400 && error.response?.data?.message === "You have already voted on this poll") {
        toast.error("You have already voted on this poll");
      } else {
        toast.error(error.response?.data?.message || 'Failed to vote');
      }
      throw error;
    }
  };

  // Get a single poll

  // const fetchPollById = async (pollId) => {
  //   try {
  //     setIsLoading(true);
  //     const response = await axios.get(`${backendUrl}/api/poll/polls/${pollId}`);

  //     if (response.data.success) {
  //       return response.data.poll;
  //     }
  //   } catch (error) {
  //     toast.error(error.response?.data?.message || 'Failed to fetch poll');
  //     throw error;
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };


//   const fetchPollById = async (pollId) => {
//   try {
//     setIsLoading(true);
//     const response = await axios.get(`${backendUrl}/api/poll/polls/${pollId}`);

//     if (response.data.success) {
//       // Convert Mongoose document to plain object
//       const poll = JSON.parse(JSON.stringify(response.data.poll));
//       return poll;
//     }
//   } catch (error) {
//     toast.error(error.response?.data?.message || 'Failed to fetch poll');
//     throw error;
//   } finally {
//     setIsLoading(false);
//   }
// };


const fetchPollById = async (pollId) => {
  try {
    setIsLoading(true);
    const response = await axios.get(`${backendUrl}/api/poll/polls/${pollId}`, {
      withCredentials: true // ADD THIS LINE
    });

    if (response.data.success) {
      return response.data.poll;
    }
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to fetch poll');
    throw error;
  } finally {
    setIsLoading(false);
  }
};


  // Delete a poll
  const deletePoll = async (pollId) => {
    try {
      const response = await axios.delete(`${backendUrl}/api/poll/polls/${pollId}`, {
        withCredentials: true
      });

      if (response.data.success) {
        toast.success('Poll deleted successfully!');
        return true;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete poll');
      throw error;
    }
  };

  return (
    <PollContext.Provider value={{
      polls,
      myPolls,
      isLoading,
      fetchPolls,
      fetchMyPolls,
      editPoll,
      createPoll,
      voteOnPoll,
      fetchPollById,
      deletePoll,
      fetchVotersForPoll
    }}>
      {children}
    </PollContext.Provider>
  );
};

export { PollContext };