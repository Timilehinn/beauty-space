import { useState } from 'react'

export default function useImageGallery(initialImages) {
  const [currentImage, setCurrentImage] = useState(0)

  const nextImage = () => {
    setCurrentImage((prevIndex) => (prevIndex + 1) % initialImages.length)
  }

  const prevImage = () => {
    setCurrentImage((prevIndex) =>
      prevIndex === 0 ? initialImages.length - 1 : prevIndex - 1
    )
  }

  const selectImage = (index) => {
    setCurrentImage(index)
  }

  return {
    currentImage,
    nextImage,
    prevImage,
    selectImage,
    images: initialImages,
    totalImages: initialImages.length,
  }
}
