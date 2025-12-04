import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Plumber from './assets/Plumber.jpeg'
import Cleaner from './assets/Cleaner.jpeg'
import Energy from './assets/Energy.jpeg'
import Repairs from './assets/Repairs.jpeg'
import el from './assets/el.jpeg'
import clean from './assets/clean.png'

gsap.registerPlugin(ScrollTrigger);

const jobImages = [
  { src: Repairs, className: "top-[10%] left-[45%]" },
  { src: Plumber, className: "top-[25%] left-[35%]" },
  { src: Cleaner, className: "top-[35%] left-[15%]" },
  { src: Energy, className: "bottom-[25%] left-[10%]" },
  { src: clean, className: "bottom-[10%] right-[30%]" },
  { src: el, className: "top-[35%] right-[15%]" },
];

const AnimatedShowcase = () => {
  const textRef = useRef([]);
  const containerRef = useRef(null);
  const centerContentRef = useRef(null);
  const imageRefs = useRef([]);

  useEffect(() => {
    // GSAP -------------
    gsap.set([...imageRefs.current], {
      opacity: 0,
      scale: 0.3
    });
    
    gsap.set(centerContentRef.current, {
      opacity: 0,
      scale: 0.1
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 85%",
        end: "top 20%",
        scrub: 0.7,
        toggleActions: "play none none none"
      }
    });

    imageRefs.current.forEach((img, index) => {
      tl.to(img, {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: "back.out(2)",
        delay: index * 0.15 
      });
    });

    
    tl.to(centerContentRef.current, {
      opacity: 1,
      scale: 1,
      duration: 1.2,
      ease: "elastic.out(1, 0.3)",
      delay: 1.0 
    }, ">");


    const floatTL = gsap.timeline({ delay: 2.5 }); 
    imageRefs.current.forEach((el, i) => {
      floatTL.to(el, {
        y: "random(-30, 30)",
        x: "random(-15, 15)",
        duration: 4 + Math.random() * 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      }, i * 0.1);
    });


    textRef.current.forEach((el) => {
      const target = +el.dataset.target;
      gsap.fromTo(
        el,
        { innerText: 0 },
        {
          innerText: target,
          duration: 2.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 40%", 
            end: "top 10%",
          },
          snap: { innerText: 1 },
          onUpdate: function () {
            el.innerText = Math.floor(this.targets()[0].innerText).toLocaleString();
          },
        }
      );
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen flex items-center justify-center bg-white overflow-hidden"
    >
  
      {jobImages.map((img, index) => (
        <img
          key={index}
          src={img.src}
          alt={`job-${index}`}
          ref={el => imageRefs.current[index] = el}
          className={`floating-img absolute w-12 h-12 md:w-24 md:h-24 rounded-full shadow-lg ${img.className}`}
        />
      ))}

  
      <div ref={centerContentRef} className="z-10 text-center px-4 transform scale-10 opacity-0">
        <p className="text-gray-500 text-sm md:text-base mb-2">A growing workforce of</p>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          <span className="text-uniqueBlue" ref={(el) => (textRef.current[0] = el)} data-target="1150">0</span> employees
        </h2>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
          <span className="text-uniqueBlue" ref={(el) => (textRef.current[1] = el)} data-target="513100">0</span> bookings
        </h2>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
          <span className="text-uniqueBlue" ref={(el) => (textRef.current[2] = el)} data-target="268900">0</span> reviews
        </h2>
      </div>
    </div>
  );
};

export default AnimatedShowcase;