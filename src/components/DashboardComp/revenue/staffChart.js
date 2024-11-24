import 'chart.js/auto'
import { useEffect, useMemo, useState } from 'react'
import { Bar } from 'react-chartjs-2'
import { generateColorPalette } from './MonthlyCharts'

export default function StaffReportChart({ chartDetails }) {
  const [barThickness, setBarThickness] = useState(30)

  useEffect(() => {
    const updateBarThickness = () => {
      if (window.innerWidth <= 480) {
        setBarThickness(5)
      } else {
        setBarThickness(30)
      }
    }
    updateBarThickness()
    window.addEventListener('resize', updateBarThickness)
    return () => window.removeEventListener('resize', updateBarThickness)
  }, [])

  // Extract unique dates
  const uniqueDates = useMemo(
    () => [
      ...new Set(
        chartDetails?.map((item) =>
          new Date(item.booking_date).toLocaleDateString()
        )
      ),
    ],
    [chartDetails]
  )

  const services = useMemo(
    () => [...new Set(chartDetails?.map((item) => item.service_name))],
    [chartDetails]
  )

  // Generate a stable color palette based on the number of services
  const colorPalette = useMemo(() => {
    const seed = Math.random() // This seed will remain constant across re-renders
    return generateColorPalette(services.length, seed)
  }, [services.length]) // Only regenerate if the number of services changes

  const backgroundColors = useMemo(() => {
    const colors = {}
    services.forEach((service, index) => {
      colors[service] = colorPalette[index]
    })
    return colors
  }, [services, colorPalette])

  const datasets = useMemo(() => {
    return services.map((service) => {
      const data = uniqueDates.map((date) => {
        // Filter chartDetails to get all items that match the date and service
        const itemsForDateAndService = chartDetails.filter(
          (entry) =>
            new Date(entry.booking_date).toLocaleDateString() === date &&
            entry.service_name === service
        )

        // Sum the total_cost for the filtered items
        const totalCostForDateAndService = itemsForDateAndService.reduce(
          (sum, item) => sum + item.total_cost,
          0
        )

        return totalCostForDateAndService
      })

      return {
        label: service,
        data,
        backgroundColor: backgroundColors[service],
        borderRadius: 5,
        barThickness: barThickness,
      }
    })
  }, [services, uniqueDates, chartDetails, backgroundColors, barThickness])

  const data = {
    labels: uniqueDates,
    datasets,
  }

  const options = {
    plugins: {
      title: {
        display: true,
        text: 'Staff Sales Report',
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
        borderSkipped: false,
        grid: {
          display: false, // This removes vertical grid lines
        },
      },
      y: {
        stacked: true,
        beginAtZero: true,
      },
    },
    barPercentage: 0.95, // Increases bar width within category
    categoryPercentage: 0.8, // Reduces space between categories
  }

  return <Bar data={data} options={options} />
}
