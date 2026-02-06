import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sword, Shield, Skull, Home, Volume2, VolumeX, Settings, Music, Zap, Radio, Map as MapIcon, BookOpen } from 'lucide-react';
import { clsx } from 'clsx';
import { useTheme } from '../../context/ThemeContext';
import { useSound } from '../../context/SoundContext';
import { usePlayer } from '../../context/PlayerContext';
import { getRank } from '../../data/achievements';

const SoundPanel = ({ onClose }) => {
    const {
        bgmVolume, setBgmVolume,
        sfxVolume, setSfxVolume,
        currentTrack, setCurrentTrack,
        bgmEnabled, toggleBGM
    } = useSound();

    return (
        <div className="absolute top-12 right-0 w-72 bg-black/90 backdrop-blur-xl border border-cyan-500/30 rounded-lg shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-cyan-900/20 p-3 border-b border-white/10 flex justify-between items-center">
                <span className="text-xs font-orbitron text-cyan-400 tracking-widest flex items-center gap-2">
                    <Settings size={14} /> AUDIO CONFIG
                </span>
                <button onClick={toggleBGM} className={`text-[10px] font-bold px-2 py-0.5 rounded ${bgmEnabled ? 'bg-cyan-500 text-black' : 'bg-red-500/20 text-red-400'}`}>
                    {bgmEnabled ? 'ONLINE' : 'OFFLINE'}
                </button>
            </div>

            {/* Channels */}
            <div className="p-4 space-y-4">
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
                                className={`text-[9px] font-bold py-1.5 rounded border transition-all ${currentTrack === track ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500' : 'bg-black text-gray-500 border-white/5 hover:border-white/20'}`}
                            >
                                {track}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [themeMenuOpen, setThemeMenuOpen] = useState(false);
    const [soundMenuOpen, setSoundMenuOpen] = useState(false);

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
        { id: 'light-mode', name: 'Light Protocol', color: 'bg-gray-200' },
        { id: 'void-neon', name: 'Void Neon', color: 'bg-black border border-theme-text' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="fixed top-0 left-0 right-0 z-[100] h-[50px] bg-[#050510] border-b border-white/10 flex items-center shadow-lg">
            <div className="w-full max-w-7xl mx-auto px-4 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-6 h-6 bg-gradient-to-br from-neon-cyan to-blue-600 rounded flex items-center justify-center shadow-neon-blue group-hover:scale-110 transition-transform">
                        <span className="font-orbitron font-bold theme-text text-xs">W</span>
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
                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <span className={isActive(item.path) ? "animate-pulse" : ""}>{item.icon}</span>
                            {item.name.toUpperCase()}
                        </Link>
                    ))}

                    <div className="h-4 w-px bg-white/10 mx-2" />

                    {/* Rank Badge */}
                    <div className="hidden lg:flex items-center gap-2 px-2 py-1 bg-theme-text/5 border border-theme-text/10 rounded">
                        <div className={`w-1.5 h-1.5 rounded-full ${getRank(playerData.level).color.replace('text-', 'bg-')}`} />
                        <span className="text-[10px] font-orbitron text-gray-300">
                            Lvl {playerData.level}
                        </span>
                    </div>

                    {/* Sound Settings */}
                    <div className="relative">
                        <button
                            onClick={() => setSoundMenuOpen(!soundMenuOpen)}
                            className={clsx(
                                "flex items-center justify-center w-8 h-8 rounded border transition-all duration-300",
                                bgmEnabled
                                    ? "bg-neon-cyan/10 border-neon-cyan text-neon-cyan shadow-[0_0_8px_rgba(6,182,212,0.2)]"
                                    : "bg-transparent border-white/10 text-gray-500 hover:text-white hover:border-white/30"
                            )}
                        >
                            {bgmEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
                        </button>
                        {soundMenuOpen && <SoundPanel onClose={() => setSoundMenuOpen(false)} />}
                    </div>

                    {/* Theme Selector */}
                    <div className="relative">
                        <button
                            onClick={() => setThemeMenuOpen(!themeMenuOpen)}
                            className="flex items-center justify-center w-8 h-8 rounded bg-transparent border border-white/10 hover:border-white/30 transition-colors"
                        >
                            <div className={`w-2.5 h-2.5 rounded-full ${themes.find(t => t.id === currentTheme)?.color || 'bg-neon-cyan'}`} />
                        </button>

                        {themeMenuOpen && (
                            <div className="absolute top-10 right-0 w-32 bg-deep-space border border-glass-border rounded-lg shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                                {themes.map(t => (
                                    <button
                                        key={t.id}
                                        onClick={() => { toggleTheme(t.id); setThemeMenuOpen(false); }}
                                        className={`w-full text-left px-3 py-2 text-[10px] font-orbitron flex items-center gap-2 hover:bg-white/5 ${currentTheme === t.id ? 'text-neon-cyan bg-white/5' : 'text-gray-400'}`}
                                    >
                                        <div className={`w-1.5 h-1.5 rounded-full ${t.color}`} />
                                        {t.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden text-gray-300 hover:text-white transition-colors"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Navigation */}
            {isOpen && (
                <div className="md:hidden absolute top-[50px] left-0 right-0 bg-[#050510] border-b border-white/20 animate-in slide-in-from-top-2 shadow-2xl z-50">
                    <div className="flex flex-col p-4 gap-2">
                        {/* User Info & Controls Row */}
                        <div className="flex justify-between items-center pb-4 mb-2 border-b border-white/10">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded">
                                <span className={`w-2 h-2 rounded-full ${getRank(playerData.level).color.replace('text-', 'bg-')}`} />
                                <span className="text-xs font-orbitron text-gray-300">
                                    Lvl {playerData.level}
                                </span>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => setSoundMenuOpen(!soundMenuOpen)}
                                    className={`w-8 h-8 rounded border flex items-center justify-center ${bgmEnabled ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500' : 'bg-black text-gray-400 border-white/20'}`}
                                >
                                    {bgmEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
                                </button>
                                <button
                                    onClick={() => setThemeMenuOpen(!themeMenuOpen)}
                                    className="w-8 h-8 rounded border border-white/20 bg-black flex items-center justify-center"
                                >
                                    <div className={`w-3 h-3 rounded-full ${themes.find(t => t.id === currentTheme)?.color || 'bg-neon-cyan'}`} />
                                </button>
                            </div>
                        </div>

                        {/* Sound Panel Mobile */}
                        {soundMenuOpen && (
                            <div className="mb-4 bg-black/50 p-4 rounded border border-white/10">
                                <SoundPanel onClose={() => setSoundMenuOpen(false)} />
                            </div>
                        )}

                        {/* Theme Panel Mobile */}
                        {themeMenuOpen && (
                            <div className="grid grid-cols-2 gap-2 mb-4 bg-black/50 p-4 rounded border border-white/10">
                                {themes.map(t => (
                                    <button
                                        key={t.id}
                                        onClick={() => { toggleTheme(t.id); setThemeMenuOpen(false); }}
                                        className={`p-2 text-[10px] font-orbitron flex items-center gap-2 rounded border ${currentTheme === t.id ? 'bg-cyan-900/40 text-cyan-400 border-cyan-500' : 'bg-black text-gray-400 border-white/10'}`}
                                    >
                                        <div className={`w-2 h-2 rounded-full ${t.color}`} />
                                        {t.name}
                                    </button>
                                ))}
                            </div>
                        )}

                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsOpen(false)}
                                className={clsx(
                                    "flex items-center gap-3 px-4 py-4 rounded-lg font-orbitron text-sm transition-all border",
                                    isActive(item.path)
                                        ? "bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30 shadow-[0_0_10px_rgba(6,182,212,0.1)]"
                                        : "bg-black/40 text-gray-400 border-white/5 hover:bg-white/5 hover:text-white"
                                )}
                            >
                                {item.icon}
                                {item.name.toUpperCase()}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
