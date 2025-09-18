// context/PublicPollContext.jsx
import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const PublicPollContext = createContext();



export const PublicPollProvider = ({ children }) => {
  const [polls, setPolls] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3800';
  const fetchPublicPolls = async (page = 1, limit = 10) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${backendUrl}/api/poll/public`, {
        params: { page, limit }
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




  return (

    <PublicPollContext.Provider value={{
        

     
    polls,
    isLoading,
    fetchPublicPolls
      }}>
        {children}
      </PublicPollContext.Provider>
  )
};
export { PublicPollContext};