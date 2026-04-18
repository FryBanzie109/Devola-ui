import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { invoke } from '@tauri-apps/api/core';

interface AppInfo {
  name: string;
  icon: string;
  path: string;
}

interface LauncherProps {
  isOpen: boolean;
  onClose: () => void;
}

const Launcher: React.FC<LauncherProps> = ({ isOpen, onClose }) => {
  const [apps, setApps] = useState<AppInfo[]>([]);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      invoke<AppInfo[]>('get_apps')
        .then(setApps)
        .catch(console.error);
      setSearch('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const filteredApps = apps.filter((app) =>
    app.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredApps.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredApps.length) % (filteredApps.length || 1));
    } else if (e.key === 'Enter' && filteredApps.length > 0) {
      handleLaunch(filteredApps[selectedIndex].name);
    }
  };

  const handleLaunch = async (appName: string) => {
    try {
      await invoke('launch_app', { appName });
      onClose();
    } catch (e) {
      console.error(e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-lg bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center px-4 py-3 border-b border-slate-800">
          <Search className="text-slate-400 mr-3" size={20} />
          <input
            ref={inputRef}
            type="text"
            className="w-full bg-transparent border-none outline-none text-white placeholder-slate-500 text-lg"
            placeholder="Search apps..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="max-h-80 overflow-y-auto py-2">
          {filteredApps.length > 0 ? (
            filteredApps.map((app, index) => (
              <div
                key={app.name}
                className={`flex items-center px-4 py-3 mx-2 rounded-lg cursor-pointer transition-colors ${
                  index === selectedIndex ? 'bg-blue-600/30 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
                onClick={() => handleLaunch(app.name)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className="w-8 h-8 rounded-md bg-slate-800 flex items-center justify-center mr-3 border border-slate-700">
                   {/* Mock icon using first letter since dynamic icons are complex without real SVG sets */}
                   <span className="font-bold text-slate-400">{app.name.charAt(0)}</span>
                </div>
                <span className="text-sm font-medium">{app.name}</span>
              </div>
            ))
          ) : (
            <div className="px-4 py-6 text-center text-slate-500 text-sm">
              No applications found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Launcher;