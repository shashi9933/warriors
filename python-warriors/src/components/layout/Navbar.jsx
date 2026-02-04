import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sword, Shield, Skull, Home } from 'lucide-react';
import { clsx } from 'clsx';
import { useTheme } from '../../context/ThemeContext';
import { useSound } from '../../context/SoundContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [themeMenuOpen, setThemeMenuOpen] = useState(false);
    const location = useLocation();
    const { currentTheme, toggleTheme } = useTheme();
    const { playSFX } = useSound();

    const navItems = [
        { name: 'Home', path: '/', icon: <Home size={20} /> },
        { name: 'War Room', path: '/war-room', icon: <Shield size={20} /> },
        { name: 'Battle Arena', path: '/battle-arena', icon: <Sword size={20} /> },
        { name: 'Dungeon', path: '/dungeon', icon: <Skull size={20} /> },
        { name: 'World Map', path: '/world', icon: <Home size={20} /> },
    ];

    const themes = [
        { id: 'neon-cyber', name: 'Neon Cyber', color: 'bg-cyan-500' },
        { id: 'robotic', name: 'Robotic', color: 'bg-blue-500' },
        { id: 'terminal', name: 'Terminal', color: 'bg-green-500' },
        { id: 'cyberpunk', name: 'Cyberpunk', color: 'bg-yellow-500' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-3 bg-deep-space/80 backdrop-blur-md border-b border-glass-border">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 bg-gradient-to-br from-neon-cyan to-blue-600 rounded-lg flex items-center justify-center shadow-neon-blue group-hover:scale-110 transition-transform">
                        <span className="font-orbitron font-bold text-white text-lg">W</span>
                    </div>
                    <span className="font-orbitron font-bold text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-magenta group-hover:text-neon-cyan transition-colors">
                        PYTHON WARRIORS
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-6">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => playSFX('CLICK')}
                            className={clsx(
                                "flex items-center gap-2 px-3 py-2 rounded-lg font-orbitron text-sm tracking-wide transition-all duration-300",
                                isActive(item.path)
                                    ? "bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30 shadow-[0_0_10px_rgb(var(--accent-primary)/0.2)]"
                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <span className={isActive(item.path) ? "animate-pulse" : ""}>{item.icon}</span>
                            {item.name}
                        </Link>
                    ))}

                    {/* Theme Selector */}
                    <div className="relative">
                        <button
                            onClick={() => setThemeMenuOpen(!themeMenuOpen)}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-neon-cyan/50 transition-colors"
                        >
                            <div className={`w-3 h-3 rounded-full ${themes.find(t => t.id === currentTheme)?.color || 'bg-neon-cyan'}`} />
                            <span className="text-xs font-orbitron text-gray-300">THEME</span>
                        </button>

                        {themeMenuOpen && (
                            <div className="absolute top-full right-0 mt-2 w-40 bg-deep-space border border-glass-border rounded-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                {themes.map(t => (
                                    <button
                                        key={t.id}
                                        onClick={() => { toggleTheme(t.id); setThemeMenuOpen(false); }}
                                        className={`w-full text-left px-4 py-2 text-xs font-orbitron flex items-center gap-2 hover:bg-white/10 ${currentTheme === t.id ? 'text-neon-cyan bg-white/5' : 'text-gray-400'}`}
                                    >
                                        <div className={`w-2 h-2 rounded-full ${t.color}`} />
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
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Navigation */}
            {isOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-deep-space/95 backdrop-blur-xl border-b border-glass-border animate-in slide-in-from-top-2">
                    <div className="flex flex-col p-4 gap-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsOpen(false)}
                                className={clsx(
                                    "flex items-center gap-3 px-4 py-3 rounded-lg font-orbitron text-base transition-all",
                                    isActive(item.path)
                                        ? "bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30"
                                        : "text-gray-400 hover:text-white hover:bg-white/5"
                                )}
                            >
                                {item.icon}
                                {item.name}
                            </Link>
                        ))}

                        <div className="border-t border-white/10 my-2 pt-2">
                            <span className="text-xs text-gray-500 px-4 mb-2 block">SELECT THEME</span>
                            <div className="grid grid-cols-2 gap-2 px-2">
                                {themes.map(t => (
                                    <button
                                        key={t.id}
                                        onClick={() => { toggleTheme(t.id); setIsOpen(false); }}
                                        className={`flex items-center gap-2 px-3 py-2 rounded border text-xs font-orbitron ${currentTheme === t.id ? 'border-neon-cyan text-neon-cyan bg-neon-cyan/10' : 'border-white/10 text-gray-400'}`}
                                    >
                                        <div className={`w-2 h-2 rounded-full ${t.color}`} />
                                        {t.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
