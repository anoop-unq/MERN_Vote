import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { PollContext } from '../context/PollContext';
import { assets } from '../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  FaUser, FaSignOutAlt, FaEnvelope, FaChevronDown, FaCheckCircle, 
  FaPlus, FaChartBar, FaEye, FaUsers, FaShare, FaLock, 
  FaPoll, FaChartPie, FaVoteYea, FaArrowRight, FaRocket,
  FaLightbulb, FaShieldAlt, FaGlobe, FaBell
} from 'react-icons/fa';
import LoadingSpinner from './LoadingSpinner';

const HomePage = () => {
  const { islogged, userdata, backendUrl, setIsLogged, setUserData } = useContext(AppContext);
  const { polls, isLoading, fetchPolls } = useContext(PollContext);
  const navigate = useNavigate();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [isReturningUser, setIsReturningUser] = useState(false);
  const [isSpinnerVisible, setIsSpinnerVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSpinnerVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + "/api/logout");
      if (data.success) {
        setIsLogged(false);
        setUserData(false);
        navigate("/");
        toast.success(`${userdata.name} logged out successfully`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + "/api/verify-otp");
      if (data.success) {
        navigate("/email-verify");
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed");
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMenu && !event.target.closest('.user-menu-container')) {
        setShowMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  useEffect(() => {
    const justSignedUp = localStorage.getItem('justSignedUp') === 'true';
    const justLoggedIn = localStorage.getItem('justLoggedIn') === 'true';
    
    if (justSignedUp) {
      setIsNewUser(true);
      localStorage.removeItem('justSignedUp');
    } else if (justLoggedIn) {
      setIsReturningUser(true);
      localStorage.removeItem('justLoggedIn');
    }
  }, [userdata]);

  useEffect(() => {
    fetchPolls(1, 6);
  }, []);

  if (isLoading && isSpinnerVisible) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg py-3' 
          : 'bg-transparent py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div 
            className="flex items-center cursor-pointer group"
            onClick={() => navigate("/")}
          >
            <img
              src={assets.logo}
              alt="Logo"
              className={`h-10 transition-all duration-300 ${isScrolled ? 'scale-95' : 'scale-100'}`}
            />
          </div>

          {userdata ? (
            <div className="relative user-menu-container">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 bg-white/0 rounded-full pl-1 pr-3 py-1 transition-all hover:bg-white/10"
              >
                <div className="relative">
                  {userdata.user?.photo ? (
                   <Link to={`/user-profile/${userdata.user?._id}`}>
                    <img
                      src={userdata.user.photo}
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover border-2 border-white/30 shadow-md hover:border-blue-400 transition-all duration-300"
                    />
                    </Link>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-lg shadow-md">
                      {userdata.name[0].toUpperCase()}
                    </div>
                  )}
                  
                  {userdata.isAccountVerified && (
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                      <FaCheckCircle className="text-blue-500 text-xs" />
                    </div>
                  )}
                </div>
                
                <FaChevronDown className={`text-gray-600 transition-transform duration-300 ${showMenu ? 'transform rotate-180' : ''}`} />
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-3 w-64 origin-top-right bg-white rounded-xl shadow-xl ring-1 ring-gray-200 focus:outline-none overflow-hidden animate-fadeIn">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b">
                    <div className="flex items-center mb-3">
                      {userdata.user?.photo ? (
                        <Link to={`/user-profile/${userdata.user?._id}`}>
                        <img
                          src={userdata.user.photo}
                          alt="Profile"
                          className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                        />
                        </Link>
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-xl">
                          {userdata.name[0].toUpperCase()}
                        </div>
                      )}
                      <div className="ml-3">
                        <p className="text-sm font-semibold text-gray-900">{userdata.name}</p>
                        <p className="text-xs text-gray-500 truncate">{userdata.email}</p>
                      </div>
                    </div>
                    
                    {userdata.isAccountVerified ? (
                      <div className="flex items-center text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full w-fit">
                        <FaCheckCircle className="mr-1" />
                        Verified Account
                      </div>
                    ) : (
                      <div className="flex items-center text-xs text-amber-600 font-medium bg-amber-50 px-2 py-1 rounded-full w-fit">
                        <FaEnvelope className="mr-1" />
                        Unverified Account
                      </div>
                    )}
                  </div>
                  
                  <div className="p-2">
                    {!userdata.isAccountVerified && (
                      <button
                        onClick={sendVerificationOtp}
                        className="flex w-full items-center px-4 py-3 text-sm text-left text-gray-700 hover:bg-blue-50 rounded-lg transition-colors mb-1"
                      >
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full mr-3">
                          <FaEnvelope className="text-blue-500" />
                        </div>
                        <div>
                          <p className="font-medium">Verify Email</p>
                          <p className="text-xs text-gray-500">Secure your account</p>
                        </div>
                      </button>
                    )}
                    
                    <button
                      onClick={logout}
                      className="flex w-full items-center px-4 py-3 text-sm text-left text-gray-700 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <div className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-full mr-3">
                        <FaSignOutAlt className="text-red-500" />
                      </div>
                      <div>
                        <p className="font-medium">Sign out</p>
                        <p className="text-xs text-gray-500">See you soon!</p>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-3">
              <button
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-full shadow-sm hover:shadow-md transition-all hover:from-blue-500 hover:to-purple-500"
                onClick={() => navigate("/signup")}
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen flex items-center pt-20">
        <div className="absolute top-10 right-10 w-72 h-72 bg-blue-200/20 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-indigo-200/20 rounded-full filter blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 text-center lg:text-left">
              <h4 className="text-2xl sm:text-3xl font-semibold text-gray-800">
                {userdata?.user?.isGuest ? "Welcome, Guest!" : 
                isNewUser ? `Welcome to VotePoll, ${userdata?.user?.name?.split(' ')[0]}!` : 
                isReturningUser ? `Great to see you again, ${userdata?.user?.name?.split(' ')[0]}!` :
                userdata ? `Welcome back, ${userdata?.user?.name?.split(' ')[0]}!` : 
                "Modern Polling System"}
              </h4>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Create Polls.
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 block">Get Opinions.</span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-600 max-w-xl mx-auto lg:mx-0">
                {userdata?.user?.isGuest ? "Preview our polling platform and see how easy it is to create and vote on polls." :
                isNewUser ? "Create engaging polls, gather opinions, and analyze results in real-time." :
                isReturningUser ? "Continue creating and participating in polls with our intuitive platform." :
                "Join thousands of users creating and participating in polls on our platform."}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                {userdata?.user?.isGuest ? (
                  <>
                    <button
                      onClick={() => navigate("/signup")}
                      className="px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center"
                    >
                      Create Account <FaRocket className="ml-2" />
                    </button>
                    <button
                      onClick={() => navigate("/login")}
                      className="px-6 py-3.5 bg-white border border-gray-200 text-gray-700 rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-300 hover:bg-gray-50 flex items-center"
                    >
                      Sign In <FaArrowRight className="ml-2" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => navigate(userdata ? "/polls/create" : "/signup")}
                      className="px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center"
                    >
                      {userdata ? "Create Poll" : "Get Started - Free"} <FaPlus className="ml-2" />
                    </button>
                    {!userdata && (
                      <button
                        onClick={() => navigate("/login")}
                        className="px-6 py-3.5 bg-white border border-gray-200 text-gray-700 rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-300 hover:bg-gray-50 flex items-center"
                      >
                        Existing User? Login <FaArrowRight className="ml-2" />
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="flex justify-center items-center relative">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl opacity-20 blur-lg"></div>
                <img
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="Polling platform"
                  className="w-full max-w-md xl:max-w-lg rounded-2xl shadow-2xl border-4 border-white relative z-10"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose VotePoll?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform offers everything you need to create, share, and analyze polls
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <FaPlus className="text-blue-600 text-2xl" />,
                title: "Easy Poll Creation",
                desc: "Create polls in seconds with our intuitive interface"
              },
              {
                icon: <FaChartBar className="text-green-600 text-2xl" />,
                title: "Real-time Analytics",
                desc: "Watch results update in real-time as people vote"
              },
              {
                icon: <FaUsers className="text-purple-600 text-2xl" />,
                title: "Audience Engagement",
                desc: "Engage your audience with interactive polling features"
              },
              {
                icon: <FaEye className="text-orange-600 text-2xl" />,
                title: "Transparent Results",
                desc: "See detailed breakdowns of voting patterns and trends"
              },
              {
                icon: <FaShare className="text-red-600 text-2xl" />,
                title: "Easy Sharing",
                desc: "Share polls via link, social media, or embed on your site"
              },
              {
                icon: <FaLock className="text-indigo-600 text-2xl" />,
                title: "Secure Voting",
                desc: "Prevent duplicate votes and ensure poll integrity"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-center w-14 h-14 bg-blue-50 rounded-xl shadow-sm mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Polls Section - Different content based on login status */}
      {islogged ? (
        <>
          {/* Recent Polls Section */}
          {polls && polls.length > 0 && (
            <div className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">Recent Polls</h2>
                  <Link
                    to="/polls"
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View All Polls <FaChevronDown className="ml-1 transform rotate-270" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {polls.slice(0, 3).map(poll => {
                    const totalVotes = poll.options?.reduce((sum, option) => {
                      return sum + (option.votes?.length || 0);
                    }, 0) || 0;
                    
                    return (
                      <div key={poll._id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <div className="flex items-center mb-4">
                          <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg mr-3">
                            <FaPoll className="text-blue-600" />
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">{poll.question}</h3>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-6">
                          <span className="flex items-center">
                            <FaChartPie className="mr-1" /> {poll.options.length} options
                          </span>
                          <span className="flex items-center">
                            <FaVoteYea className="mr-1" /> {totalVotes} votes
                          </span>
                        </div>
                        <Link
                          to={`/polls/${poll._id}`}
                          className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                        >
                          View Poll <FaArrowRight className="ml-2" />
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* User Dashboard Section */}
          <div className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Your Dashboard</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    icon: <FaPlus className="text-blue-600 text-2xl" />,
                    title: "Create Poll",
                    desc: "Start a new poll",
                    link: "/polls/create"
                  },
                  {
                    icon: <FaChartBar className="text-green-600 text-2xl" />,
                    title: "My Polls",
                    desc: "View your created polls",
                    link: "/my-polls"
                  },
                  {
                    icon: <FaUser className="text-purple-600 text-2xl" />,
                    title: "Profile",
                    desc: "View your profile",
                    link: `/user-profile/${userdata.user?._id || ''}`
                  },
                  {
                    icon: <FaEye className="text-orange-600 text-2xl" />,
                    title: "Browse",
                    desc: "Explore all polls",
                    link: "/polls"
                  }
                ].map((item, index) => (
                  <Link
                    key={index}
                    to={item.link}
                    className="bg-white p-8 rounded-2xl text-center border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
                  >
                    <div className="flex items-center justify-center w-14 h-14 bg-blue-50 rounded-xl shadow-sm mb-6 mx-auto">
                      {item.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{item.title}</h3>
                    <p className="text-gray-600">{item.desc}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Start Polling?</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Join our community of poll creators and voters. Create engaging polls, gather opinions, and make data-driven decisions.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {[
                {
                  icon: <FaUsers className="text-blue-600 text-3xl mb-2" />,
                  stat: "100+",
                  label: "Active Users"
                },
                {
                  icon: <FaPoll className="text-green-600 text-3xl mb-2" />,
                  stat: "500+",
                  label: "Polls Created"
                },
                {
                  icon: <FaVoteYea className="text-purple-600 text-3xl mb-2" />,
                  stat: "1000+",
                  label: "Votes Cast"
                }
              ].map((item, index) => (
                <div key={index} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-lg">
                  {item.icon}
                  <div className="text-3xl font-bold text-blue-600 mb-2">{item.stat}</div>
                  <div className="text-gray-600">{item.label}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/signup")}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 flex items-center mx-auto sm:mx-0"
              >
                Sign Up Now <FaRocket className="ml-2" />
              </button>
              <Link
                to={'/poll'}
                className="px-8 py-3 bg-white border border-gray-200 text-gray-700 rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-300 hover:bg-gray-50 transform hover:-translate-y-0.5 flex items-center mx-auto sm:mx-0"
              >
                Browse Public Polls <FaArrowRight className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;