
import axios from "axios";
import { createContext, use, useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  axios.defaults.withCredentials = true;
  const [islogged, setIsLogged] = useState(false);
  const [userdata, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
   const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;



  const getUserData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/user/data`, {
        withCredentials: true,
      });

      if (response.data.success) {
        setUserData(response.data.userData);
      } else {
        toast.error(response.data.message || "Failed to fetch user data");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || error.message || "Something went wrong"
      );
    }
  };


  const getUserById = async (userId) => {
  try {
    console.log(userId,"7285")
    const response = await axios.get(`${backendUrl}/api/user-details/${userId}`, {
      withCredentials: true,
    });

    if (response.data.success) {
      return response.data.userData;
    } else {
      toast.error(response.data.message || "Failed to fetch user data");
      return null;
    }
  } catch (error) {
    toast.error(
      error?.response?.data?.message || error.message || "Something went wrong"
    );
    return null;
  }
};


  // // Check auth state
  const getAuthState = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/user-auth`, {
        withCredentials: true
      });

      if (response.data.success) {
        setIsLogged(true);
        await getUserData();
      } else {
        setIsLogged(false);
      }
    } catch (error) {
      setIsLogged(false);
      console.warn("Not logged in:", error?.response?.data?.message);
    }
  };

const createPostImage = useCallback(async (formData) => {
  try {
    const response = await axios.post(
      `${backendUrl}/api/posts/image`,
      formData,
      { 
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    
    console.log('Post creation response:', response.data); // Debug
    
    if (response.data.success && response.data.post) {
      // Transform the post data to match your frontend expectations
      const newPost = {
        ...response.data.post,
        // Add any additional frontend-only fields if needed
      };
      
      setPosts(prevPosts => [newPost, ...prevPosts]);
      return true;
    }
    throw new Error(response.data.message || 'Invalid response format');
    
  } catch (error) {
    console.error('Create post error:', error);
    toast.error(
      error.response?.data?.error || 
      error.response?.data?.message || 
      error.message || 
      'Failed to create post'
    );
    return false;
  }
}, [backendUrl]);




const deletePostImage = useCallback(async (postId) => {
  try {
    const response = await axios.delete(
      `${backendUrl}/api/posts/${postId}/delete-image`,
      {},
      { withCredentials: true }
    );

    if (response.data.success) {
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post._id === postId ? response.data.post : post
        )
      );
      toast.success("Image removed successfully");
      return true;
    }

    throw new Error(response.data.message || 'Failed to remove image');
  } catch (error) {
    // Only show error if it's not a 404/400 about missing image
    if (!error.response || 
        (error.response.status !== 400 && error.response.status !== 404)) {
      toast.error(
        error.response?.data?.message || 
        error.message || 
        'Failed to remove image'
      );
    }
    return false;
  }
}, [backendUrl]);


// Update this function in your AppContext
const updateUserProfile = async (userId, profileData) => {
  try {
    const response = await axios.put(
      `${backendUrl}/api/users/edit/${userId}`, 
      profileData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }
    );
    
    if (response.data.success) {
      setUserData(prev => ({
        ...prev,
        user: {
          ...prev.user,
          ...response.data.user
        }
      }));
      toast.success('Profile updated successfully');
      return true;
    }
    return false;
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to update profile');
    return false;
  }
};












const updateUserPhoto = async (userId, photoFile) => {
  try {
    const formData = new FormData();
    formData.append('photo', photoFile);

    const response = await axios.put(
      `${backendUrl}/api/users/edit/${userId}/photo`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      }
    );

    if (response.data.success) {
      setUserData(prev => ({
        ...prev,
        user: {
          ...prev.user,
          photo: response.data.photoUrl
        }
      }));
      toast.success('Profile photo updated successfully');
      return true;
    }
    return false;
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to update profile photo');
    return false;
  }
};







  // Initial data loading
  useEffect(() => {
    getAuthState();
  }, []);

  const value = {
    backendUrl,
    getUserData,
    islogged,
    setIsLogged,
    userdata,
    deletePostImage,
    createPostImage,
    setUserData,
    updateUserProfile,
    updateUserPhoto,
  getUserById,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};


