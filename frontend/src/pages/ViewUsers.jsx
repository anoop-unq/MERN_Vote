import { useParams, useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  FaArrowLeft, FaInfoCircle, FaPhone, FaBirthdayCake, 
  FaVenusMars, FaMapMarkerAlt, FaGraduationCap, FaGlobe, FaLink,
  FaHome, FaCity, FaMapPin, FaFlag, FaChevronDown, FaChevronUp,
  FaUser
} from 'react-icons/fa';
import Navbar from './Navbar';
import { PollContext } from '../context/PollContext';

const ViewUsers = () => {
  const { userId } = useParams();
  console.log(userId)
  const navigate = useNavigate();
  const { getUserById } = useContext(AppContext);
  const {polls} = useContext(PollContext)
  const [showDetails, setShowDetails] = useState(false);
  const [showAddress, setShowAddress] = useState(false);
  const [showEducation, setShowEducation] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user information when component mounts
  useEffect(() => {
    if (userId) {
      fetchUserDetails();
    } else {
      setIsLoading(false);
    }
  }, [userId]);
  console.log(polls,"Polls")
  const fetchUserDetails = async () => {
    setIsLoading(true);
    setIsLoadingDetails(true);
    try {
      const details = await getUserById(userId);
      console.log("User details:", details);
      setUserDetails(details);
    } catch (error) {
      console.error("Failed to fetch user details:", error);
    } finally {
      setIsLoading(false);
      setIsLoadingDetails(false);
    }
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
    // Also hide address and education when hiding details
    if (showDetails) {
      setShowAddress(false);
      setShowEducation(false);
    }
  };

  const toggleAddress = () => {
    setShowAddress(!showAddress);
  };

  const toggleEducation = () => {
    setShowEducation(!showEducation);
  };

  // Format date of birth for display
  const formatDateOfBirth = (dateString) => {
    if (!dateString) return 'Not provided';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Calculate age from date of birth
  const calculateAge = (dateString) => {
    if (!dateString) return null;
    
    try {
      const today = new Date();
      const birthDate = new Date(dateString);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      return age;
    } catch (error) {
      return null;
    }
  };

  // Check if address has any data
  const hasAddressData = (address) => {
    return address && (
      address.street || 
      address.city || 
      address.state || 
      address.country || 
      address.zipCode
    );
  };

  // Check if education has any data
  const hasEducationData = (education) => {
    return education && education.length > 0 && education.some(edu => 
      edu.institution || edu.degree || edu.fieldOfStudy || edu.startYear
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading user profile...</p>
        </div>
      </div>
    );
  }

  if (!userDetails) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
            <FaInfoCircle className="text-3xl text-gray-400" />
          </div>
          <p className="text-gray-600 text-lg">User not found</p>
          <button
            onClick={() => navigate("/home")}
            className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-300"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        {/* Back Button */}
        <div className="mb-6">
          <Navbar />
        </div>

        {/* Profile Header Card */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-xl overflow-hidden mb-8 mt-12">
          <div className="p-6 md:p-8 text-white">
            <div className="flex flex-col items-center text-center">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-white bg-opacity-20 flex items-center justify-center mb-6 border-4 border-white border-opacity-30">
                {userDetails.photo ? (
                  <img 
                    src={userDetails.photo} 
                    alt={userDetails.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="text-5xl md:text-6xl font-bold text-white opacity-80">
                    {userDetails?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
              </div>

              <div className="text-center">
                <h1 className="text-2xl md:text-3xl font-bold mb-2">{userDetails?.name || 'Unknown User'}</h1>
                
                {userDetails?.bio && (
                  <p className="text-blue-100 mb-4 max-w-md mx-auto">
                    {userDetails.bio}
                  </p>
                )}

                <button
                  onClick={toggleDetails}
                  className="flex items-center justify-center px-4 py-2 bg-white bg-opacity-20 text-white rounded-full hover:bg-opacity-30 transition-colors duration-300 backdrop-blur-sm mx-auto"
                  disabled={isLoadingDetails}
                >
                  <FaInfoCircle className="mr-2" />
                  {isLoadingDetails ? 'Loading...' : (showDetails ? 'Hide Details' : 'Show Details')}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* User Details Section */}
        {showDetails && (
          <div className="bg-white rounded-2xl shadow-md p-6 mb-8 animate-fadeIn">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center border-b pb-3">
              <FaInfoCircle className="mr-2 text-blue-500" />
              User Information
            </h3>
            
            {isLoadingDetails ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-gray-600">Loading user details...</span>
              </div>
            ) : userDetails ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Mobile Number */}
                <div className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <FaPhone className="text-blue-600 text-lg" />
                  </div>
                  <div className="relative group">
                    <p className="text-sm text-gray-500">Mobile</p>
                    <p className="font-medium text-gray-800">
                      {userDetails.mobile || 'Not provided'}
                    </p>
                    
                    {userDetails.mobile && (
                      <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button 
                          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg shadow-md hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                          onClick={() => window.location.href = `tel:${userDetails.mobile}`}
                        >
                          Call Now
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Gender */}
                <div className="flex items-center p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl border border-pink-100">
                  <div className="bg-pink-100 p-3 rounded-full mr-4">
                    <FaVenusMars className="text-pink-600 text-lg" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Gender</p>
                    <p className="font-medium text-gray-800">
                      {userDetails.gender || 'Not specified'}
                    </p>
                  </div>
                </div>

                {/* Date of Birth */}
                <div className="flex items-center p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl border border-purple-100">
                  <div className="bg-purple-100 p-3 rounded-full mr-4">
                    <FaBirthdayCake className="text-purple-600 text-lg" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date of Birth</p>
                    <p className="font-medium text-gray-800">
                      {formatDateOfBirth(userDetails.dateOfBirth)}
                      {userDetails.dateOfBirth && (
                        <span className="text-sm text-gray-500 ml-2">
                          ({calculateAge(userDetails.dateOfBirth)} years old)
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Account Status */}
                <div className="flex items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                  <div className="bg-green-100 p-3 rounded-full mr-4">
                    <div className={`w-3 h-3 rounded-full ${
                      userDetails.isAccountActive ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Account Status</p>
                    <p className="font-medium text-gray-800">
                      {userDetails.isAccountActive ? 'Active' : 'Deactivated'}
                      {!userDetails.isAccountVerified && userDetails.isAccountActive && ' (Pending Verification)'}
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl border border-cyan-100 md:col-span-2">
                  <div className="bg-cyan-100 p-3 rounded-full mr-4">
                    <svg className="w-5 h-5 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-800 break-all">
                      {userDetails.email ? userDetails.email.replace(/(.{2})(.*)(@.*)/, '$1*****$3') : 'Not provided'}
                    </p>
                  </div>
                </div>

                {/* Enhanced Address Section */}
                {hasAddressData(userDetails.address) && (
                  <div className="md:col-span-2">
                    <button
                      onClick={toggleAddress}
                      className="flex items-center justify-between w-full p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-100 hover:from-orange-100 hover:to-amber-100 transition-all duration-200 mb-4"
                    >
                      <div className="flex items-center">
                        <FaMapMarkerAlt className="mr-3 text-orange-500 text-lg" />
                        <h4 className="text-lg font-semibold text-gray-800">Address</h4>
                      </div>
                      {showAddress ? (
                        <FaChevronUp className="text-orange-500" />
                      ) : (
                        <FaChevronDown className="text-orange-500" />
                      )}
                    </button>

                    {showAddress && userDetails.address && (
                      <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-5 border border-orange-100">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Street Address */}
                          {userDetails.address.street && (
                            <div className="flex items-start">
                              <div className="bg-orange-100 p-2 rounded-lg mr-3 flex-shrink-0">
                                <FaHome className="text-orange-600" />
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Street Address</p>
                                <p className="font-medium text-gray-800">
                                  {userDetails.address.street}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* City */}
                          {userDetails.address.city && (
                            <div className="flex items-start">
                              <div className="bg-orange-100 p-2 rounded-lg mr-3 flex-shrink-0">
                                <FaCity className="text-orange-600" />
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">City</p>
                                <p className="font-medium text-gray-800">
                                  {userDetails.address.city}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* State */}
                          {userDetails.address.state && (
                            <div className="flex items-start">
                              <div className="bg-orange-100 p-2 rounded-lg mr-3 flex-shrink-0">
                                <FaMapPin className="text-orange-600" />
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">State/Province</p>
                                <p className="font-medium text-gray-800">
                                  {userDetails.address.state}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Zip Code */}
                          {userDetails.address.zipCode && (
                            <div className="flex items-start">
                              <div className="bg-orange-100 p-2 rounded-lg mr-3 flex-shrink-0">
                                <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 16 16">
                                  <path d="M4 4a4 4 0 1 1 4.5 3.969V13.5a.5.5 0 0 1-1 0V7.97A4 4 0 0 1 4 4zm4.5 1.5a.5.5 0 0 0-1 0v.5a.5.5 0 0 0 1 0v-.5z"/>
                                  <path d="M6.5 7.5a.5.5 0 0 0-1 0v.5a.5.5 0 0 0 1 0v-.5zm1.5-.5a.5.5 0 0 1 .5.5v.5a.5.5 0 0 1-1 0V7.5a.5.5 0 0 1 .5-.5zm-3.5 2a.5.5 0 0 0-1 0v.5a.5.5 0 0 0 1 0v-.5z"/>
                                  <path d="M8 9.5a.5.5 0 0 1 .5.5v.5a.5.5 0 0 1-1 0V10a.5.5 0 0 1 .5-.5z"/>
                                </svg>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Postal Code</p>
                                <p className="font-medium text-gray-800">
                                  {userDetails.address.zipCode}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Country */}
                          {userDetails.address.country && (
                            <div className="flex items-start md:col-span-2">
                              <div className="bg-orange-100 p-2 rounded-lg mr-3 flex-shrink-0">
                                <FaFlag className="text-orange-600" />
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Country</p>
                                <p className="font-medium text-gray-800">
                                  {userDetails.address.country}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Education Section */}
                {hasEducationData(userDetails.education) && (
                  <div className="md:col-span-2">
                    <button
                      onClick={toggleEducation}
                      className="flex items-center justify-between w-full p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 hover:from-indigo-100 hover:to-purple-100 transition-all duration-200 mb-4"
                    >
                      <div className="flex items-center">
                        <FaGraduationCap className="mr-3 text-indigo-500 text-lg" />
                        <h4 className="text-lg font-semibold text-gray-800">Education</h4>
                      </div>
                      {showEducation ? (
                        <FaChevronUp className="text-indigo-500" />
                      ) : (
                        <FaChevronDown className="text-indigo-500" />
                      )}
                    </button>

                    {showEducation && userDetails.education && (
                      <div className="space-y-4">
                        {userDetails.education.map((edu, index) => (
                          <div key={index} className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-5 border border-indigo-100">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* Institution */}
                              {edu.institution && (
                                <div className="flex items-start">
                                  <div className="bg-indigo-100 p-2 rounded-lg mr-3 flex-shrink-0">
                                    <FaGraduationCap className="text-indigo-600" />
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">Institution</p>
                                    <p className="font-medium text-gray-800">
                                      {edu.institution}
                                    </p>
                                  </div>
                                </div>
                              )}

                              {/* Degree */}
                              {edu.degree && (
                                <div className="flex items-start">
                                  <div className="bg-indigo-100 p-2 rounded-lg mr-3 flex-shrink-0">
                                    <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 16 16">
                                      <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
                                    </svg>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">Degree</p>
                                    <p className="font-medium text-gray-800">
                                      {edu.degree}
                                    </p>
                                  </div>
                                </div>
                              )}

                              {/* Field of Study */}
                              {edu.fieldOfStudy && (
                                <div className="flex items-start">
                                  <div className="bg-indigo-100 p-2 rounded-lg mr-3 flex-shrink-0">
                                    <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 16 16">
                                      <path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811V2.828zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.810-1.094-.111-2.278-.039-3.213.492V2.687zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.020A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783z"/>
                                    </svg>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">Field of Study</p>
                                    <p className="font-medium text-gray-800">
                                      {edu.fieldOfStudy}
                                    </p>
                                  </div>
                                </div>
                              )}

                              {/* Years */}
                              {(edu.startYear || edu.endYear) && (
                                <div className="flex items-start">
                                  <div className="bg-indigo-100 p-2 rounded-lg mr-3 flex-shrink-0">
                                    <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 16 16">
                                      <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/>
                                      <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/>
                                    </svg>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">Duration</p>
                                    <p className="font-medium text-gray-800">
                                      {edu.startYear} - {edu.endYear || 'Present'}
                                    </p>
                                  </div>
                                </div>
                              )}

                              {/* Description */}
                              {edu.description && (
                                <div className="flex items-start md:col-span-2">
                                  <div className="bg-indigo-100 p-2 rounded-lg mr-3 flex-shrink-0">
                                    <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 16 16">
                                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                      <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
                                    </svg>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">Description</p>
                                    <p className="font-medium text-gray-800">
                                      {edu.description}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Portfolio */}
                {userDetails.portfolioUrl && (
                  <div className="flex items-center p-4 bg-gradient-to-r from-teal-50 to-green-50 rounded-xl border border-teal-100 md:col-span-2">
                    <div className="bg-teal-100 p-3 rounded-full mr-4">
                      <FaGlobe className="text-teal-600 text-lg" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Portfolio</p>
                      <a 
                        href={userDetails.portfolioUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="font-medium text-gray-800 hover:text-blue-600 transition-colors duration-300 flex items-center"
                      >
                        {userDetails.portfolioUrl}
                        <FaLink className="ml-2 text-sm" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Failed to load user details. Please try again.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewUsers;