
import React, { useState } from 'react';
import { Alarm } from '../types';

interface ScheduleViewProps {
  alarms: Alarm[];
}

const DAYS_MAP = [
  { label: 'จันทร์', value: 'Mon' },
  { label: 'อังคาร', value: 'Tue' },
  { label: 'พุธ', value: 'Wed' },
  { label: 'พฤหัสฯ', value: 'Thu' },
  { label: 'ศุกร์', value: 'Fri' },
  { label: 'เสาร์', value: 'Sat' },
  { label: 'อาทิตย์', value: 'Sun' },
];

const ScheduleView: React.FC<ScheduleViewProps> = ({ alarms }) => {
  const [activeDay, setActiveDay] = useState<string>('Mon');

  const dayAlarms = alarms
    .filter(a => a.repeat.includes(activeDay))
    .sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <h2 className="text-3xl font-black mb-6 heading-font">ตารางเวลาของคุณ</h2>
      
      {/* Day Selector */}
      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide mb-8">
        {DAYS_MAP.map((day) => (
          <button
            key={day.value}
            onClick={() => setActiveDay(day.value)}
            className={`px-6 py-3 rounded-full border-2 border-black font-bold whitespace-nowrap transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
              activeDay === day.value ? 'bg-[#FFC1E3] text-black scale-105' : 'bg-white text-black opacity-60'
            }`}
          >
            {day.label}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        <div className="bg-white/30 backdrop-blur-sm rounded-[40px] border-2 border-black/10 p-8 min-h-[300px]">
          <div className="flex items-center justify-between mb-8 border-b-2 border-black/5 pb-4">
            <span className="text-xl font-black text-black/40">เวลา</span>
            <span className="text-xl font-black text-black/40">กิจกรรม</span>
          </div>

          {dayAlarms.length > 0 ? (
            dayAlarms.map((alarm) => (
              <div key={alarm.id} className="flex items-center justify-between mb-6 group">
                <div className="flex flex-col">
                  <span className="text-4xl font-black heading-font text-black">{alarm.time}</span>
                </div>
                <div className={`px-6 py-3 rounded-[20px] border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] bg-[#FFF089] min-w-[150px] text-center`}>
                  <span className="font-bold text-black">{alarm.label || 'นาฬิกาปลุก'}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center pt-10 text-black/30">
              <i className="fa-solid fa-calendar-xmark text-5xl mb-4"></i>
              <p className="font-bold">ไม่มีรายการปลุกสำหรับวันนี้</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScheduleView;
