import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import PageLayout from '../components/layout/PageLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Cpu, Zap, Activity, ChevronRight, BookOpen } from 'lucide-react';
import { useSound } from '../context/SoundContext';
import { usePlayer } from '../context/PlayerContext';

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
    const [displayedText, setDisplayedText] = useState('');
    const fullText = "MASTER PYTHON.";
    const { playerData } = usePlayer();

    useEffect(() => {
        // Fake system boot delay
        const timer = setTimeout(() => {
            setInitSystem(true);
            playSFX('SUCCESS');
        }, 1000);
        return () => clearTimeout(timer);
    }, [playSFX]);

    useEffect(() => {
        if (initSystem) {
            let i = 0;
            const interval = setInterval(() => {
                setDisplayedText(fullText.substring(0, i + 1));
                i++;
                if (i === fullText.length) clearInterval(interval);
            }, 100);
            return () => clearInterval(interval);
        }
    }, [initSystem]);

    const menuItems = [
        { title: "BATTLES", path: "/battle-arena", icon: Zap, color: "text-red-500", desc: "Engage Enemy Protocols" },
        { title: "CAMPAIGN", path: "/world", icon: Activity, color: "text-green-500", desc: "Explore The Network" },
        { title: "WAR ROOM", path: "/war-room", icon: Terminal, color: "text-cyan-500", desc: "Upgrade Systems" },
        { title: "RANKS", path: "/rankings", icon: Cpu, color: "text-yellow-500", desc: "View Clearance Levels" },
    ];

    const features = [
        { title: "THE ARENA", icon: Zap, desc: "Write real Python code to cast spells and defeat algorithmic beasts.", color: "text-red-400" },
        { title: "THE ACADEMY", icon: BookOpen, desc: "Learn concepts from scratch. Loops, Variables, Functions—gamified.", color: "text-blue-400" },
        { title: "THE RANKINGS", icon: Activity, desc: "Compete with other players. Optimize your code for speed and efficiency.", color: "text-yellow-400" },
    ];

    return (
        <PageLayout>
            <MatrixRain />

            <div className="relative z-10 min-h-screen flex flex-col items-center justify-start overflow-hidden">
                <AnimatePresence>
                    {!initSystem ? (
                        <motion.div
                            key="loader"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, scale: 1.5, filter: "blur(10px)" }}
                            className="flex flex-col items-center justify-center h-screen gap-4 w-full"
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
                        <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-24">

                            {/* HERO SECTION */}
                            <div className="min-h-[80vh] flex flex-col md:flex-row items-center justify-center gap-12">
                                {/* Left: Title & Description */}
                                <motion.div
                                    initial={{ x: -50, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                    className="flex-1 text-left space-y-8"
                                >
                                    <div className="inline-flex items-center gap-2 px-3 py-1 mb-2 border border-cyan-500/30 rounded-full bg-cyan-900/10 backdrop-blur-sm">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                        <span className="text-cyan-400 font-orbitron text-xs tracking-[0.2em] uppercase">System Online V2.1</span>
                                    </div>

                                    <h1 className="text-5xl md:text-7xl font-black font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 leading-tight">
                                        <div className="min-h-[1.2em] mb-4">
                                            {displayedText}<span className="animate-pulse text-cyan-500">_</span>
                                        </div>
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 block">
                                            CONQUER THE GRID.
                                        </span>
                                    </h1>

                                    <p className="text-lg text-gray-400 font-light max-w-lg leading-relaxed">
                                        The ultimate coding RPG where logic is your weapon. Fight bosses, solve algorithms, and rise from a script kiddie to a <b>Code Warrior</b>.
                                    </p>

                                    <div className="flex gap-4">
                                        <Link
                                            to={playerData?.name ? "/world" : "/onboarding"}
                                            className="btn-primary flex items-center gap-2 group"
                                        >
                                            {playerData?.name ? "RESUME MISSION" : "JACK IN NOW"}
                                            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                        <Link to="/academy" className="btn-accent flex items-center gap-2">
                                            ACADEMY ACCESS
                                        </Link>
                                    </div>
                                </motion.div>

                                {/* Right: Vertical Menu (Replacing old menu, acting as visual anchor) */}
                                <motion.div
                                    initial={{ x: 50, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.3, duration: 0.5 }}
                                    className="flex-1 w-full max-w-md hidden md:block"
                                >
                                    {/* Simplified Menu for Hero */}
                                    <div className="flex flex-col gap-3 opacity-90">
                                        {menuItems.slice(0, 3).map((item) => (
                                            <Link key={item.path} to={item.path} className="block p-4 border border-white/10 bg-black/40 hover:bg-white/5 transition-all group">
                                                <div className="flex items-center gap-4">
                                                    <div className={`p-2 rounded bg-white/5 ${item.color.replace('text-', 'bg-')}/10 text-${item.color.split('-')[1]}-400`}>
                                                        <item.icon size={20} />
                                                    </div>
                                                    <div>
                                                        <div className="font-orbitron font-bold text-white group-hover:text-cyan-400 transition-colors">{item.title}</div>
                                                        <div className="text-[10px] text-gray-500 font-mono">{item.desc}</div>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </motion.div>
                            </div>


                            {/* MISSION BRIEFING (FEATURES) */}
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.7 }}
                                className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12 border-t border-white/10"
                            >
                                {features.map((feat, i) => (
                                    <motion.div
                                        key={i}
                                        whileHover={{ y: -10, rotateX: 5, rotateY: 5 }}
                                        className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:border-cyan-500/30 transition-colors group perspective-1000"
                                    >
                                        <feat.icon size={40} className={`mb-4 ${feat.color} group-hover:scale-110 transition-transform`} />
                                        <h3 className="text-xl font-orbitron font-bold text-white mb-2">{feat.title}</h3>
                                        <p className="text-gray-400 text-sm leading-relaxed">{feat.desc}</p>
                                    </motion.div>
                                ))}
                            </motion.div>

                            {/* HOW IT WORKS */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                className="text-center py-16 space-y-12 bg-black/30 rounded-2xl border border-white/5"
                            >
                                <div className="space-y-2">
                                    <h2 className="text-3xl font-orbitron font-bold text-cyan-400">HOW IT WORKS</h2>
                                    <p className="text-gray-500">Initialize sequence in 3 steps</p>
                                </div>

                                <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-16 h-16 rounded-full bg-cyan-900/20 border border-cyan-500/50 flex items-center justify-center text-2xl font-bold text-cyan-400">1</div>
                                        <span className="font-mono text-sm text-gray-300">SELECT MISSION</span>
                                    </div>
                                    <div className="h-0.5 w-16 bg-gray-800 hidden md:block" />
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-16 h-16 rounded-full bg-purple-900/20 border border-purple-500/50 flex items-center justify-center text-2xl font-bold text-purple-400">2</div>
                                        <span className="font-mono text-sm text-gray-300">CODE SOLUTION</span>
                                    </div>
                                    <div className="h-0.5 w-16 bg-gray-800 hidden md:block" />
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-16 h-16 rounded-full bg-green-900/20 border border-green-500/50 flex items-center justify-center text-2xl font-bold text-green-400">3</div>
                                        <span className="font-mono text-sm text-gray-300">EXECUTE & WIN</span>
                                    </div>
                                </div>
                            </motion.div>

                            {/* FOOTER */}
                            <footer className="pt-24 pb-8 text-center border-t border-white/5">
                                <div className="flex items-center justify-center gap-2 mb-4 opacity-50">
                                    <div className="w-4 h-4 bg-gradient-to-br from-neon-cyan to-blue-600 rounded flex items-center justify-center">
                                        <span className="font-orbitron font-bold text-white text-[8px]">W</span>
                                    </div>
                                    <span className="font-orbitron font-bold text-sm tracking-widest text-white">PYTHON WARRIORS</span>
                                </div>
                                <p className="text-gray-600 text-xs font-mono">
                                    &copy; {new Date().getFullYear()} SYSTEM CORE. ALL RIGHTS RESERVED.<br />
                                    Constructed for the Future of Coding.
                                </p>
                            </footer>

                        </div>
                    )}
                </AnimatePresence>
            </div>

            <style>{`
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
