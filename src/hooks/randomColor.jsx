const useRandomColor = () => {
  const predefinedColors = [
    '#2B3499',
    '#164863',
    '#7743DB',
    '#3D30A2',
    '#5272F2',
    '#0F0F0F',
    '#C70039',
    '#5B0888',
    '#004225',
    '#F94C10',
  ]

  // Shuffle the predefinedColors array
  for (let i = predefinedColors.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[predefinedColors[i], predefinedColors[j]] = [
      predefinedColors[j],
      predefinedColors[i],
    ]
  }

  let colors = predefinedColors.slice(0, 10)

  // Calculate the luminance of each color
  const calculateLuminance = (color) => {
    const hex = color.slice(1) // Remove the '#' character
    const r = parseInt(hex.slice(0, 2), 16)
    const g = parseInt(hex.slice(2, 4), 16)
    const b = parseInt(hex.slice(4, 6), 16)

    const rgb = [r, g, b].map((value) => {
      value /= 255
      value =
        value <= 0.03928
          ? value / 12.92
          : Math.pow((value + 0.055) / 1.055, 2.4)
      return 0.2126 * value + 0.7152 * value + 0.0722 * value
    })

    return rgb[0]
  }

  // Filter out colors with insufficient luminance
  colors = colors.filter((color) => calculateLuminance(color) >= 0.7)

  // Ensure we have 10 colors
  while (colors.length < 10) {
    colors.push(predefinedColors[colors.length])
  }

  return colors
}

export default useRandomColor
