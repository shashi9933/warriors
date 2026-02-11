import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, Volume2, VolumeX, Settings, Music, Zap, Radio, BookOpen, User, Target, Trophy, Briefcase, Globe, Terminal, Award, Monitor, ChevronDown, Palette } from 'lucide-react';
import { clsx } from 'clsx';
import { useTheme } from '../../context/ThemeContext';
import { useSound } from '../../context/SoundContext';
import { usePlayer } from '../../context/PlayerContext';

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
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [soundMenuOpen, setSoundMenuOpen] = useState(false);
    const [themeMenuOpen, setThemeMenuOpen] = useState(false);
    const [rankingsOpen, setRankingsOpen] = useState(false);

    const location = useLocation();
    const { currentTheme, toggleTheme } = useTheme();
    const { playSFX, bgmEnabled } = useSound();
    const { playerData } = usePlayer();

    // Flattened & Reordered Navigation
    const mainNavItems = [
        { name: 'Nexus', path: '/', icon: <Home size={14} /> },
        { name: 'Academy', path: '/academy', icon: <BookOpen size={14} /> },
        { name: 'Terminal', path: '/terminal', icon: <Terminal size={14} /> },
        { name: 'Arena', path: '/arena', icon: <Monitor size={14} /> },
        { name: 'Directives', path: '/directives', icon: <Target size={14} /> },
        { name: 'World', path: '/world', icon: <Globe size={14} /> },
        { name: 'Projects', path: '/operations', icon: <Briefcase size={14} /> },
    ];

    const rankingItems = [
        { name: 'Leaderboard', path: '/leaderboard', icon: <Trophy size={14} /> },
        { name: 'Honors', path: '/honors', icon: <Award size={14} /> },
    ];

    const themes = [
        { id: 'neon-cyber', name: 'Neon Cyber', color: 'bg-cyan-500' },
        { id: 'robotic', name: 'Robotic', color: 'bg-blue-500' },
        { id: 'terminal', name: 'Terminal', color: 'bg-green-500' },
        { id: 'cyberpunk', name: 'Cyberpunk', color: 'bg-yellow-500' },
        { id: 'void-neon', name: 'Void Neon', color: 'bg-black border border-theme-text' },
    ];

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location]);

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
                className={clsx(
                    "fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 backdrop-blur-md",
                    scrolled ? "bg-black/90 border-white/10 py-2" : "bg-transparent border-transparent py-4"
                )}
            >
                {/* Full width container, adjusted left margin/padding */}
                <div className="w-full px-4 md:px-8">
                    <div className="flex justify-between items-center relative">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2 group mr-8" onClick={() => playSFX('UI_CLICK')}>
                            <div className="w-8 h-8 md:w-10 md:h-10 border border-theme-text/50 bg-theme-text/10 rounded flex items-center justify-center group-hover:bg-theme-text/20 transition-all relative overflow-hidden">
                                <Terminal size={20} className="text-theme-text relative z-10" />
                                <div className="absolute inset-0 bg-theme-text/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-orbitron font-bold text-lg md:text-xl tracking-wider text-white">
                                    CODE<span className="text-theme-text">WARRIORS</span>
                                </span>
                                <span className="text-[10px] text-gray-400 font-mono tracking-[0.2em] hidden md:block">SYSTEM.V2.0</span>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center gap-1 xl:gap-2 flex-1">
                            {mainNavItems.map((item) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <Link
                                        key={item.name}
                                        to={item.path}
                                        onClick={() => playSFX('UI_HOVER')}
                                        className={clsx(
                                            "relative px-3 py-2 rounded text-xs font-medium font-orbitron tracking-wide transition-all duration-300 flex items-center gap-2 group/link",
                                            isActive
                                                ? "text-theme-text bg-theme-text/10 shadow-[0_0_10px_rgba(var(--theme-rgb),0.2)]"
                                                : "text-gray-400 hover:text-white hover:bg-white/5"
                                        )}
                                    >
                                        <span className={clsx("transition-colors", isActive ? "text-theme-text" : "text-gray-500 group-hover/link:text-gray-300")}>
                                            {item.icon}
                                        </span>
                                        <span className="whitespace-nowrap">{item.name}</span>

                                        {isActive && (
                                            <motion.div
                                                layoutId="navIndicator"
                                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-theme-text shadow-[0_0_8px_rgba(var(--theme-rgb),0.8)]"
                                                initial={false}
                                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                            />
                                        )}
                                    </Link>
                                );
                            })}

                            {/* Rankings Dropdown */}
                            <div className="relative relative-group" onMouseEnter={() => setRankingsOpen(true)} onMouseLeave={() => setRankingsOpen(false)}>
                                <button className={clsx(
                                    "relative px-3 py-2 rounded text-xs font-medium font-orbitron tracking-wide transition-all duration-300 flex items-center gap-2 text-gray-400 hover:text-white hover:bg-white/5",
                                    rankingsOpen && "bg-white/5 text-white"
                                )}>
                                    <Trophy size={14} className="text-gray-500" />
                                    <span>RANKS</span>
                                    <ChevronDown size={12} className={`transition-transform duration-200 ${rankingsOpen ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {rankingsOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute top-full left-0 mt-1 w-40 bg-black/90 border border-white/10 rounded-lg shadow-xl overflow-hidden backdrop-blur-md"
                                        >
                                            {rankingItems.map(item => (
                                                <Link
                                                    key={item.name}
                                                    to={item.path}
                                                    className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors text-xs font-orbitron text-gray-300 hover:text-white"
                                                    onClick={() => setRankingsOpen(false)}
                                                >
                                                    {item.icon}
                                                    {item.name}
                                                </Link>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Right Side: Settings & Profile */}
                        <div className="hidden md:flex items-center gap-4">
                            {/* Theme Cycle Button */}
                            <button
                                onClick={() => {
                                    // Cycles through themes
                                    const currentIndex = themes.findIndex(t => t.id === currentTheme);
                                    const nextIndex = (currentIndex + 1) % themes.length;
                                    toggleTheme(themes[nextIndex].id);
                                    playSFX('UI_CLICK');
                                }}
                                className="text-gray-400 hover:text-theme-text transition-colors p-2 rounded-full hover:bg-white/5 relative group"
                                title="Cycle Theme"
                            >
                                <Palette size={18} />
                                <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${themes.find(t => t.id === currentTheme)?.color} shadow-[0_0_5px_currentColor]`} />
                            </button>

                            {/* Audio Toggle */}
                            <button className="text-gray-400 hover:text-theme-text transition-colors p-2 rounded-full hover:bg-white/5" onClick={() => { toggleBGM(); playSFX('UI_CLICK'); }}>
                                {bgmEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                            </button>

                            {/* Settings Toggle */}
                            <button
                                onClick={() => setShowSettings(!showSettings)}
                                className={clsx("p-2 rounded-full transition-all", showSettings ? "text-theme-text bg-white/10" : "text-gray-400 hover:text-white")}
                            >
                                <Settings size={20} className={showSettings ? "animate-spin-slow" : ""} />
                            </button>

                            {/* Profile Snippet */}
                            <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                                <div className="text-right hidden xl:block">
                                    <div className="text-xs font-bold text-white font-orbitron">{playerData?.name || "GUEST"}</div>
                                    <div className="text-[10px] text-gray-500 font-mono">Lvl {playerData?.level || 1}</div>
                                </div>
                                <div className="w-8 h-8 rounded bg-gradient-to-br from-gray-800 to-black border border-white/20 flex items-center justify-center relative">
                                    <User size={16} className="text-gray-300" />
                                    <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full border border-black shadow-[0_0_5px_rgba(34,197,94,0.8)]" />
                                </div>
                            </div>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="lg:hidden flex items-center gap-4">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="text-gray-300 hover:text-white p-2"
                            >
                                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.nav>

            {/* Settings Panel Desktop */}
            <AnimatePresence>
                {showSettings && <SoundPanel />}
            </AnimatePresence>

            {/* Mobile Navigation Drawer */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -100 }}
                        transition={{ duration: 0.3 }}
                        className="md:hidden fixed top-[70px] left-0 right-0 bg-black/95 border-b border-white/10 backdrop-blur-xl shadow-2xl z-40 overflow-y-auto max-h-[calc(100vh-70px)]"
                    >
                        <div className="flex flex-col p-4 gap-4">
                            <div className="flex items-center gap-4 p-4 bg-theme-text/5 rounded-lg border border-theme-text/10">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
                                    {playerData.level}
                                </div>
                                <div className="flex-1">
                                    <div className="font-bold text-theme-text font-orbitron">LOOP KNIGHT</div>
                                    <div className="text-xs text-theme-text/60">Level {playerData.level} Warrior</div>
                                </div>
                            </div>

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
                            <div className="space-y-1 mt-2">
                                {mainNavItems.map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={clsx(
                                            "flex items-center gap-3 px-4 py-3 rounded-lg font-orbitron text-sm transition-all border",
                                            location.pathname === item.path
                                                ? "bg-theme-text/10 text-theme-text border-theme-text/30"
                                                : "bg-transparent text-gray-400 border-transparent hover:bg-white/5 hover:text-white"
                                        )}
                                    >
                                        <span>{item.icon}</span>
                                        <span>{item.name}</span>
                                    </Link>
                                ))}
                                {rankingItems.map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={clsx(
                                            "flex items-center gap-3 px-4 py-3 rounded-lg font-orbitron text-sm transition-all border",
                                            location.pathname === item.path
                                                ? "bg-theme-text/10 text-theme-text border-theme-text/30"
                                                : "bg-transparent text-gray-400 border-transparent hover:bg-white/5 hover:text-white"
                                        )}
                                    >
                                        <span>{item.icon}</span>
                                        <span>{item.name}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
