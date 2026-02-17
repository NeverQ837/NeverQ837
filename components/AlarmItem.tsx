
import React from 'react';
import { Alarm } from '../types';

interface AlarmItemProps {
  alarm: Alarm;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  index: number;
}

const AlarmItem: React.FC<AlarmItemProps> = ({ alarm, onToggle, onDelete, index }) => {
  const colors = ['bg-[#FFC1E3]', 'bg-[#FFF089]', 'bg-[#B6C99B]', 'bg-[#ADC5E8]'];
  const bgColor = colors[index % colors.length];

  return (
    <div className={`playful-card p-6 flex flex-col mb-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${bgColor} ${!alarm.isActive && 'opacity-70 grayscale-[0.3]'}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex flex-col">
          <span className="text-4xl font-black heading-font text-black">{alarm.time}</span>
          <span className="text-sm font-bold text-black/60 uppercase tracking-tight">{alarm.label || 'นาฬิกาปลุก'}</span>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onToggle(alarm.id)}
            className={`w-14 h-8 rounded-full border-2 border-black transition-all relative ${alarm.isActive ? 'bg-black' : 'bg-white'}`}
          >
            <div className={`absolute top-1 w-4 h-4 rounded-full border border-black transition-all ${alarm.isActive ? 'right-1 bg-white' : 'left-1 bg-black'}`} />
          </button>
          <button 
            onClick={() => onDelete(alarm.id)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white border-2 border-black hover:bg-red-100 transition-colors"
          >
            <i className="fa-solid fa-xmark text-black"></i>
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-black/10">
        <div className="flex gap-1">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
            const labels: any = { 'Mon': 'จ', 'Tue': 'อ', 'Wed': 'พ', 'Thu': 'พฤ', 'Fri': 'ศ', 'Sat': 'ส', 'Sun': 'อา' };
            const isSelected = alarm.repeat.includes(day);
            return (
              <span key={day} className={`text-[10px] w-5 h-5 flex items-center justify-center rounded-full border border-black/10 ${isSelected ? 'bg-black text-white' : 'text-black/30'}`}>
                {labels[day]}
              </span>
            );
          })}
        </div>
        <div className="flex items-center gap-2">
           <span className="text-[10px] font-bold bg-white/50 px-2 py-1 rounded-full border border-black/5 flex items-center gap-1">
             <i className="fa-solid fa-music text-[8px]"></i> {alarm.sound || 'พื้นฐาน'}
           </span>
           {alarm.snoozeEnabled && (
             <span className="text-[10px] font-bold bg-black text-white px-2 py-1 rounded-full flex items-center gap-1">
               <i className="fa-solid fa-rotate-right text-[8px]"></i> {alarm.snoozeDuration}น.
             </span>
           )}
        </div>
      </div>
    </div>
  );
};

export default AlarmItem;
