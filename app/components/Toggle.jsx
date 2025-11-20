import React, { useState } from 'react';

const Toggle = ({ onStatusChange }) => {
  const [activePosition, setActivePosition] = useState('leave');

  const handleButtonClick = (color) => {
    setActivePosition(color);
    if (onStatusChange) {
      onStatusChange(color);
    }
  };

  const getSliderTransform = () => {
    switch (activePosition) {
      case 'blue':
        return 'translate-x-0 bg-blue-500';
      case 'leave':
        return 'translate-x-full bg-gray-500';
      case 'red':
        return 'translate-x-[200%] bg-red-500';
      default:
        return 'translate-x-0';
    }
  };

  return (
    <div className="relative w-full max-w-md h-12 bg-[#262626] rounded-full flex items-center justify-between overflow-hidden">
      
      <div className={`absolute h-12 w-1/3 rounded-full transition-all duration-300 ease-in-out shadow-lg ${getSliderTransform()}`}></div>

      <div className="relative z-10 grid grid-cols-3 w-full h-full">
        <button 
          onClick={() => handleButtonClick('blue')}
          className={`flex-1 flex justify-center items-center h-full px-4 font-semibold transition-colors duration-300 ${activePosition === 'blue' ? 'text-white' : 'text-[#9E9E9E]'}`}
        >
          Blue
        </button>
        <button 
          onClick={() => handleButtonClick('leave')}
          className={`flex-1 flex justify-center items-center h-full px-4 font-semibold transition-colors duration-300 ${activePosition === 'leave' ? 'text-white' : 'text-[#9E9E9E]'}`}
        >
          Leave
        </button>
        <button 
          onClick={() => handleButtonClick('red')}
          className={`flex-1 flex justify-center items-center h-full px-4 font-semibold transition-colors duration-300 ${activePosition === 'red' ? 'text-white' : 'text-[#9E9E9E]'}`}
        >
          Red
        </button>
      </div>
    </div>
  );
};

export default Toggle;