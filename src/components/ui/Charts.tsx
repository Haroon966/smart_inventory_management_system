import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Common chart options
const commonOptions: ChartOptions<'line' | 'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.05)',
      },
    },
    x: {
      grid: {
        display: false,
      },
    },
  },
};

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string;
    borderWidth?: number;
    fill?: boolean;
    tension?: number;
  }[];
}

interface ChartProps {
  data: ChartData;
  height?: number;
  className?: string;
}

export const LineChart: React.FC<ChartProps> = ({ data, height = 300, className = '' }) => {
  const options = {
    ...commonOptions,
    plugins: {
      ...commonOptions.plugins,
      title: {
        display: false,
      },
    },
  };

  return (
    <div style={{ height: `${height}px` }} className={className}>
      <Line options={options} data={data} />
    </div>
  );
};

export const BarChart: React.FC<ChartProps> = ({ data, height = 300, className = '' }) => {
  const options = {
    ...commonOptions,
    plugins: {
      ...commonOptions.plugins,
      title: {
        display: false,
      },
    },
  };

  return (
    <div style={{ height: `${height}px` }} className={className}>
      <Bar options={options} data={data} />
    </div>
  );
}; 