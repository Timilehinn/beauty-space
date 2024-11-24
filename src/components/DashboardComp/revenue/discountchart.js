import 'chart.js/auto'
import { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2'

export default function DiscountCharts({ chartDetails }) {
  const [barThickness, setBarThickness] = useState(30)

  useEffect(() => {
    const updateBarThickness = () => {
      if (window.innerWidth <= 480) {
        setBarThickness(10) // Set smaller bar thickness for mobile screens
      } else {
        setBarThickness(30) // Default bar thickness for larger screens
      }
    }

    // Initial check
    updateBarThickness()

    // Add event listener for window resize
    window.addEventListener('resize', updateBarThickness)

    // Clean up event listener on component unmount
    return () => window.removeEventListener('resize', updateBarThickness)
  }, [])

  // Extract unique dates
  const uniqueDates = [
    ...new Set(
      chartDetails?.map((item) =>
        new Date(item.transaction_date).toLocaleDateString()
      )
    ),
  ]

  // Predefined set of colors
  const colorPalette = [
    '#fce9ee',
    '#e95186',
    '#7f2b48',
    '#fce9ee',
    '#e95186',
    '#7f2b48',
    '#fce9ee',
    '#e95186',
    '#7f2b48',
  ]

  const datasets = [
    {
      label: 'Sales report ',
      data: uniqueDates?.map((date) => {
        const item = chartDetails?.find(
          (entry) =>
            new Date(entry.transaction_date).toLocaleDateString() === date
        )
        return item
          ? item.discount_code
            ? parseFloat(item.total_sales_with_discount)
            : parseFloat(item.total_sales_without_discount)
          : 0
      }),
      backgroundColor: colorPalette,
      borderRadius: 10,
    },
  ]

  const data = {
    labels: uniqueDates,
    datasets,
  }

  const options = {
    plugins: {
      title: {
        display: true,
        text: 'Transactions Report',
      },
      legend: {
        position: 'top',
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        beginAtZero: true,
      },
    },
  }

  return <Bar data={data} options={options} />
}
