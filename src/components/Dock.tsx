import React, { useState } from 'react';
import { Terminal, Globe, Folder, Settings, Code, Mail } from 'lucide-react';
import { invoke } from '@tauri-apps/api/core';

const DOCK_APPS = [
  { id: 'browser', icon: Globe, name: 'Browser' },
  { id: 'terminal', icon: Terminal, name: 'Terminal' },
  { id: 'explorer', icon: Folder, name: 'Files' },
  { id: 'code', icon: Code, name: 'Code' },
  { id: 'mail', icon: Mail, name: 'Mail' },
  { id: 'settings', icon: Settings, name: 'Settings' },
];

const Dock: React.FC = () => {
  const [hoveredApp, setHoveredApp] = useState<string | null>(null);

  const handleLaunch = async (appName: string) => {
    try {
      await invoke('launch_app', { appName });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40">
      <div className="bg-slate-900/80 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-2 shadow-2xl flex items-center space-x-2">
        {DOCK_APPS.map((app) => (
          <div
            key={app.id}
            className="relative group flex items-center justify-center w-12 h-12 rounded-xl hover:bg-white/10 transition-all duration-200 cursor-pointer"
            onMouseEnter={() => setHoveredApp(app.id)}
            onMouseLeave={() => setHoveredApp(null)}
            onClick={() => handleLaunch(app.name)}
          >
            <app.icon className="text-slate-300 group-hover:text-white transition-colors duration-200" size={24} />

            {/* Tooltip */}
            {hoveredApp === app.id && (
              <div className="absolute -top-10 px-2 py-1 bg-slate-800 text-white text-xs rounded shadow-lg whitespace-nowrap border border-slate-700">
                {app.name}
              </div>
            )}

            {/* Active indicator dot mock */}
            {['browser', 'terminal'].includes(app.id) && (
              <div className="absolute -bottom-1 w-1 h-1 bg-blue-400 rounded-full shadow-[0_0_4px_rgba(96,165,250,0.8)]" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dock;