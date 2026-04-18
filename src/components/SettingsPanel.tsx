import React, { useState } from 'react';
import { Settings, Monitor, Layout, Power, Moon, Sun } from 'lucide-react';
import { invoke } from '@tauri-apps/api/core';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const handleTileWindows = async () => {
    try {
      await invoke('tile_windows');
    } catch (e) {
      console.error(e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-12 left-4 w-72 bg-slate-900/90 backdrop-blur-md border border-slate-700/50 rounded-2xl shadow-xl overflow-hidden z-40 text-slate-200">
      <div className="flex items-center justify-between p-4 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <Settings size={18} className="text-slate-400" />
          <h2 className="text-sm font-semibold text-white">Quick Settings</h2>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors text-xs font-medium">Done</button>
      </div>

      <div className="p-4 space-y-4">
        {/* Network & Display */}
        <div className="grid grid-cols-2 gap-3">
          <button className="flex flex-col items-center justify-center py-3 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30 hover:bg-blue-600/30 transition-colors">
            <Monitor size={20} className="mb-1" />
            <span className="text-xs font-medium">Display</span>
          </button>

          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="flex flex-col items-center justify-center py-3 bg-slate-800 rounded-xl border border-slate-700 hover:bg-slate-700 transition-colors"
          >
            {theme === 'dark' ? <Moon size={20} className="mb-1 text-purple-400" /> : <Sun size={20} className="mb-1 text-amber-400" />}
            <span className="text-xs font-medium">Theme</span>
          </button>
        </div>

        {/* Tiling Window Manager */}
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Window Manager</p>
          <button
            onClick={handleTileWindows}
            className="w-full flex items-center p-3 bg-slate-800 rounded-xl border border-slate-700 hover:bg-slate-700 transition-colors group"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center mr-3 group-hover:bg-indigo-500/30 transition-colors">
              <Layout size={16} />
            </div>
            <div className="text-left flex-1">
              <div className="text-sm font-medium text-white">Tile Windows</div>
              <div className="text-xs text-slate-400">Auto-arrange active apps</div>
            </div>
          </button>
        </div>

        <div className="pt-2 border-t border-slate-800">
           <button className="w-full flex items-center justify-center p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
             <Power size={16} className="mr-2" />
             <span className="text-sm font-medium">Power Off</span>
           </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;