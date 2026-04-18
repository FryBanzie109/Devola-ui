import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Volume2 } from 'lucide-react';

const Topbar: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-0 w-full h-8 bg-slate-900/90 text-slate-300 flex items-center justify-between px-4 text-xs font-medium z-50 backdrop-blur-md border-b border-slate-700/50 shadow-md select-none">
      <div className="flex items-center space-x-4">
        <span className="font-bold text-slate-100 cursor-pointer hover:text-white transition-colors">Devola</span>
        <span className="hidden sm:inline-block hover:text-white cursor-pointer transition-colors">Activities</span>
      </div>

      <div className="flex-1 flex justify-center">
        <span className="hover:text-white cursor-pointer transition-colors px-2 py-1 rounded-md hover:bg-slate-800/50">
          {time.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })} {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 cursor-pointer hover:text-white hover:bg-slate-800/50 px-2 py-1 rounded-md transition-colors">
          <Wifi size={14} />
          <Volume2 size={14} />
          <Battery size={14} />
        </div>
      </div>
    </div>
  );
};

export default Topbar;