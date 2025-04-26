import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface WeightProgressChartProps {
  currentWeight: number;
  targetWeight: number;
  timeframe: string;
}

const WeightProgressChart: React.FC<WeightProgressChartProps> = ({
  currentWeight,
  targetWeight,
  timeframe
}) => {
  const getWeeks = (timeframe: string): number => {
    const weeks = parseInt(timeframe.split('_')[0]);
    return weeks || 12;
  };

  const weeks = getWeeks(timeframe);
  const weightDifference = targetWeight - currentWeight;
  const weeklyChange = weightDifference / weeks;

  const labels = Array.from({ length: weeks + 1 }, (_, i) => `Week ${i}`);
  const data = Array.from({ length: weeks + 1 }, (_, i) => 
    +(currentWeight + (weeklyChange * i)).toFixed(1)
  );

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Expected Weight Progress',
        data,
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        tension: 0.3
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Expected Weight Progress Over Time'
      }
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Weight (kg)'
        }
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        Weight Progress Projection
      </h3>
      <Line options={options} data={chartData} />
    </div>
  );
};

export default WeightProgressChart