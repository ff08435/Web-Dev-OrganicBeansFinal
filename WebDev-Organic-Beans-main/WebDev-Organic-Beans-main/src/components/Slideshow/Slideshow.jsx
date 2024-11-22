import React, { useState, useEffect } from 'react'; 
import './Slideshow.css';
import slide1 from '../../assets/slideshow1.png';
import slide2 from '../../assets/slideshow2.png';
import slide3 from '../../assets/slideshow3.png';

const Slideshow = () => {
  const slides = [
    { src: slide1, text: 'Organic Beans' },
    { src: slide2, text: 'Best Quality' },
    { src: slide3, text: 'Safe Packaging' }
  ];
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000); 

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="slideshow">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`slide-container ${currentSlide === index ? 'active' : ''}`}
        >
          <div className="slide-text">
            <h2>{slide.text}</h2>  
          </div>
          <img
            src={slide.src}
            alt={`Slide ${index}`}
            className="slide-image"
          />
        </div>
      ))}
    </div>
  );
};

export default Slideshow;
