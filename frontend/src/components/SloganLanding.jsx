import { useState } from "react";
import Icon from "../components/Icon";
import takeImg from "../assets/take.svg";
import targetImg from "../assets/target.svg";
import togetherImg from "../assets/together.svg";

const content = [
  {
    title: "Take",
    image: takeImg,
    text: `We believe in taking initiative and embracing the challenge of coding. Whether you're a beginner or an experienced programmer, taking the first step in learning and growing together is the foundation of our club. We encourage every member to take ownership of their journey, explore new technologies, and push their boundaries.`,
  },
  {
    title: "Target",
    image: targetImg,
    text: `Our goal is clear — we aim to foster a community of problem-solvers and innovators. By setting specific targets, whether it's mastering a new programming language, completing a project, or solving a complex algorithm, we ensure that every member has a meaningful objective to work toward. A focused target helps guide our efforts and measure our progress.`,
  },
  {
    title: "Together",
    image: togetherImg,
    text: `Collaboration is key. In our club, we believe that working together is what makes coding truly exciting and rewarding. Through teamwork, sharing knowledge, and supporting one another, we can achieve more than we ever could alone. By combining our strengths and learning from each other, we create a stronger, more inclusive coding community where everyone can thrive.`,
  },
];


export default function SloganPart() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="w-full h-screen flex flex-col bg-white">
      {/* Header Section */}
      <div className="flex h-1/4 border-2 border-slate-900 bg-white">
        {/* Left Box - Our Slogan */}
        <div className="w-1/5 bg-slate-900 text-white flex flex-col justify-center px-12 border-r-2 border-slate-900">
          <p className="text-sm font-normal mb-2 ml-1">Our Slogan</p>
          <div className="flex items-center gap-8">
            <p className="text-8xl font-bold leading-none">3T</p>
            <Icon name="east" size="2em" />
          </div>
        </div>

        {/* Tab Buttons */}
        {content.map((item, index) => (
          <div
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`flex-1 flex items-center justify-center text-6xl font-semibold cursor-pointer transition-all duration-300 border-r-2 border-slate-900 last:border-r-0 ${
              activeIndex === index
                ? "bg-blue-500"
                : "bg-white hover:bg-gray-50"
            }`}
          >
            <span className={activeIndex === index ? "text-slate-900" : "text-blue-500"}>
              {item.title.charAt(0)}
            </span>
            <span className={activeIndex === index ? "text-white" : "text-slate-900"}>
              {item.title.slice(1)}
            </span>
          </div>
        ))}
      </div>

      {/* Content Section */}
      <div key={activeIndex} className="flex-1 flex items-center gap-12 px-8 overflow-hidden">
        {/* Image Placeholder */}
        <div className="w-1/2 h-full flex items-center justify-center">
          <img 
            src={content[activeIndex].image} 
            alt={content[activeIndex].title} 
            className="h-[85%] w-auto object-contain drop-shadow-2xl"
          />
        </div>

        {/* Text Content */}
        <div className="w-1/2 flex items-center">
          <p className="text-3xl leading-relaxed text-gray-700">
            {content[activeIndex].text}
          </p>
        </div>
      </div>

      {/* Add animation CSS */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}