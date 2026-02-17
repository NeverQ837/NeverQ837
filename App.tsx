
import React, { useState, useEffect, useCallback } from 'react';
import { Alarm } from './types';
import ClockFace from './components/ClockFace';
import AlarmItem from './components/AlarmItem';
import AddAlarmModal from './components/AddAlarmModal';
import ScheduleView from './components/ScheduleView';
import { getSleepAdvice } from './services/geminiService';

const App: React.FC = () => {
  const [alarms, setAlarms] = useState<Alarm[]>(() => {
    const saved = localStorage.getItem('deeprest_alarms');
    return saved ? JSON.parse(saved) : [
      { 
        id: '1', 
        time: '07:00', 
        label: 'ตื่นเช้ามาดื่มน้ำ', 
        isActive: true, 
        repeat: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        sound: 'นกทักทาย',
        snoozeEnabled: true,
        snoozeDuration: 5
      },
    ];
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [advice, setAdvice] = useState<string>("คืนนี้ไม่ต้องเก่ง ไม่ต้องเข้มแข็ง ไม่ต้องคิดหาคำตอบให้ทุกเรื่อง ปล่อยให้หัวใจได้พัก เหมือนท้องฟ้าที่ค่อย ๆ เปลี่ยนเป็นสีเข้มเมื่อถึงเวลา...");
  const [isAdviceLoading, setIsAdviceLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'schedule'>('home');

  // ระบบสั่น
  const hapticFeedback = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(60);
    }
  };

  useEffect(() => {
    localStorage.setItem('deeprest_alarms', JSON.stringify(alarms));
  }, [alarms]);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  const refreshAdvice = useCallback(async () => {
    if (isAdviceLoading) return;
    hapticFeedback();
    setIsAdviceLoading(true);
    const now = new Date();
    const hours = now.getHours();
    const isMorning = hours >= 5 && hours < 12;
    const timeStr = now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
    
    const newAdvice = await getSleepAdvice(timeStr, isMorning);
    setAdvice(newAdvice);
    setIsAdviceLoading(false);
  }, [isAdviceLoading]);

  useEffect(() => {
    // Initial fetch if needed, but we have a default warm message
    const timer = setTimeout(() => {
      // Small delay before first refresh to show the nice default text
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const toggleAlarm = (id: string) => {
    hapticFeedback();
    setAlarms(prev => prev.map(a => a.id === id ? { ...a, isActive: !a.isActive } : a));
  };

  const deleteAlarm = (id: string) => {
    hapticFeedback();
    setAlarms(prev => prev.filter(a => a.id !== id));
  };

  const addAlarm = (time: string, label: string, repeat: string[], sound: string, snoozeEnabled: boolean, snoozeDuration: number) => {
    hapticFeedback();
    const newAlarm: Alarm = {
      id: Date.now().toString(),
      time,
      label: label || 'นาฬิกาปลุก',
      isActive: true,
      repeat,
      sound,
      snoozeEnabled,
      snoozeDuration
    };
    setAlarms(prev => [...prev, newAlarm].sort((a, b) => a.time.localeCompare(b.time)));
  };

  return (
    <div className={`min-h-screen flex flex-col p-6 md:p-12 pb-32 transition-colors duration-500`}>
      {/* App Header */}
      <header className="flex items-center justify-between mb-6">
        <button 
          onClick={() => { hapticFeedback(); setCurrentView('home'); }}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-white text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:scale-105 active:scale-95 transition-all"
        >
          <i className="fa-solid fa-chevron-left"></i>
        </button>
        <h1 className="text-xl font-black heading-font">DeepRest</h1>
        <div className="w-12 h-12" /> 
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-2xl mx-auto w-full">
        {currentView === 'home' ? (
          <>
            {/* Discover Section */}
            <section className="mb-10 text-center md:text-left">
              <h2 className="text-[48px] font-black leading-tight heading-font mb-2">
                พักผ่อน, สร้างแรงใจ, สนุก
              </h2>
              <p className="opacity-60 font-medium">ทำงานหนักแล้ว อย่าลืมพักผ่อนให้เพียงพอนะ</p>
            </section>

            {/* AI Advice Card (The Heartbeat of the App) */}
            <div 
              className="mb-12 relative group cursor-pointer" 
              onClick={refreshAdvice}
            >
              <div className="absolute inset-0 bg-[#ADC5E8] rounded-[40px] border-4 border-black translate-x-1 translate-y-1"></div>
              <div className={`relative ${isDarkMode ? 'bg-[#1D2D50]' : 'bg-[#FFF089]'} p-8 md:p-12 rounded-[40px] border-4 border-black flex flex-col items-center text-center transition-all duration-500 hover:-translate-y-1`}>
                <div className={`w-14 h-14 bg-white border-2 border-black rounded-full flex items-center justify-center mb-6 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${isAdviceLoading ? 'animate-bounce' : 'animate-pulse'}`}>
                  <i className={`fa-solid fa-heart text-red-400`}></i>
                </div>
                <div className={`transition-opacity duration-300 ${isAdviceLoading ? 'opacity-30' : 'opacity-100'}`}>
                  <p className="text-xl md:text-2xl font-bold leading-relaxed text-black/80">
                    {advice}
                  </p>
                </div>
                <div className="mt-6 text-[10px] font-black uppercase tracking-widest opacity-30">
                  <i className="fa-solid fa-hand-pointer mr-1"></i> แตะเพื่อเปลี่ยนคำอวยพร
                </div>
              </div>
            </div>

            {/* Alarms List */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black heading-font">กิจกรรมของคุณ</h3>
                <button 
                  onClick={() => hapticFeedback()}
                  className="text-sm font-bold border-b-2 border-current pb-1"
                >จัดการทั้งหมด</button>
              </div>

              <div className="space-y-4">
                {alarms.map((alarm, idx) => (
                  <AlarmItem 
                    key={alarm.id} 
                    alarm={alarm} 
                    index={idx}
                    onToggle={toggleAlarm} 
                    onDelete={deleteAlarm} 
                  />
                ))}
              </div>
            </section>

            {/* Clock View */}
            <div className="mt-16">
              <ClockFace />
            </div>
          </>
        ) : (
          <ScheduleView alarms={alarms} />
        )}
      </main>

      {/* Floating Bottom Navigation */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-black rounded-[40px] p-2 flex items-center justify-between shadow-[0_10px_40px_rgba(0,0,0,0.5)] border-2 border-white/20 z-50">
        <button 
          onClick={() => { hapticFeedback(); setCurrentView('home'); }}
          className={`flex-1 flex justify-center py-4 transition-colors ${currentView === 'home' ? 'text-[#FFC1E3]' : 'text-white/50'}`}
        >
          <i className="fa-solid fa-house-chimney text-xl"></i>
        </button>
        <button 
          onClick={() => { hapticFeedback(); setIsDarkMode(!isDarkMode); }}
          className={`flex-1 flex justify-center py-4 transition-colors ${isDarkMode ? 'text-[#64FFDA]' : 'text-white/50'}`}
        >
          <i className={`fa-solid ${isDarkMode ? 'fa-sun' : 'fa-moon'} text-xl`}></i>
        </button>
        
        {/* Central Plus Button */}
        <button 
          onClick={() => { hapticFeedback(); setIsModalOpen(true); }}
          className="w-16 h-16 bg-white rounded-full border-4 border-black flex items-center justify-center -mt-10 shadow-lg hover:scale-110 active:scale-95 transition-all"
        >
          <i className="fa-solid fa-plus text-black text-2xl"></i>
        </button>

        <button 
          onClick={() => hapticFeedback()}
          className="flex-1 flex justify-center py-4 text-white/50 hover:text-[#FFC1E3] transition-colors"
        >
          <i className="fa-solid fa-bell text-xl"></i>
        </button>
        <button 
          onClick={() => { hapticFeedback(); setCurrentView('schedule'); }}
          className={`flex-1 flex justify-center py-4 transition-colors ${currentView === 'schedule' ? 'text-[#FFC1E3]' : 'text-white/50'}`}
        >
          <i className="fa-solid fa-user text-xl"></i>
        </button>
      </nav>

      {/* Modal for adding alarms */}
      <AddAlarmModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={addAlarm} 
      />
    </div>
  );
};

export default App;
