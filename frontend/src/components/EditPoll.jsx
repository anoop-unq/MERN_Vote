import { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PollContext } from '../context/PollContext';
import { AppContext } from '../context/AppContext';

const EditPoll = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchPollById, editPoll } = useContext(PollContext);
  const { islogged, userdata } = useContext(AppContext);
  const [poll, setPoll] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [hasVotes, setHasVotes] = useState(false);
  const [formData, setFormData] = useState({
    question: '',
    options: [{ text: '' }, { text: '' }],
    allowAddOptions: false
  });

  useEffect(() => {
    if (!islogged) {
      navigate('/login');
      return;
    }
    
    loadPoll();
  }, [id, islogged]);

  const loadPoll = async () => {
    try {
      setIsLoading(true);
      setError('');
      const pollData = await fetchPollById(id);
      
      // Check if user is the creator
      if (pollData.createdBy._id !== userdata._id) {
        setError('You can only edit your own polls');
        return;
      }
      
      // Check if poll has votes
      const votesExist = pollData.options.some(option => option.votes.length > 0 || option.voteCount > 0);
      setHasVotes(votesExist);
      
      if (votesExist) {
        setFormData({
          allowAddOptions: true,
          question: pollData.question, // Keep original question (disabled)
          options: [
            ...pollData.options.map(opt => ({ 
              text: opt.text,
              isExisting: true // Mark existing options
            })),
            { text: '', isExisting: false }, // Add empty option for new input
            { text: '', isExisting: false }  // Add another empty option
          ]
        });
      } else {
        setFormData({
          question: pollData.question,
          options: pollData.options.map(opt => ({ 
            text: opt.text,
            isExisting: false 
          })),
          allowAddOptions: false
        });
      }
      
      setPoll(pollData);
    } catch (error) {
      console.error('Failed to load poll:', error);
      setError('Failed to load poll. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index].text = value;
    setFormData(prev => ({
      ...prev,
      options: newOptions
    }));
  };

  const addOption = () => {
    setFormData(prev => ({
      ...prev,
      options: [...prev.options, { text: '', isExisting: false }]
    }));
  };

  const removeOption = (index) => {
    if (hasVotes) {
      // Don't allow removing existing options if poll has votes
      if (formData.options[index].isExisting) {
        setError('Cannot remove options that already have votes');
        return;
      }
    }
    
    if (formData.options.length <= 2) {
      setError('A poll must have at least 2 options');
      return;
    }
    
    const newOptions = [...formData.options];
    newOptions.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      options: newOptions
    }));
    setError(''); // Clear error when successful
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    
    // For polls with votes, we don't validate question since it's disabled
    if (!hasVotes && !formData.question.trim()) {
      setError('Please enter a question');
      return;
    }
    
    const validOptions = formData.options.filter(opt => opt.text.trim());
    
    if (hasVotes) {
      // For polls with votes, we need at least one NEW option
      const existingOptions = poll.options.map(opt => opt.text);
      const newOptions = validOptions.filter(opt => 
        !existingOptions.includes(opt.text) && opt.text.trim()
      );
      
      if (newOptions.length < 1) {
        setError('Please add at least one new option');
        return;
      }
    } else {
      // For polls without votes, need at least 2 options total
      if (validOptions.length < 2) {
        setError('Please provide at least 2 options');
        return;
      }
    }
    
    try {
      setIsSubmitting(true);
      
      // Prepare data for backend
      const submitData = {
        question: formData.question.trim(),
        options: validOptions.map(opt => ({ text: opt.text })),
        allowAddOptions: hasVotes
      };
      
      console.log('Submitting data:', submitData);
      
      await editPoll(id, submitData);
      
      navigate(`/my-polls`);
    } catch (error) {
      console.error('Failed to update poll:', error);
      setError(error.message || 'Failed to update poll. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading poll...</div>;
  }

  // Only show error page if poll couldn't be loaded
  if (error && !poll) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <button 
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:text-blue-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-600 hover:text-blue-700 mb-6"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back
      </button>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Poll</h1>

        {hasVotes && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
            <p className="font-medium">This poll already has votes</p>
            <p className="text-sm">You can only add new options. Existing options cannot be modified or removed.</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="question" className="block text-gray-700 font-medium mb-2">
              Question
            </label>
            <input
              type="text"
              id="question"
              name="question"
              value={formData.question}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your question"
              required={!hasVotes} // Only require if no votes
              disabled={hasVotes} // Disable question editing if poll has votes
            />
            {hasVotes && (
              <p className="text-sm text-gray-500 mt-1">Question cannot be changed once votes are cast</p>
            )}
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <label className="block text-gray-700 font-medium">Options</label>
              {!hasVotes && (
                <button
                  type="button"
                  onClick={addOption}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  + Add Option
                </button>
              )}
            </div>

            {formData.options.map((option, index) => {
              const isExistingOption = hasVotes && option.isExisting;
              
              return (
                <div key={index} className="flex items-center mb-3">
                  <input
                    type="text"
                    value={option.text}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className={`flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                      isExistingOption ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                    placeholder={`Option ${index + 1}`}
                    disabled={isExistingOption}
                  />
                  {(formData.options.length > 2 && !isExistingOption) && (
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      className="ml-2 text-red-600 hover:text-red-700 p-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                  {isExistingOption && (
                    <span className="ml-2 text-sm text-green-600">(Existing)</span>
                  )}
                </div>
              );
            })}

            {hasVotes && (
              <button
                type="button"
                onClick={addOption}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium mt-2"
              >
                + Add New Option
              </button>
            )}
          </div>

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 text-gray-600 hover:text-gray-700 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isSubmitting ? 'Updating...' : hasVotes ? 'Add Options' : 'Update Poll'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPoll;