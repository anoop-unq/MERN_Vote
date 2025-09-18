import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import { FaArrowLeft, FaEdit } from "react-icons/fa";
import { FiUser, FiMapPin, FiFileText } from "react-icons/fi";
import { motion } from "framer-motion";

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userdata, getUserById } = useContext(AppContext);
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("about");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // First check if it's the current user
        if (userdata?.user?._id === id) {
          setProfileUser(userdata.user);
          setLoading(false);
          return;
        }
        
        // Otherwise fetch user by ID
        const userData = await getUserById(id);
        if (userData) {
          setProfileUser(userData);
        } else {
          setError("User not found");
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("Failed to load user profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id, getUserById, userdata]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const calculateAge = (dobString) => {
    const dob = new Date(dobString);
    const diff = Date.now() - dob.getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-gray-600 font-medium">Loading profile...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !profileUser) {
    return (
      <div className="max-w-md mx-auto min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-blue-50 to-purple-50">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-2xl shadow-xl p-8 w-full"
        >
          <div className="text-center">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mx-auto w-20 h-20 flex items-center justify-center bg-red-100 rounded-full mb-4"
            >
              <FiUser className="text-3xl text-red-500" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">User not found</h2>
            <p className="text-gray-600 mb-6">
              {error || "The user you're looking for doesn't exist."}
            </p>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(59, 130, 246, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/home")}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-3 px-8 rounded-full transition-all duration-300 shadow-md"
            >
              Go Home
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  const isCurrentUser = userdata?.user?._id === profileUser._id;
  const memberSince = profileUser.createdAt ? new Date(profileUser.createdAt).getFullYear() : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 pb-12">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b shadow-sm py-4 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto flex items-center">
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "#f3f4f6" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/home")}
            className="flex items-center justify-center bg-white text-gray-700 rounded-full p-3 w-12 h-12 hover:bg-gray-100 transition-all duration-200 ease-in-out shadow-sm border border-gray-200 flex-shrink-0"
            aria-label="Go back"
          >
            <FaArrowLeft className="text-xl" />
          </motion.button>
          <h1 className="text-xl md:text-2xl font-bold ml-4 truncate max-w-[calc(100%-5rem)] text-gray-800">
            {profileUser.name}'s Profile
          </h1>
        </div>
      </motion.header>

      {/* Profile Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8"
        >
          {/* Profile Header with Cover Photo */}
          <div className="h-40 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 md:h-48 relative">
            <div className="absolute inset-0 bg-black/10"></div>
          </div>
          
          <div className="px-6 pb-6 relative">
            {/* Profile Picture and Basic Info */}
            <div className="flex flex-col sm:flex-row items-start gap-6 -mt-20 sm:-mt-16">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative flex-shrink-0"
              >
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-white shadow-2xl bg-white">
                  <img
                    src={profileUser.photo || assets.user_image || "/default-avatar.png"}
                    alt={profileUser.name}
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => window.open(profileUser.photo || assets.user_image, '_blank')}
                  />
                </div>
              </motion.div>
              
              <div className="flex-1 min-w-0 mt-4 sm:mt-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 truncate flex items-center">
                      {profileUser.name}
                      {profileUser.isAccountActive ? (
                        <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Active</span>
                      ) : (
                        <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">Inactive</span>
                      )}
                    </h1>
                    
                    {memberSince && (
                      <p className="text-gray-500 mt-1 flex items-center md:mt-7 sm:mt-8">
                        <FiMapPin className="mr-1" />
                        Member since {memberSince}
                      </p>
                    )}
                  </div>
                  
                  {isCurrentUser && (
                    <motion.button
                      whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(59, 130, 246, 0.4)" }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate(`/edit-profile/${id}`)}
                      className="mt-4 sm:mt-0 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-2.5 px-5 rounded-full transition-all duration-300 flex items-center shadow-md"
                    >
                      <FaEdit className="mr-2" />
                      Edit Profile
                    </motion.button>
                  )}
                </div>
                
                {/* Bio */}
                {profileUser.bio && profileUser.bio !== "gshgd" && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h3 className="text-sm font-semibold text-blue-800 mb-1">Bio</h3>
                    <p className="text-gray-700 whitespace-pre-line break-words">
                      {profileUser.bio}
                    </p>
                  </div>
                )}
                
                {/* User Details */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {profileUser.dateOfBirth && (
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <div className="flex items-center text-gray-600 mb-1">
                        <span className="text-sm font-medium">Age</span>
                      </div>
                      <p className="text-lg font-semibold text-gray-800">{calculateAge(profileUser.dateOfBirth)} years</p>
                    </div>
                  )}
                  
                  {profileUser.gender && (
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <div className="flex items-center text-gray-600 mb-1">
                        <span className="text-sm font-medium">Gender</span>
                      </div>
                      <p className="text-lg font-semibold text-gray-800">{profileUser.gender}</p>
                    </div>
                  )}
                  
                  {profileUser.email && (
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <div className="flex items-center text-gray-600 mb-1">
                        <span className="text-sm font-medium">Email</span>
                      </div>
                      <p className="text-lg font-semibold text-gray-800 truncate">{profileUser.email}</p>
                    </div>
                  )}
                  
                  {profileUser.mobile && (
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <div className="flex items-center text-gray-600 mb-1">
                        <span className="text-sm font-medium">Phone</span>
                      </div>
                      <p className="text-lg font-semibold text-gray-800">{profileUser.mobile}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs and Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("about")}
                className={`py-4 px-6 text-center font-medium text-sm flex-1 flex items-center justify-center ${activeTab === "about" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
              >
                About
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "about" && (
              <div className="p-4 md:p-6">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6 flex items-center gap-2">
                  <FiUser className="text-purple-600 text-lg md:text-xl" />
                  About
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {/* Personal Information Card */}
                  <div className="bg-gradient-to-br from-white to-gray-50 p-4 md:p-6 rounded-xl md:rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4 border-b pb-2 md:pb-3 flex items-center gap-2">
                      Personal Information
                    </h3>
                    <div className="space-y-3 md:space-y-4">
                      <div className="flex justify-between items-center p-2 md:p-3 rounded-lg bg-blue-50">
                        <span className="text-gray-600 text-sm md:text-base">
                          Full Name
                        </span>
                        <span className="font-medium text-gray-800 text-sm md:text-base">{profileUser.name}</span>
                      </div>
                      {profileUser.username && (
                        <div className="flex justify-between items-center p-2 md:p-3 rounded-lg bg-green-50">
                          <span className="text-gray-600 text-sm md:text-base">
                            Username
                          </span>
                          <span className="font-medium text-gray-800 text-sm md:text-base">@{profileUser.username}</span>
                        </div>
                      )}
                      {profileUser.dateOfBirth && (
                        <div className="flex justify-between items-center p-2 md:p-3 rounded-lg bg-purple-50">
                          <span className="text-gray-600 text-sm md:text-base">
                            Date of Birth
                          </span>
                          <span className="font-medium text-gray-800 text-sm md:text-base">{formatDate(profileUser.dateOfBirth)}</span>
                        </div>
                      )}
                      {profileUser.gender && (
                        <div className="flex justify-between items-center p-2 md:p-3 rounded-lg bg-pink-50">
                          <span className="text-gray-600 text-sm md:text-base">
                            Gender
                          </span>
                          <span className="font-medium text-gray-800 text-sm md:text-base">{profileUser.gender}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Contact Information Card */}
                  <div className="bg-gradient-to-br from-white to-gray-50 p-4 md:p-6 rounded-xl md:rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4 border-b pb-2 md:pb-3 flex items-center gap-2">
                      Contact Information
                    </h3>
                    <div className="space-y-3 md:space-y-4">
                      {profileUser.email && (
                        <div className="flex justify-between items-center p-2 md:p-3 rounded-lg bg-green-50">
                          <span className="text-gray-600 text-sm md:text-base">
                            Email
                          </span>
                          <span className="font-medium text-gray-800 text-sm md:text-base break-all">
                            {profileUser.email}
                          </span>
                        </div>
                      )}

                      {profileUser.mobile && (
                        <div className="flex justify-between items-center p-2 md:p-3 rounded-lg bg-blue-50">
                          <span className="text-gray-600 text-sm md:text-base">
                            Phone
                          </span>
                          <span className="font-medium text-gray-800 text-sm md:text-base">{profileUser.mobile}</span>
                        </div>
                      )}
                      {profileUser.address && (
                        <>
                          {profileUser.address.street && (
                            <div className="flex justify-between items-center p-2 md:p-3 rounded-lg bg-gray-50">
                              <span className="text-gray-600 text-sm md:text-base">
                                Street
                              </span>
                              <span className="font-medium text-gray-800 text-sm md:text-base text-right">{profileUser.address.street}</span>
                            </div>
                          )}
                          {profileUser.address.city && (
                            <div className="flex justify-between items-center p-2 md:p-3 rounded-lg bg-gray-50">
                              <span className="text-gray-600 text-sm md:text-base">
                                City
                              </span>
                              <span className="font-medium text-gray-800 text-sm md:text-base">{profileUser.address.city}</span>
                            </div>
                          )}
                          {profileUser.address.state && (
                            <div className="flex justify-between items-center p-2 md:p-3 rounded-lg bg-gray-50">
                              <span className="text-gray-600 text-sm md:text-base">
                                State
                              </span>
                              <span className="font-medium text-gray-800 text-sm md:text-base">{profileUser.address.state}</span>
                            </div>
                          )}
                          {profileUser.address.country && (
                            <div className="flex justify-between items-center p-2 md:p-3 rounded-lg bg-gray-50">
                              <span className="text-gray-600 text-sm md:text-base">
                                Country
                              </span>
                              <span className="font-medium text-gray-800 text-sm md:text-base">{profileUser.address.country}</span>
                            </div>
                          )}
                          {profileUser.address.zipCode && (
                            <div className="flex justify-between items-center p-2 md:p-3 rounded-lg bg-gray-50">
                              <span className="text-gray-600 text-sm md:text-base">
                                Zip Code
                              </span>
                              <span className="font-medium text-gray-800 text-sm md:text-base">{profileUser.address.zipCode}</span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Bio Card */}
                  {profileUser.bio && profileUser.bio !== "gshgd" && (
                    <div className="bg-gradient-to-br from-white to-gray-50 p-4 md:p-6 rounded-xl md:rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 md:col-span-2">
                      <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4 border-b pb-2 md:pb-3">
                        Bio
                      </h3>
                      <div className="p-3 md:p-4 bg-indigo-50 rounded-lg md:rounded-xl">
                        <p className="text-gray-700 whitespace-pre-line break-words leading-relaxed text-sm md:text-base md:text-lg">
                          {profileUser.bio}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UserProfile;