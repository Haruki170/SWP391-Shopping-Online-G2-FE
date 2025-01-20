import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Paper, Typography } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const GrowthChart = ({ data }) => {
  console.log(data);
  
  if (!data || data.length === 0) {
    return <Typography>Không có dữ liệu để hiển thị</Typography>;
  }

  // Sử dụng các trường `transactionDate` và `dailyIncome` từ `data`
  const labels = data.map(item => item.transactionDate);
  const dailyIncome = data.map(item => item.dailyIncome);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Thu nhập hàng ngày',
        data: dailyIncome,
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
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
        text: 'Biểu đồ thu nhập hàng ngày',
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const formatter = new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
              maximumFractionDigits: 0,
            });
            return formatter.format(tooltipItem.raw);
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Thu nhập (VND)',
        },
        ticks: {
          callback: (value) => {
            const formatter = new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
              maximumFractionDigits: 0,
            });
            return formatter.format(value);
          },
        },
      },
      x: {
        title: {
          display: true,
          text: 'Ngày trong tháng',
        },
        ticks: {
          minRotation: 0,
          maxRotation: 0,
        },
      },
    },
  };

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Typography variant="h6">Thu nhập hàng ngày</Typography>
      <Bar data={chartData} options={options} />
    </Paper>
  );
};

export default GrowthChart;
