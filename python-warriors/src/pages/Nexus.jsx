import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import { motion } from 'framer-motion';
import { Zap, Activity, Terminal, Cpu, Database, Award, Target, Globe, BookOpen, Info } from 'lucide-react';
import { useSound } from '../context/SoundContext';
import { usePlayer } from '../context/PlayerContext';
import { clsx } from 'clsx';

// --- Matrix Rain Effect (Optimized) ---
const MatrixRain = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/?[]{}!@#$%^&*()';
        const fontSize = 14;
        const columns = Math.ceil(window.innerWidth / fontSize);
        const drops = Array(columns).fill(1);

        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#0F0';
            ctx.font = `${fontSize}px monospace`;

            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillStyle = Math.random() > 0.95 ? '#0ff' : '#0F0';
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-10 pointer-events-none" />;
};

import TourOverlay from '../components/ui/TourOverlay';

const DashboardCard = ({ icon: Icon, title, desc, value, subtext, color, path, delay, id }) => (
    <motion.div
        id={id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.5 }}
    >
        <Link
            to={path}
            className="block h-full glass-panel p-5 relative overflow-hidden group hover:border-opacity-50 transition-all duration-300 border-l-2"
            style={{ borderLeftColor: color }}
        >
            <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity`}>
                <Icon size={64} style={{ color }} />
            </div>

            <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Icon size={18} style={{ color }} />
                        <h3 className="font-orbitron font-bold text-sm text-gray-200">{title}</h3>
                    </div>
                    {value && <div className="text-2xl font-bold font-mono text-white mb-1">{value}</div>}
                    <p className="text-xs text-gray-500 font-mono leading-tight">{desc}</p>
                </div>
                {subtext && <div className="mt-3 text-[10px] text-gray-600 font-mono border-t border-white/5 pt-2">{subtext}</div>}
            </div>

            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shine" />
        </Link>
    </motion.div>
);

const WelcomeModal = ({ onClose, onStartTour }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-900 border border-cyan-500/30 rounded-xl p-6 max-w-lg w-full shadow-2xl relative overflow-hidden"
        >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500" />

            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-cyan-500/20 rounded-lg">
                    <Terminal size={24} className="text-cyan-400" />
                </div>
                <h2 className="text-2xl font-orbitron font-bold text-white">SYSTEM ONLINE</h2>
            </div>

            <p className="text-gray-300 mb-6 leading-relaxed">
                Welcome, Initiate. Your neural link to the <span className="text-cyan-400 font-bold">Python Warriors</span> network is established.
                <br /><br />
                Your mission is to master the Python protocol through combat and study.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-8">
                <div className="bg-white/5 p-3 rounded border border-white/10">
                    <div className="flex items-center gap-2 text-cyan-400 mb-1 font-bold text-xs"><BookOpen size={14} /> ACADEMY</div>
                    <div className="text-[10px] text-gray-400">Learn syntax and logic.</div>
                </div>
                <div className="bg-white/5 p-3 rounded border border-white/10">
                    <div className="flex items-center gap-2 text-red-400 mb-1 font-bold text-xs"><Zap size={14} /> ARENA</div>
                    <div className="text-[10px] text-gray-400">Battle AI with code.</div>
                </div>
                <div className="bg-white/5 p-3 rounded border border-white/10">
                    <div className="flex items-center gap-2 text-yellow-400 mb-1 font-bold text-xs"><Target size={14} /> DIRECTIVES</div>
                    <div className="text-[10px] text-gray-400">Daily missions & loot.</div>
                </div>
                <div className="bg-white/5 p-3 rounded border border-white/10">
                    <div className="flex items-center gap-2 text-purple-400 mb-1 font-bold text-xs"><Database size={14} /> OPERATIONS</div>
                    <div className="text-[10px] text-gray-400">Build real-world apps.</div>
                </div>
            </div>

            <div className="flex gap-4">
                <button
                    onClick={onClose}
                    className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-gray-300 font-bold rounded-lg font-orbitron tracking-widest transition-all border border-white/10"
                >
                    SKIP PROTOCOL
                </button>
                <button
                    onClick={() => {
                        onClose();
                        onStartTour();
                    }}
                    className="flex-[2] py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg font-orbitron tracking-widest transition-all shadow-lg shadow-cyan-500/20"
                >
                    INITIALIZE TOUR
                </button>
            </div>
        </motion.div>
    </div>
);

const Nexus = () => {
    const { playSFX } = useSound();
    const { playerData } = usePlayer();
    const [greeting, setGreeting] = useState('');
    const [showWelcome, setShowWelcome] = useState(false);
    const [tourOpen, setTourOpen] = useState(false);

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('GOOD MORNING');
        else if (hour < 18) setGreeting('GOOD AFTERNOON');
        else setGreeting('GOOD EVENING');

        // Check for first visit
        const hasVisited = localStorage.getItem('hasVisitedNexus');
        if (!hasVisited) {
            setShowWelcome(true);
            localStorage.setItem('hasVisitedNexus', 'true');
            playSFX('BOOT_SEQUENCE'); // Hypothetical startup sound
        }
    }, [playSFX]);

    const dashboardItems = [
        {
            id: "dash-academy",
            title: "ACADEMY // LEARN",
            value: "START HERE",
            desc: "Master Python Basics to unlock weapons.",
            subtext: "Module: Variables & Types",
            icon: BookOpen,
            color: "#06b6d4",
            path: "/academy",
            delay: 0.1,
            recommended: true
        },
        {
            id: "dash-directives",
            title: "DIRECTIVES // MISSIONS",
            value: "3 PENDING",
            desc: "Daily tasks to earn XP and Gold.",
            subtext: "Streak: 5 Days",
            icon: Target,
            color: "#eab308",
            path: "/directives",
            delay: 0.2
        },
        {
            id: "dash-arena",
            title: "ARENA // COMBAT",
            value: "BATTLE SIM",
            desc: "Test your skills against AI Glitches.",
            subtext: "Boss: Syntax Demon",
            icon: Zap,
            color: "#ef4444",
            path: "/arena",
            delay: 0.3
        },
        {
            id: "dash-operations",
            title: "OPERATIONS // PROJECTS",
            value: "BUILD APPS",
            desc: "Apply your skills in real scenarios.",
            subtext: "Project: Calculator",
            icon: Database,
            color: "#8b5cf6",
            path: "/operations",
            delay: 0.4
        },
    ];

    const tourSteps = [
        {
            targetId: 'dash-academy',
            title: 'BEGIN YOUR TRAINING',
            content: 'The ACADEMY is where all Warriors start. Learn Python syntax, solve coding challenges, and unlock new abilities here.'
        },
        {
            targetId: 'dash-directives',
            title: 'DAILY MISSIONS',
            content: 'Check DIRECTIVES every day for new tasks. Completing them earns you XP and Gold to upgrade your gear.'
        },
        {
            targetId: 'dash-arena',
            title: 'TEST YOUR MIGHT',
            content: 'The ARENA is a combat simulation. Use your code to defeat enemies and climb the leaderboards.'
        },
        {
            targetId: 'system-status',
            title: 'VITAL SIGNS',
            content: 'Monitor your HP, Energy, and Rank progress here. Keep your systems optimal, Warrior.'
        }
    ];

    return (
        <PageLayout>
            <MatrixRain />
            {showWelcome && <WelcomeModal onClose={() => setShowWelcome(false)} onStartTour={() => setTourOpen(true)} />}

            <TourOverlay
                isOpen={tourOpen}
                onClose={() => setTourOpen(false)}
                steps={tourSteps}
            />

            <div className="flex-1 w-full p-4 md:p-8 flex flex-col gap-8 relative z-10">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col md:flex-row items-end justify-between gap-4 border-b border-white/10 pb-6"
                >
                    <div>
                        <div className="text-xs font-mono text-cyan-500 mb-1 tracking-widest">:: SYSTEM NEXUS ::</div>
                        <h1 className="text-4xl md:text-5xl font-orbitron font-bold text-white mb-2">
                            {greeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">{playerData.name?.toUpperCase() || "WARRIOR"}</span>
                        </h1>
                        <p className="text-gray-400 font-mono text-sm max-w-xl">
                            Systems operational. Select a module below to begin your training.
                        </p>
                    </div>

                    <div className="flex gap-4 text-right">
                        <div className="bg-white/5 p-3 rounded border border-white/10">
                            <div className="text-[10px] text-gray-500 font-bold mb-1">CURRENT LEVEL</div>
                            <div className="text-2xl font-orbitron text-white">{playerData.level}</div>
                        </div>
                        <div className="bg-white/5 p-3 rounded border border-white/10">
                            <div className="text-[10px] text-gray-500 font-bold mb-1">TOTAL XP</div>
                            <div className="text-2xl font-orbitron text-cyan-400">{playerData.xp}</div>
                        </div>
                    </div>
                </motion.div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {dashboardItems.map((item, idx) => (
                        <div key={idx} className="relative">
                            {item.recommended && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 bg-cyan-500 text-black text-[10px] font-bold px-3 py-1 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.6)] animate-bounce">
                                    START JOURNEY
                                </div>
                            )}
                            <DashboardCard {...item} />
                        </div>
                    ))}
                </div>

                {/* Recent Activity / News Feed */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
                    {/* Activity Log */}
                    <div className="lg:col-span-2 glass-panel p-6 border-t-2 border-t-gray-700">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-orbitron text-lg text-gray-200 flex items-center gap-2">
                                <Activity size={18} className="text-green-500" /> SYSTEM LOGS
                            </h3>
                            <button className="text-[10px] text-cyan-500 hover:text-cyan-400 font-mono">VIEW ALL</button>
                        </div>
                        <div className="space-y-3 font-mono text-sm">
                            <div className="flex gap-3 items-start p-2 hover:bg-white/5 rounded transition-colors">
                                <div className="text-xs text-gray-500 mt-1">10:42</div>
                                <div>
                                    <div className="text-gray-300">Completed <span className="text-cyan-400">Variable Assignment</span> module.</div>
                                    <div className="text-[10px] text-gray-600">+50 XP</div>
                                </div>
                            </div>
                            <div className="flex gap-3 items-start p-2 hover:bg-white/5 rounded transition-colors">
                                <div className="text-xs text-gray-500 mt-1">YESTERDAY</div>
                                <div>
                                    <div className="text-gray-300">Defeated <span className="text-red-400">Logic Gatekeeper</span>.</div>
                                    <div className="text-[10px] text-gray-600">+120 XP / Rare Badge Acquired</div>
                                </div>
                            </div>
                            <div className="flex gap-3 items-start p-2 hover:bg-white/5 rounded transition-colors opacity-60">
                                <div className="text-xs text-gray-500 mt-1">2 DAYS AGO</div>
                                <div>
                                    <div className="text-gray-300">System initialization complete. Welcome Warrior.</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions / System Status */}
                    <div id="system-status" className="glass-panel p-6 border-t-2 border-t-gray-700 flex flex-col gap-4 relative">
                        <button
                            onClick={() => setTourOpen(true)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-cyan-400 transition-colors"
                            title="Replay Tutorial"
                        >
                            <Info size={16} />
                        </button>
                        <h3 className="font-orbitron text-lg text-gray-200 flex items-center gap-2">
                            <Cpu size={18} className="text-purple-500" /> SYSTEM STATUS
                        </h3>

                        <div className="space-y-4 flex-1">
                            <div>
                                <div className="flex justify-between text-xs text-gray-400 mb-1">
                                    <span>HP</span>
                                    <span>{playerData.hp} / {playerData.maxHp}</span>
                                </div>
                                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-red-500" style={{ width: `${(playerData.hp / playerData.maxHp) * 100}%` }} />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs text-gray-400 mb-1">
                                    <span>ENERGY</span>
                                    <span>100%</span>
                                </div>
                                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-yellow-500" style={{ width: '100%' }} />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs text-gray-400 mb-1">
                                    <span>NEXT RANK</span>
                                    <span>{(playerData.xp / playerData.maxXp * 100).toFixed(0)}%</span>
                                </div>
                                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-cyan-500" style={{ width: `${(playerData.xp / playerData.maxXp) * 100}%` }} />
                                </div>
                            </div>
                        </div>

                        <Link to="/terminal" className="mt-auto w-full py-3 bg-white/5 border border-dashed border-gray-600 rounded text-center text-xs font-mono text-gray-400 hover:text-white hover:bg-white/10 hover:border-white transition-all">
                            &gt; ACCESS TERMINAL_
                        </Link>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};

export default Nexus;
