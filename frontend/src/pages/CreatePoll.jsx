// pages/CreatePoll.jsx
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PollContext } from '../context/PollContext';
import Navbar from './Navbar';

const CreatePoll = () => {
  const navigate = useNavigate();
  const { createPoll, isLoading } = useContext(PollContext);
  const [formData, setFormData] = useState({
    question: '',
    options: ['', ''],
    isPublished: true
  });

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const addOption = () => {
    if (formData.options.length < 10) {
      setFormData({ ...formData, options: [...formData.options, ''] });
    }
  };

  const removeOption = (index) => {
    if (formData.options.length > 2) {
      const newOptions = formData.options.filter((_, i) => i !== index);
      setFormData({ ...formData, options: newOptions });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.question.trim()) {
      alert('Please enter a question');
      return;
    }

    const validOptions = formData.options.filter(opt => opt.trim());
    if (validOptions.length < 2) {
      alert('Please enter at least two options');
      return;
    }

    try {
      await createPoll({
        question: formData.question.trim(),
        options: validOptions,
        isPublished: formData.isPublished
      });
      navigate('/polls');
    } catch (error) {
      // Error handling is done in the context
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Navbar />

      <div className="bg-white rounded-lg shadow-md p-6 mt-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Create New Poll</h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Poll Question *
            </label>
            <input
              type="text"
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              placeholder="Enter your question here..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Options * (Minimum 2)
            </label>
            {formData.options.map((option, index) => (
              <div key={index} className="flex items-center mb-3">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {formData.options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    className="ml-2 text-red-600 hover:text-red-700 p-2"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            
            {formData.options.length < 10 && (
              <button
                type="button"
                onClick={addOption}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                + Add Option
              </button>
            )}
          </div>

          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isPublished}
                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                className="h-4 w-4 text-blue-600 mr-2"
              />
              <span className="text-gray-700">Publish immediately</span>
            </label>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/polls')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating...' : 'Create Poll'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePoll;