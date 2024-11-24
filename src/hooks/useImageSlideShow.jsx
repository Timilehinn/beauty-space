import { useState, useEffect } from 'react';

function useImageSlideShow(images) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextImage = () => {
        if (Array.isArray(images) && images.length > 1) {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }
    };

    const prevImage = () => {
        if (Array.isArray(images) && images.length > 1) {
            setCurrentIndex((prevIndex) =>
                prevIndex === 0 ? images.length - 1 : prevIndex - 1
            );
        }
    };

    useEffect(() => {
        if (Array.isArray(images) && images.length > 1) {
            const interval = setInterval(nextImage, 5000);
            return () => clearInterval(interval);
        }
    }, [images]);

    const currentImage = Array.isArray(images) ? images[currentIndex] : null;

    return {
        currentImage,
        nextImage,
        prevImage,
        currentIndex
    };
}

export default useImageSlideShow;
