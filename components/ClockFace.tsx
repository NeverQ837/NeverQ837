
import React, { useState, useEffect } from 'react';

const ClockFace: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return {
      hours: date.getHours().toString().padStart(2, '0'),
      minutes: date.getMinutes().toString().padStart(2, '0'),
      dateStr: date.toLocaleDateString('th-TH', { 
        weekday: 'long', 
        day: 'numeric',
        month: 'long' 
      })
    };
  };

  const { hours, minutes, dateStr } = formatTime(time);

  return (
    <div className="flex flex-col items-center justify-center py-10 relative">
      {/* Background Decorative Shapes */}
      <div className="absolute top-0 -left-10 w-40 h-40 bg-[#FFC1E3] rounded-full blur-[50px] opacity-40"></div>
      <div className="absolute bottom-0 -right-10 w-40 h-40 bg-[#FFF089] rounded-full blur-[50px] opacity-40"></div>
      
      <div className="relative z-10 flex flex-col items-center">
        <div className="heading-font text-[100px] md:text-[140px] font-black leading-none tracking-tight text-black flex items-center">
          <span>{hours}</span>
          <span className="mx-1 text-black/20">:</span>
          <span>{minutes}</span>
        </div>
        
        <div className="mt-2 bg-white/50 backdrop-blur px-6 py-2 rounded-full border border-black/5 shadow-sm">
          <span className="text-black font-semibold uppercase tracking-wider text-sm">
            {dateStr}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ClockFace;
