import 'chart.js/auto'
import { useEffect, useMemo, useState } from 'react'
import { Bar } from 'react-chartjs-2'
import { useSelector } from 'react-redux'

import { getYearlyReport } from '../../../redux/insightSlice'
import { generateColorPalette } from './MonthlyCharts'

export default function YearOverYearChart() {
  const [barThickness, setBarThickness] = useState(30)

  const yearlyReportData = useSelector(getYearlyReport)

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

  // Extract unique years
  const uniqueYears = [...new Set(yearlyReportData?.map((item) => item.year))]

  // Extract unique services
  const services = [
    ...new Set(yearlyReportData?.map((item) => item.service_name)),
  ]

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

  // const datasets = services?.map((service) => {
  //   const data = uniqueYears?.map((year) => {
  //     const item = yearlyReportData?.find(
  //       (entry) => entry.year === year && entry.service_name === service
  //     )
  //     return item ? item.total_cost : 0
  //   })

  //   return {
  //     label: service,
  //     data,
  //     backgroundColor: backgroundColors[service],
  //     borderRadius: 10,
  //   }
  // })

  const datasets = useMemo(
    () =>
      services?.map((service) => {
        const data = uniqueYears?.map((year) => {
          const item = yearlyReportData?.find(
            (entry) => entry.year === year && entry.service_name === service
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
    [services, uniqueYears, yearlyReportData, backgroundColors, barThickness]
  )

  const data = {
    labels: uniqueYears,
    datasets,
  }

  const options = {
    plugins: {
      title: {
        display: true,
        text: 'Yearly Sales Report',
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
        grid: {
          display: false,
        },
      },
      y: {
        stacked: true,
        beginAtZero: true,
      },
    },
    barPercentage: 0.8, // Adjusts bar width
    categoryPercentage: 0.9, // Adjusts space between categories
  }

  return <Bar data={data} options={options} />
}
