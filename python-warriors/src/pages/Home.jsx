import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import PageLayout from '../components/layout/PageLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Cpu, Zap, Activity } from 'lucide-react';
import { useSound } from '../context/SoundContext';

// --- Matrix Rain Effect ---
const MatrixRain = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/?[]{}!@#$%^&*()';
        const fontSize = 14;
        const columns = canvas.width / fontSize;
        const drops = Array(Math.floor(columns)).fill(1);

        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#0F0'; // Green
            ctx.font = `${fontSize}px monospace`;

            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                // Randomly color some characters Cyan for "glitch" look
                ctx.fillStyle = Math.random() > 0.95 ? '#0ff' : '#0F0';

                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };

        const interval = setInterval(draw, 33);

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);

        return () => {
            clearInterval(interval);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-20 pointer-events-none" />;
};

const Home = () => {
    const { playSFX } = useSound();
    const [initSystem, setInitSystem] = useState(false);
    const [hoveredItem, setHoveredItem] = useState(null);

    useEffect(() => {
        // Fake system boot delay
        const timer = setTimeout(() => {
            setInitSystem(true);
            playSFX('SUCCESS');
        }, 1000);
        return () => clearTimeout(timer);
    }, [playSFX]);

    const menuItems = [
        { title: "BATTLES", path: "/battle-arena", icon: Zap, color: "text-red-500", desc: "Engage Enemy Protocols" },
        { title: "CAMPAIGN MAP", path: "/world", icon: Activity, color: "text-green-500", desc: "Explore The Network" },
        { title: "WAR ROOM", path: "/war-room", icon: Terminal, color: "text-cyan-500", desc: "Upgrade Systems" },
        { title: "RANKS", path: "/rankings", icon: Cpu, color: "text-yellow-500", desc: "View Clearance Levels" },
    ];

    return (
        <PageLayout>
            <MatrixRain />

            <div className="relative z-10 min-h-[80vh] flex flex-col md:flex-row items-center justify-center gap-12 p-4 max-w-7xl mx-auto">

                <AnimatePresence>
                    {!initSystem ? (
                        <motion.div
                            key="loader"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, scale: 2, filter: "blur(10px)" }}
                            className="flex flex-col items-center gap-4 w-full"
                        >
                            <Cpu size={64} className="text-cyan-400 animate-pulse" />
                            <div className="font-mono text-cyan-500 text-sm">INITIALIZING KERNEL...</div>
                            <div className="w-48 h-1 bg-gray-900 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-cyan-500"
                                    initial={{ width: 0 }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 0.8 }}
                                />
                            </div>
                        </motion.div>
                    ) : (
                        <>
                            {/* Left: Title & Description */}
                            <motion.div
                                initial={{ x: -50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.5 }}
                                className="flex-1 text-left space-y-6"
                            >
                                <div className="inline-flex items-center gap-2 px-3 py-1 mb-2 border border-cyan-500/30 rounded-full bg-cyan-900/10 backdrop-blur-sm">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                    <span className="text-cyan-400 font-orbitron text-xs tracking-[0.2em] uppercase">System Online V2.1</span>
                                </div>

                                <h1 className="text-6xl md:text-8xl font-black font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 leading-tight">
                                    PYTHON<br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">
                                        WARRIORS
                                    </span>
                                </h1>

                                <p className="text-xl text-gray-400 font-light max-w-lg leading-relaxed">
                                    <b className="text-white">Code is your weapon.</b> Logic is your shield. <br />
                                    Hack the multiverse in this Agentic Coding RPG.
                                </p>
                            </motion.div>

                            {/* Right: Vertical Menu */}
                            <motion.div
                                initial={{ x: 50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                                className="flex-1 w-full max-w-md"
                            >
                                <div className="flex flex-col gap-4">
                                    {menuItems.map((item, i) => (
                                        <Link
                                            to={item.path}
                                            key={item.title}
                                            onMouseEnter={() => {
                                                setHoveredItem(item.title);
                                                playSFX('HOVER');
                                            }}
                                            onClick={() => playSFX('CLICK')}
                                            className="group relative"
                                        >
                                            <div className={`
                                                relative z-10 flex items-center justify-between p-6 
                                                border border-white/5 bg-black/40 backdrop-blur-sm
                                                transform transition-all duration-300
                                                group-hover:scale-105 group-hover:bg-white/10 group-hover:border-white/20
                                                clip-menu-item
                                            `}>
                                                <div className="flex items-center gap-6">
                                                    <item.icon size={32} className={`transition-colors duration-300 ${hoveredItem === item.title ? item.color : 'text-gray-500'}`} />
                                                    <div className="flex flex-col text-left">
                                                        <span className={`text-2xl font-black font-orbitron tracking-widest transition-colors ${hoveredItem === item.title ? 'text-white' : 'text-gray-400'}`}>
                                                            {item.title}
                                                        </span>
                                                        <span className="text-xs font-mono text-gray-500 uppercase tracking-wider group-hover:text-cyan-400 transition-colors">
                                                            {item.desc}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Arrow Indicator */}
                                                <div className={`
                                                    w-2 h-2 bg-current rotate-45 transform transition-all duration-300
                                                    ${hoveredItem === item.title ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}
                                                    ${item.color}
                                                `} />
                                            </div>

                                            {/* Hover Glow Behind */}
                                            <div className={`
                                                absolute inset-0 -z-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300
                                                bg-gradient-to-r from-transparent via-current to-transparent
                                                ${item.color.replace('text-', 'text-')}
                                            `} />
                                        </Link>
                                    ))}
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>

            <style jsx>{`
                .clip-menu-item {
                    clip-path: polygon(
                        0 0, 
                        100% 0, 
                        100% 70%, 
                        95% 100%, 
                        0 100%, 
                        0 30%
                    );
                }
            `}</style>
        </PageLayout>
    );
};

export default Home;
