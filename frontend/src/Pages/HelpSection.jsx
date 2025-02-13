import React from "react";
import { Globe, Smartphone, FileText, MessageCircle } from "lucide-react";


const HelpSection = () => {
  return (
    <section className="bg-[#2E3E3F] py-16 relative">
      {/* Top Dotted Pattern */}
      <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-[#2E3E3F] via-[#2E3E3F] to-transparent">
        <div className="w-full h-full bg-[radial-gradient(circle,_rgba(255,255,255,0.55)_1px,_transparent_1px)] bg-[size:12px_12px] opacity-120"></div>
      </div>

      {/* Heading */}
      <h2 className="text-white text-3xl md:text-4xl font-semibold text-center mb-12">
        How we can help you...
      </h2>

      {/* Phone Mockups */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-8 px-6">
        <img
          src="/image.png" // Replace with actual image paths
          alt="Phone Mockup 1"
          className="w-[280px] m-4 md:w-[260px] rounded-4xl mr-12"
        />
        
        <img
          src="/img2.png"
          alt="Phone Mockup 2"
          className="w-[280px] m-4 md:w-[260px] rounded-4xl ml-16 mr-4"
        />
        <img
          src="/img3.png"
          alt="Phone Mockup 3"
          className="w-[280px] m-4 md:w-[260px] rounded-4xl  ml-20"
        />
      </div>
    </section>
  );
};

export default HelpSection;
