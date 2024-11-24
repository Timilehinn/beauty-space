import 'chart.js/auto'
import { useEffect, useMemo, useState } from 'react'
import { Bar } from 'react-chartjs-2'
import { useSelector } from 'react-redux'
import { getMonthlyReport } from '../../../redux/insightSlice'

// Function to generate a color palette
export function generateColorPalette(numColors, seed) {
  const baseHue = (seed * 1000) % 360 // Use seed for consistent starting hue
  const colors = []
  for (let i = 0; i < numColors; i++) {
    const hue = (baseHue + (i * 360) / numColors) % 360
    const saturation = 70 + ((seed * (i + 1)) % 10) // Use seed for consistent saturation
    const lightness = 45 + ((seed * (i + 2)) % 10) // Use seed for consistent lightness
    colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`)
  }
  return colors
}

export default function MonthlyCharts() {
  const [barThickness, setBarThickness] = useState(30)
  const monthlyData = useSelector(getMonthlyReport)

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

  const uniqueMonths = useMemo(
    () => [...new Set(monthlyData?.map((item) => item.month_year))],
    [monthlyData]
  )

  const services = useMemo(
    () => [...new Set(monthlyData?.map((item) => item.service_name))],
    [monthlyData]
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

  const datasets = useMemo(
    () =>
      services?.map((service) => {
        const data = uniqueMonths?.map((month) => {
          const item = monthlyData?.find(
            (entry) =>
              entry.month_year === month && entry.service_name === service
          )
          return item ? item.total_cost : 0
        })
        return {
          label: service,
          data,
          backgroundColor: backgroundColors[service],
          borderRadius: 5,
          barThickness: barThickness,
        }
      }),
    [services, uniqueMonths, monthlyData, backgroundColors, barThickness]
  )

  const data = {
    labels: uniqueMonths,
    datasets,
  }

  const options = {
    plugins: {
      title: {
        display: true,
        text: 'Monthly Sales Report',
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
