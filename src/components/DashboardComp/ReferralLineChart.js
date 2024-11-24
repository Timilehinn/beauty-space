'use client'

import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const ReferralLineChart = ({ rewardData }) => {
  /**
   * The function `processData` sorts reward data by date, formats dates, and extracts amounts to return
   * labels and values.
   * @returns The `processData` function returns an object with `labels` and `values` properties. The
   * `labels` property contains an array of formatted dates (short month and numeric day) extracted from
   * the `rewardData`, while the `values` property contains an array of parsed `reward_amount` values
   * from the `rewardData`. If `rewardData` is falsy or not an array, an
   */
  const processData = () => {
    if (!rewardData || !Array.isArray(rewardData))
      return { labels: [], values: [] }

    // Sort data by date
    const sortedData = [...rewardData].sort(
      (a, b) => new Date(a.reward_date) - new Date(b.reward_date)
    )

    // Format dates and extract amounts
    const labels = sortedData.map((item) => {
      const date = new Date(item.reward_date)
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    })

    const values = sortedData.map((item) => parseFloat(item.reward_amount))

    return { labels, values }
  }

  const { labels, values } = processData()

  /* This part of the code snippet is defining the data object that will be used to populate the Line
chart in the `ReferralLineChart` component. Here's a breakdown of what each property in the `data`
object is doing: */
  const data = {
    labels,
    datasets: [
      {
        label: 'Reward Amount',
        data: values,
        borderColor: '#2f80ed',
        backgroundColor: 'rgba(47, 128, 237, 0.2)',
        pointBackgroundColor: '#fff',
        pointBorderColor: '#2f80ed',
        pointRadius: 5,
        tension: 0.4,
      },
    ],
  }

  /* The `options` constant in the code snippet is defining the configuration options for the Line chart
displayed in the `ReferralLineChart` component. Here is a breakdown of what each part of the
`options` object is doing: */
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return '$' + value.toLocaleString()
          },
        },
        grid: {
          drawBorder: false,
          borderDash: [5, 5],
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function (context) {
            return '$' + parseFloat(context.raw).toLocaleString()
          },
        },
      },
    },
    elements: {
      point: {
        hoverRadius: 8,
      },
    },
  }

  return <Line data={data} options={options} />
}

export default ReferralLineChart
