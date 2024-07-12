import React from "react";
import Slider from "react-slick";
import img1 from "../assets/images/HomeSlider/slide1.jpg";
import img2 from "../assets/images/HomeSlider/slide2.webp";
import img3 from "../assets/images/HomeSlider/slide3.jpg";

function HomeSlider() {
  const settings = {
    dots: true,
    arrows: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,

    
  };

  return (
    <Slider {...settings}>
      <div className="slider-item h-[500px] w-full bg-black overflow-hidden">
        <img
          src={img1}
          alt="Slide 1"
          className="object-cover h-[500px] w-full opacity-20"
        />
        <div className="slider-text absolute inset-0 flex flex-col items-center justify-center text-white text-3xl font-bold text-shadow-md">
        </div>
      </div>

      <div className="slider-item h-[500px] w-full bg-black overflow-hidden">
        <img
          src={img2}
          alt="Slide 2"
          className="object-cover h-[500px] w-full opacity-20"
        />
        <div className="slider-text absolute inset-0 flex flex-col items-center justify-center text-white text-3xl font-bold text-shadow-md">
         
        </div>
      </div>

      <div className="slider-item h-[500px] w-full bg-black overflow-hidden">
        <img
          src={img3}
          alt="Slide 3"
          className="object-cover h-[500px] w-full opacity-20"
        />
        <div className="slider-text absolute inset-0 flex flex-col items-center justify-center text-white text-3xl font-bold text-shadow-md">
          
        </div>
      </div>
    </Slider>
  );
}

export default HomeSlider;
