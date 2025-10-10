// ** Third Party Components
import '@styles/react/libs/flatpickr/flatpickr.scss';
import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register chart components
ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend);

// ** Reactstrap Imports
import { useSkin } from '@hooks/useSkin';
import { Card, CardBody, CardHeader, CardTitle } from 'reactstrap';

const HourlySales = () => {
  const { skin } = useSkin();

  const gridLineColor = 'rgba(200, 200, 200, 0.2)';
  const success = '#28dac6';
  const labelColor = skin === 'dark' ? '#b4b7bd' : '#6e6b7b';

  // ** Chart Options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    animation: { duration: 700 },
    scales: {
      x: {
        grid: {
          color: gridLineColor,
          borderColor: gridLineColor,
        },
        ticks: {
          color: labelColor,
          maxRotation: 0,
          autoSkip: false,
        },
        title: {
          display: true,
          text: 'Time of Day',
          color: labelColor,
          font: { size: 13 },
        },
      },
      y: {
        min: 0,
        grid: {
          color: gridLineColor,
          borderColor: gridLineColor,
        },
        ticks: {
          stepSize: 50,
          color: labelColor,
        },
        title: {
          display: true,
          text: 'Sales Volume',
          color: labelColor,
          font: { size: 13 },
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: skin === 'dark' ? '#283046' : '#fff',
        titleColor: skin === 'dark' ? '#fff' : '#000',
        bodyColor: skin === 'dark' ? '#b4b7bd' : '#6e6b7b',
        borderColor: '#ddd',
        borderWidth: 1,
      },
    },
    elements: {
      line: {
        tension: 0.4, // smooth curve
        borderWidth: 3,
      },
      point: {
        radius: 4,
        hoverRadius: 6,
        backgroundColor: success,
        borderWidth: 0,
      },
    },
  };

  // ** Labels (12 PM → 12 AM)
  const timeLabels = [
    '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM',
    '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM', '12 AM',
  ];

  // ** Example hourly data
  const dataPoints = [120, 160, 180, 220, 260, 300, 350, 400, 380, 320, 250, 180, 130];

  // ** Chart Data
  const data = {
    labels: timeLabels,
    datasets: [
      {
        label: 'Hourly Sales',
        data: dataPoints,
        borderColor: success,
        backgroundColor: 'rgba(40, 218, 198, 0.2)',
        fill: true, // area under the line
      },
    ],
  };

  return (
    <Card>
      <CardHeader className='d-flex justify-content-between align-items-center flex-wrap'>
        <CardTitle tag='h4'>Sales by Hour</CardTitle>
      </CardHeader>

      <CardBody>
        <div style={{ height: '400px' }}>
          <Line data={data} options={options} />
        </div>
      </CardBody>
    </Card>
  );
};

export default HourlySales;
