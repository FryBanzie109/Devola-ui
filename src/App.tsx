import { useState, useEffect } from "react";
import Topbar from "./components/Topbar";
import Dock from "./components/Dock";
import Launcher from "./components/Launcher";
import MediaModule from "./components/MediaModule";
import SettingsPanel from "./components/SettingsPanel";
import { Settings } from "lucide-react";

function App() {
  const [isLauncherOpen, setIsLauncherOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Super/Meta key mock for Windows/Linux to open launcher
      if (e.key === 'Meta') {
        setIsLauncherOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Background desktop wallpaper
  const wallpaperStyle = {
    backgroundImage: 'url("https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  return (
    <div
      className="fixed inset-0 w-full h-full overflow-hidden"
      style={wallpaperStyle}
      onClick={() => {
        setIsSettingsOpen(false);
      }}
    >
      <div className="absolute inset-0 bg-black/20" /> {/* Dark overlay for readability */}

      <Topbar />

      {/* Mock Desktop Icon for visual completeness */}
      <div className="absolute top-12 left-4 flex flex-col space-y-4 text-center z-10">
         <div className="flex flex-col items-center group cursor-pointer" onDoubleClick={() => setIsSettingsOpen(true)}>
            <div className="w-12 h-12 bg-black/40 rounded-xl flex items-center justify-center text-white backdrop-blur-sm border border-white/10 group-hover:bg-black/60 transition-all">
                <Settings size={24} />
            </div>
            <span className="mt-1 text-xs text-white drop-shadow-md font-medium">Settings</span>
         </div>
      </div>

      <MediaModule />
      <Dock />

      {/* Floating Settings Button Mock to manually open launcher for users without Meta key */}
      <button
        className="fixed bottom-4 left-4 z-40 p-3 bg-slate-900/80 backdrop-blur-md rounded-xl text-white border border-slate-700 hover:bg-slate-800 transition-colors shadow-lg"
        onClick={(e) => {
          e.stopPropagation();
          setIsLauncherOpen(!isLauncherOpen);
        }}
      >
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-blue-500 rounded-sm" />
          <div className="w-2 h-2 bg-purple-500 rounded-sm" />
        </div>
        <div className="flex space-x-1 mt-1">
          <div className="w-2 h-2 bg-green-500 rounded-sm" />
          <div className="w-2 h-2 bg-yellow-500 rounded-sm" />
        </div>
      </button>

      <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <Launcher isOpen={isLauncherOpen} onClose={() => setIsLauncherOpen(false)} />
    </div>
  );
}

export default App;