
import React, { useState } from 'react';

interface AddAlarmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (time: string, label: string, repeat: string[], sound: string, snoozeEnabled: boolean, snoozeDuration: number) => void;
}

const DAYS_MAP = [
  { label: 'จ', value: 'Mon' },
  { label: 'อ', value: 'Tue' },
  { label: 'พ', value: 'Wed' },
  { label: 'พฤ', value: 'Thu' },
  { label: 'ศ', value: 'Fri' },
  { label: 'ส', value: 'Sat' },
  { label: 'อา', value: 'Sun' },
];

const SOUNDS = ['นกทักทาย', 'คลื่นทะเล', 'ขลุ่ยไม้', 'เปียโนนุ่ม'];

const AddAlarmModal: React.FC<AddAlarmModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [time, setTime] = useState('07:00');
  const [label, setLabel] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
  const [sound, setSound] = useState(SOUNDS[0]);
  const [snoozeEnabled, setSnoozeEnabled] = useState(true);
  const [snoozeDuration, setSnoozeDuration] = useState(5);

  if (!isOpen) return null;

  const toggleDay = (day: string) => {
    setSelectedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(time, label, selectedDays, sound, snoozeEnabled, snoozeDuration);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="bg-[#FDF8E1] w-full max-w-md rounded-[50px] overflow-y-auto max-h-[90vh] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-in zoom-in-95 duration-200 scrollbar-hide">
        <div className="p-8">
          <h2 className="text-3xl font-black mb-8 text-center heading-font text-black">ตั้งค่าเวลาปลุก</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Time Picker */}
            <div className="flex justify-center">
              <input 
                type="time" 
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="bg-[#FFF089] border-4 border-black rounded-[30px] p-6 text-6xl heading-font text-center focus:ring-0 outline-none w-full text-black"
                required
              />
            </div>
            
            {/* Repeat Days */}
            <div className="space-y-3">
              <label className="text-xs font-black text-black/40 uppercase tracking-widest ml-4">ปลุกซ้ำทุกวัน</label>
              <div className="flex justify-between gap-1">
                {DAYS_MAP.map((day) => (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() => toggleDay(day.value)}
                    className={`w-10 h-10 rounded-full border-2 border-black flex items-center justify-center font-bold transition-all ${
                      selectedDays.includes(day.value) ? 'bg-black text-white' : 'bg-white text-black'
                    }`}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sound Selection */}
            <div className="space-y-3">
              <label className="text-xs font-black text-black/40 uppercase tracking-widest ml-4">เสียงตอนปลุก</label>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {SOUNDS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSound(s)}
                    className={`px-4 py-2 rounded-full border-2 border-black whitespace-nowrap font-bold text-sm transition-all ${
                      sound === s ? 'bg-[#ADC5E8] text-black' : 'bg-white text-black opacity-60'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Snooze Toggle & Duration */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-4">
                <label className="text-xs font-black text-black/40 uppercase tracking-widest">เลื่อนปลุก</label>
                <button
                  type="button"
                  onClick={() => setSnoozeEnabled(!snoozeEnabled)}
                  className={`w-12 h-12 rounded-2xl border-2 border-black flex items-center justify-center transition-all ${
                    snoozeEnabled ? 'bg-[#FFC1E3]' : 'bg-white'
                  }`}
                >
                  <i className={`fa-solid ${snoozeEnabled ? 'fa-bell' : 'fa-bell-slash'} text-black`}></i>
                </button>
              </div>
              
              {snoozeEnabled && (
                <div className="bg-white border-2 border-black rounded-[25px] p-4 flex items-center justify-between">
                  <span className="font-bold text-sm">เลื่อนทุกๆ</span>
                  <div className="flex items-center gap-4">
                    <input 
                      type="range" 
                      min="1" 
                      max="15" 
                      value={snoozeDuration}
                      onChange={(e) => setSnoozeDuration(parseInt(e.target.value))}
                      className="accent-black"
                    />
                    <span className="w-12 text-center font-black text-lg">{snoozeDuration}</span>
                    <span className="text-xs font-bold text-black/40">นาที</span>
                  </div>
                </div>
              )}
            </div>

            {/* Label */}
            <div className="space-y-2">
              <label className="text-xs font-black text-black/40 uppercase tracking-widest ml-4">ชื่อเรียก</label>
              <input 
                type="text" 
                value={label}
                placeholder="เช่น ตื่นไปวิ่ง..."
                onChange={(e) => setLabel(e.target.value)}
                className="w-full bg-white border-2 border-black rounded-[25px] px-6 py-4 focus:ring-0 outline-none font-medium text-black"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button 
                type="button" 
                onClick={onClose}
                className="flex-1 py-4 px-6 rounded-[25px] bg-white border-2 border-black text-black hover:bg-gray-100 transition-colors font-bold"
              >
                ยกเลิก
              </button>
              <button 
                type="submit" 
                className="flex-1 py-4 px-6 rounded-[25px] bg-black text-white hover:bg-gray-800 transition-colors font-bold shadow-[4px_4px_0px_0px_rgba(182,201,155,1)]"
              >
                บันทึก
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddAlarmModal;
