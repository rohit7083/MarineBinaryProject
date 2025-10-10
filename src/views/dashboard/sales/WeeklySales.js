// ** Third Party Components
import '@styles/react/libs/flatpickr/flatpickr.scss';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register required chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

// ** Reactstrap Imports
import { useSkin } from '@hooks/useSkin';
import { Card, CardBody, CardHeader, CardTitle } from 'reactstrap';

const WeeklySales = () => {
  const { skin } = useSkin();

  const gridLineColor = 'rgba(200, 200, 200, 0.2)';
  const success = '#28dac6';
  const labelColor = skin === 'dark' ? '#b4b7bd' : '#6e6b7b';

  // ** Chart Options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 500 },
    scales: {
      x: {
        grid: {
          color: gridLineColor,
          borderColor: gridLineColor,
        },
        ticks: { color: labelColor },
      },
      y: {
        min: 0,
        max: 400,
        grid: {
          color: gridLineColor,
          borderColor: gridLineColor,
        },
        ticks: {
          stepSize: 100,
          color: labelColor,
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: skin === 'dark' ? '#283046' : '#fff',
        titleColor: skin === 'dark' ? '#fff' : '#000',
        bodyColor: skin === 'dark' ? '#b4b7bd' : '#6e6b7b',
      },
    },
  };

  // ** Chart Data
  const data = {
    labels: [
      '7/12', '8/12', '9/12', '10/12', '11/12',
      '12/12', '13/12',
    ],
    datasets: [
      {
        label: 'Sales',
        maxBarThickness: 15,
        backgroundColor: success,
        borderColor: 'transparent',
        borderRadius: 10,
        data: [275, 90, 190, 205, 125, 85, 55, 87, 127, 150, 230, 280, 190],
      },
    ],
  };

  return (
    <Card>
      <CardHeader className='d-flex justify-content-between align-items-center flex-wrap'>
        <CardTitle tag='h4'>Day Of Week
</CardTitle>
        
      </CardHeader>

      <CardBody>
        <div style={{ height: '400px' }}>
          <Bar data={data} options={options} />
        </div>
      </CardBody>
    </Card>
  );
};

export default WeeklySales;
