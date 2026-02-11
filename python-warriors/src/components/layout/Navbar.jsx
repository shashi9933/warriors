import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sword, Shield, Skull, Home, Volume2, VolumeX, Settings, Music, Zap, Radio, Map as MapIcon, BookOpen, User, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import { useTheme } from '../../context/ThemeContext';
import { useSound } from '../../context/SoundContext';
import { usePlayer } from '../../context/PlayerContext';
import { getRank } from '../../data/achievements';

const SoundPanelContent = ({ bgmVolume, setBgmVolume, sfxVolume, setSfxVolume, currentTrack, setCurrentTrack, bgmEnabled, toggleBGM }) => {
    return (
        <div className="p-4 space-y-4">
            {/* Header with Toggle */}
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
                <span className="text-xs font-orbitron text-cyan-400 tracking-widest flex items-center gap-2">
                    <Settings size={14} /> AUDIO CONFIG
                </span>
                <button
                    onClick={toggleBGM}
                    className={`relative w-10 h-5 rounded-full transition-colors duration-300 ${bgmEnabled ? 'bg-cyan-500' : 'bg-gray-700'}`}
                >
                    <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform duration-300 ${bgmEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
            </div>

            {/* BGM Vol */}
            <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-400 font-mono">
                    <span className="flex items-center gap-1"><Music size={12} /> MUSIC VOL</span>
                    <span>{Math.round(bgmVolume * 100)}%</span>
                </div>
                <input
                    type="range" min="0" max="1" step="0.05"
                    value={bgmVolume}
                    onChange={(e) => setBgmVolume(parseFloat(e.target.value))}
                    className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
            </div>

            {/* SFX Vol */}
            <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-400 font-mono">
                    <span className="flex items-center gap-1"><Zap size={12} /> SFX VOL</span>
                    <span>{Math.round(sfxVolume * 100)}%</span>
                </div>
                <input
                    type="range" min="0" max="1" step="0.05"
                    value={sfxVolume}
                    onChange={(e) => setSfxVolume(parseFloat(e.target.value))}
                    className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
            </div>

            {/* Track Selector */}
            <div className="pt-2 border-t border-white/10">
                <div className="text-[10px] text-gray-500 font-mono mb-2 flex items-center gap-1"><Radio size={12} /> FREQUENCY SELECTOR</div>
                <div className="grid grid-cols-3 gap-1">
                    {['CYBER', 'INDUSTRIAL', 'AMBIENT'].map(track => (
                        <button
                            key={track}
                            onClick={() => setCurrentTrack(track)}
                            className={`text-[9px] font-bold py-1.5 rounded border transition-all ${currentTrack === track ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500' : 'bg-transparent text-gray-500 border-white/5 hover:border-white/20'}`}
                        >
                            {track}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

const SoundPanel = () => {
    const soundProps = useSound();

    return (
        <div className="absolute top-12 right-0 w-72 bg-black/90 backdrop-blur-xl border border-glass-border rounded-lg shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-cyan-900/20 p-1" /> {/* Decorative Top Bar */}
            <SoundPanelContent {...soundProps} />
        </div>
    );
};

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [themeMenuOpen, setThemeMenuOpen] = useState(false);
    const [soundMenuOpen, setSoundMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);

    const location = useLocation();
    const { currentTheme, toggleTheme } = useTheme();
    const { playSFX, bgmEnabled } = useSound();
    const { playerData } = usePlayer();

    const navItems = [
        { name: 'Home', path: '/', icon: <Home size={16} /> },
        { name: 'Campaign', path: '/world', icon: <MapIcon size={16} /> },
        { name: 'Academy', path: '/academy', icon: <BookOpen size={16} /> },
        { name: 'Arena', path: '/battle-arena', icon: <Sword size={16} /> },
        { name: 'War Room', path: '/war-room', icon: <Shield size={16} /> },
    ];

    const themes = [
        { id: 'neon-cyber', name: 'Neon Cyber', color: 'bg-cyan-500' },
        { id: 'robotic', name: 'Robotic', color: 'bg-blue-500' },
        { id: 'terminal', name: 'Terminal', color: 'bg-green-500' },
        { id: 'cyberpunk', name: 'Cyberpunk', color: 'bg-yellow-500' },

        { id: 'void-neon', name: 'Void Neon', color: 'bg-black border border-theme-text' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="fixed top-0 left-0 right-0 z-[100] h-[50px] bg-theme-bg/90 backdrop-blur-md border-b border-glass-border flex items-center shadow-lg transition-colors duration-500">
            <div className="w-full max-w-7xl mx-auto px-4 flex justify-between items-center">

                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-6 h-6 bg-gradient-to-br from-neon-cyan to-blue-600 rounded flex items-center justify-center shadow-neon-blue group-hover:scale-110 transition-transform">
                        <span className="font-orbitron font-bold text-white text-xs">W</span>
                    </div>
                    <span className="font-orbitron font-bold text-sm tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-magenta group-hover:text-neon-cyan transition-colors hidden sm:inline">
                        PYTHON WARRIORS
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => playSFX('CLICK')}
                            className={clsx(
                                "flex items-center gap-1.5 px-3 py-1.5 rounded text-[10px] font-orbitron tracking-wider transition-all duration-300",
                                isActive(item.path)
                                    ? "bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30 shadow-[0_0_8px_rgba(6,182,212,0.2)]"
                                    : "text-theme-text/60 hover:text-theme-text hover:bg-theme-text/5"
                            )}
                        >
                            <span className={isActive(item.path) ? "animate-pulse" : ""}>{item.icon}</span>
                            {item.name.toUpperCase()}
                        </Link>
                    ))}

                    <div className="h-4 w-px bg-theme-text/20 mx-2" />

                    {/* Right Side Icons Group */}
                    <div className="flex items-center gap-3">

                        {/* Sound Button */}
                        <div className="relative">
                            <button
                                onClick={() => setSoundMenuOpen(!soundMenuOpen)}
                                className={clsx(
                                    "flex items-center justify-center w-8 h-8 rounded border transition-all duration-300",
                                    bgmEnabled
                                        ? "bg-neon-cyan/10 border-neon-cyan text-neon-cyan"
                                        : "bg-transparent border-theme-text/20 text-theme-text/60 hover:text-theme-text hover:border-theme-text/40"
                                )}
                                title="Sound Settings"
                            >
                                {bgmEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
                            </button>
                            {soundMenuOpen && <SoundPanel onClose={() => setSoundMenuOpen(false)} />}
                        </div>

                        {/* Theme Button */}
                        <div className="relative">
                            <button
                                onClick={() => setThemeMenuOpen(!themeMenuOpen)}
                                className="flex items-center justify-center w-8 h-8 rounded bg-transparent border border-theme-text/20 hover:border-theme-text/40 transition-colors"
                                title="Theme Selector"
                            >
                                <div className={`w-2.5 h-2.5 rounded-full ${themes.find(t => t.id === currentTheme)?.color || 'bg-neon-cyan'}`} />
                            </button>

                            {themeMenuOpen && (
                                <div className="absolute top-10 right-0 w-32 bg-theme-bg border border-glass-border rounded-lg shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                                    {themes.map(t => (
                                        <button
                                            key={t.id}
                                            onClick={() => { toggleTheme(t.id); setThemeMenuOpen(false); }}
                                            className={`w-full text-left px-3 py-2 text-[10px] font-orbitron flex items-center gap-2 hover:bg-theme-text/10 ${currentTheme === t.id ? 'text-neon-cyan bg-theme-text/5' : 'text-theme-text/70'}`}
                                        >
                                            <div className={`w-1.5 h-1.5 rounded-full ${t.color}`} />
                                            {t.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Settings Button */}
                        <div className="relative">
                            <button
                                onClick={() => setSettingsOpen(!settingsOpen)}
                                className="flex items-center justify-center w-8 h-8 rounded bg-transparent border border-theme-text/20 text-theme-text/60 hover:text-theme-text hover:border-theme-text/40 transition-colors"
                                title="Game Settings"
                            >
                                <Settings size={14} />
                            </button>
                            {/* Settings Dropdown Placeholder */}
                            {settingsOpen && (
                                <div className="absolute top-10 right-0 w-48 bg-theme-bg border border-glass-border rounded-lg shadow-xl p-3 z-50 text-theme-text">
                                    <div className="text-xs font-bold border-b border-theme-text/10 pb-2 mb-2">SETTINGS</div>
                                    <div className="space-y-2 text-[10px]">
                                        <div className="flex justify-between items-center cursor-pointer hover:text-neon-cyan">
                                            <span>Notifications</span>
                                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                        </div>
                                        <div className="flex justify-between items-center cursor-pointer hover:text-neon-cyan">
                                            <span>Graphics Quality</span>
                                            <span className="text-neon-cyan">HIGH</span>
                                        </div>
                                        <div className="flex justify-between items-center cursor-pointer hover:text-neon-cyan">
                                            <span>Account</span>
                                            <ChevronRight size={10} />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Profile Button */}
                        <div className="relative">
                            <button
                                onClick={() => setProfileOpen(!profileOpen)}
                                className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-theme-text/20 bg-theme-text/5 hover:bg-theme-text/10 transition-all"
                            >
                                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-[10px] text-white font-bold ring-2 ring-black">
                                    {playerData.level}
                                </div>
                                <span className="text-xs font-orbitron text-theme-text hidden lg:inline">
                                    PROFILER
                                </span>
                            </button>

                            {profileOpen && (
                                <div className="absolute top-12 right-0 w-64 bg-theme-bg border border-glass-border rounded-lg shadow-2xl p-4 z-50 text-theme-text">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 rounded bg-gradient-to-br from-neon-cyan to-blue-600 flex items-center justify-center">
                                            <User size={24} className="text-white" />
                                        </div>
                                        <div>
                                            <div className="font-bold font-orbitron text-sm">LOOP KNIGHT</div>
                                            <div className="text-[10px] text-theme-text/60">Level {playerData.level} Architect</div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 mb-3">
                                        <div className="bg-theme-text/5 p-2 rounded text-center">
                                            <div className="text-[10px] text-theme-text/50">XP</div>
                                            <div className="font-mono text-xs font-bold text-neon-cyan">1250</div>
                                        </div>
                                        <div className="bg-theme-text/5 p-2 rounded text-center">
                                            <div className="text-[10px] text-theme-text/50">GOLD</div>
                                            <div className="font-mono text-xs font-bold text-yellow-500">500</div>
                                        </div>
                                    </div>
                                    <button className="w-full py-1.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded text-xs hover:bg-red-500/20">
                                        LOGOUT
                                    </button>
                                </div>
                            )}
                        </div>

                    </div>
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden text-theme-text hover:text-neon-cyan transition-colors"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Navigation Drawer */}
            {isOpen && (
                <div className="md:hidden absolute top-[50px] left-0 right-0 bg-theme-bg border-b border-glass-border animate-in slide-in-from-top-2 shadow-2xl z-50 h-screen">
                    <div className="flex flex-col p-4 gap-4">

                        {/* Mobile User Profile */}
                        <div className="flex items-center gap-4 p-4 bg-theme-text/5 rounded-lg border border-theme-text/10">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
                                {playerData.level}
                            </div>
                            <div className="flex-1">
                                <div className="font-bold text-theme-text font-orbitron">LOOP KNIGHT</div>
                                <div className="text-xs text-theme-text/60">Level {playerData.level} Warrior</div>
                            </div>
                            <button className="p-2 text-theme-text/60 hover:text-theme-text">
                                <Settings size={20} />
                            </button>
                        </div>

                        {/* Mobile Controls Grid */}
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setThemeMenuOpen(!themeMenuOpen)}
                                className="flex items-center justify-between p-3 rounded bg-theme-text/5 border border-theme-text/10 text-theme-text"
                            >
                                <span className="text-xs font-orbitron">THEME</span>
                                <div className={`w-3 h-3 rounded-full ${themes.find(t => t.id === currentTheme)?.color}`} />
                            </button>
                            <button
                                onClick={() => setSoundMenuOpen(!soundMenuOpen)}
                                className="flex items-center justify-between p-3 rounded bg-theme-text/5 border border-theme-text/10 text-theme-text"
                            >
                                <span className="text-xs font-orbitron">AUDIO</span>
                                {bgmEnabled ? <Volume2 size={14} className="text-neon-cyan" /> : <VolumeX size={14} />}
                            </button>
                        </div>

                        {/* Sound Panel Mobile */}
                        {soundMenuOpen && (
                            <div className="mb-4 bg-theme-bg/50 p-2 rounded border border-theme-text/10">
                                <SoundPanelContent
                                    bgmVolume={useSound().bgmVolume}
                                    setBgmVolume={useSound().setBgmVolume}
                                    sfxVolume={useSound().sfxVolume}
                                    setSfxVolume={useSound().setSfxVolume}
                                    currentTrack={useSound().currentTrack}
                                    setCurrentTrack={useSound().setCurrentTrack}
                                    bgmEnabled={useSound().bgmEnabled}
                                    toggleBGM={useSound().toggleBGM}
                                />
                            </div>
                        )}

                        {/* Theme Panel Mobile */}
                        {themeMenuOpen && (
                            <div className="grid grid-cols-2 gap-2 bg-black/20 p-3 rounded border border-white/5">
                                {themes.map(t => (
                                    <button
                                        key={t.id}
                                        onClick={() => { toggleTheme(t.id); setThemeMenuOpen(false); }}
                                        className={`p-2 text-[10px] font-orbitron flex items-center gap-2 rounded border transition-colors ${currentTheme === t.id ? 'bg-neon-cyan/20 text-neon-cyan border-neon-cyan/50' : 'bg-transparent text-theme-text/60 border-theme-text/10'}`}
                                    >
                                        <div className={`w-2 h-2 rounded-full ${t.color}`} />
                                        {t.name}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Nav Items */}
                        <div className="space-y-2 mt-2">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsOpen(false)}
                                    className={clsx(
                                        "flex items-center gap-3 px-4 py-3 rounded-lg font-orbitron text-sm transition-all border",
                                        isActive(item.path)
                                            ? "bg-neon-cyan/10 text-neon-cyan border-neon-cyan/30"
                                            : "bg-transparent text-theme-text/60 border-transparent hover:bg-theme-text/5 hover:text-theme-text"
                                    )}
                                >
                                    {item.icon}
                                    {item.name.toUpperCase()}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
