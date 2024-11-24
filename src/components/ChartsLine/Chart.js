'use client'

import React from 'react'
import { Bar } from 'react-chartjs-2'
import { useSelector } from 'react-redux'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const Chart = ({ chosenData, currentMonth }) => {
  const accountType = useSelector((state) => state.adminPeople.accountType)

  const data = {
    labels: chosenData[0]?.data?.map((d) => d?.month),
    datasets: [
      {
        label: accountType === 'Owner' ? "User's Revenues" : "User's Expenses",
        data: chosenData[0]?.data?.map((d) => d?.amount),
        backgroundColor: '#e95186',
        borderRadius: {
          topLeft: 10,
          topRight: 10,
        },
      },
    ],
  }

  const options = {
    responsive: true,
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          display: true,
          borderDash: [5, 5],
        },
      },
    },
  }

  return <Bar data={data} options={options} />
}

export default Chart
