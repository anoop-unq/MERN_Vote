// src/components/PollChart.js
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { PollContext } from '../context/PollContext';
import Navbar from '../pages/Navbar';
import LoadingSpinner from '../pages/LoadingSpinner';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const PollChart = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchPollById } = useContext(PollContext);
  const [poll, setPoll] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [chartType, setChartType] = useState('bar'); // 'bar' or 'doughnut'

  useEffect(() => {
    loadPoll();
  }, [id]);

  const loadPoll = async () => {
    try {
      setIsLoading(true);
      const pollData = await fetchPollById(id);
      setPoll(pollData);
    } catch (error) {
      console.error('Failed to load poll:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!poll) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800">Poll not found</h1>
        <Link to="/polls" className="text-blue-600 hover:text-blue-700 mt-4 inline-block">
          Back to all polls
        </Link>
      </div>
    );
  }

  const totalVotes = poll.options.reduce((sum, option) => sum + (option.voteCount || 0), 0);
  
  // Prepare data for the chart
  const chartData = {
    labels: poll.options.map(option => option.text),
    datasets: [
      {
        label: '# of Votes',
        data: poll.options.map(option => option.voteCount || 0),
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
          'rgba(255, 159, 64, 0.7)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: poll.question,
        font: {
          size: 18
        }
      },
    },
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Navbar />

      <div className="bg-white rounded-lg shadow-md p-6 mb-6 mt-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Poll Results Visualization</h1>
        <p className="text-gray-600 mb-4">Total votes: {totalVotes}</p>
        
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setChartType('bar')}
            className={`px-4 py-2 rounded ${
              chartType === 'bar' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Bar Chart
          </button>
          <button
            onClick={() => setChartType('doughnut')}
            className={`px-4 py-2 rounded ${
              chartType === 'doughnut' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Doughnut Chart
          </button>
        </div>

        <div className="h-96">
          {chartType === 'bar' ? (
            <Bar data={chartData} options={options} />
          ) : (
            <Doughnut data={chartData} options={options} />
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Vote Details</h2>
        <div className="space-y-4">
          {poll.options.map((option, index) => {
            const optionVotes = option.voteCount || 0;
            const percentage = totalVotes > 0 ? ((optionVotes / totalVotes) * 100).toFixed(1) : 0;
            
            return (
              <div key={option._id} className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-800 font-medium">
                    {option.text}
                  </span>
                  <span className="text-gray-600 font-semibold">
                    {percentage}% ({optionVotes} vote{optionVotes !== 1 ? 's' : ''})
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="h-4 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: chartData.datasets[0].backgroundColor[index]
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PollChart;