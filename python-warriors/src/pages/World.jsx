import React, { useState } from 'react';
import PageLayout from '../components/layout/PageLayout';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sword, Shield, Skull, Home, MapPin, Globe, Signal, Zap, Lock, Terminal, Box, Cpu, Network, Layers, Crown } from 'lucide-react';
import { useSound } from '../context/SoundContext';
import Button from '../components/ui/Button';

const NODES = [
    {
        id: 'level_1',
        x: 50,
        y: 85,
        label: "L1: FOUNDATION",
        icon: Terminal,
        path: '/dungeon',
        color: 'text-green-400',
        borderColor: 'border-green-500',
        bg: 'bg-green-900/40',
        desc: "Goal: Understand core syntax and thinking in Python.",
        difficulty: 1,
        rewards: ["Variables", "Loops", "Functions", "Lists"],
        locked: false
    },
    {
        id: 'level_2',
        x: 75,
        y: 70,
        label: "L2: ARCHITECT",
        icon: Box,
        path: '/war-room',
        color: 'text-yellow-400',
        borderColor: 'border-yellow-500',
        bg: 'bg-yellow-900/20',
        desc: "Goal: Write structured, reusable, and cleaner code (OOP).",
        difficulty: 2,
        rewards: ["OOP", "Modules", "File Handling", "Exceptions"],
        locked: false
    },
    {
        id: 'level_3',
        x: 25,
        y: 55,
        label: "L3: ADVANCED",
        icon: Cpu,
        path: '/dungeon',
        color: 'text-blue-400',
        borderColor: 'border-blue-500',
        bg: 'bg-blue-900/20',
        desc: "Goal: Understand how Python works internally & Async.",
        difficulty: 3,
        rewards: ["Decorators", "Async/Await", "Memory Mgmt", "Regex"],
        locked: false
    },
    {
        id: 'level_4',
        x: 65,
        y: 40,
        label: "L4: ALGORITHMS",
        icon: Layers,
        path: '/battle-arena',
        color: 'text-purple-500',
        borderColor: 'border-purple-600',
        bg: 'bg-purple-900/30',
        desc: "Goal: Improve problem-solving skills with DSA.",
        difficulty: 4,
        rewards: ["Trees & Graphs", "Sorting", "Complexity", "DP"],
        locked: false
    },
    {
        id: 'level_5',
        x: 35,
        y: 25,
        label: "L5: REAL WORLD",
        icon: Globe,
        path: null,
        color: 'text-cyan-500',
        borderColor: 'border-cyan-600',
        bg: 'bg-cyan-900/40',
        desc: "Goal: Build real applications (Web, AI, Automation).",
        difficulty: 5,
        rewards: ["Web Dev", "Data Science", "Automation", "APIs"],
        locked: true
    },
    {
        id: 'level_6',
        x: 50,
        y: 10,
        label: "L6: EXPERT",
        icon: Crown,
        path: null,
        color: 'text-red-500',
        borderColor: 'border-red-600',
        bg: 'bg-red-900/40',
        desc: "Goal: Deep mastery, optimization, and architecture.",
        difficulty: 6,
        rewards: ["Design Patterns", "C Extensions", "Profiling", "Internals"],
        locked: true
    },
];

const ConnectionLine = ({ start, end, color }) => {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    const length = Math.sqrt(dx * dx + dy * dy);

    return (
        <div
            className="absolute z-0 pointer-events-none origin-left"
            style={{
                top: `${start.y}%`,
                left: `${start.x}%`,
                width: `${length}%`,
                height: '4px', // Thicker for 3D feel
                transform: `rotate(${angle}deg)`,
                transformOrigin: '0 50%'
            }}
        >
            {/* Path */}
            <div className={`w-full h-full bg-gradient-to-r from-transparent via-current to-transparent opacity-30 ${color || 'text-cyan-500'}`} />

            {/* Moving Packet (Simulating Data/Energy) */}
            <motion.div
                className={`absolute top-0 left-0 h-full w-4 rounded-full ${color ? color.replace('text', 'bg') : 'bg-cyan-400'} shadow-[0_0_15px_currentColor]`}
                animate={{ left: ["0%", "100%"], opacity: [0, 1, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
        </div>
    );
};

const World = () => {
    console.log("World Map Component Loaded - Verifying HMR");
    const navigate = useNavigate();
    const { playSFX } = useSound();
    const [activeNode, setActiveNode] = useState(NODES[0]);

    return (
        <PageLayout>
            <div className="h-[calc(100vh-140px)] flex gap-6">

                {/* Left: 3D Map View */}
                <div className="flex-1 glass-panel p-0 relative overflow-hidden group perspective-[1200px] bg-black/60">

                    {/* 3D Floor Grid - Floating Effect */}
                    <div
                        className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none"
                        style={{
                            transform: 'rotateX(60deg) scale(2) translateY(-10%)',
                            transformOrigin: '50% 100%'
                        }}
                    />

                    {/* Horizon Fog */}
                    <div className="absolute top-0 left-0 w-full h-2/3 bg-gradient-to-b from-black via-black/80 to-transparent z-10 pointer-events-none" />

                    {/* Connections - Rendered behind nodes */}
                    {NODES.slice(0, NODES.length - 1).map((node, i) => (
                        <ConnectionLine
                            key={`link-${i}`}
                            start={node}
                            end={NODES[i + 1]}
                            color={node.locked ? "text-gray-700" : "text-cyan-500"}
                        />
                    ))}

                    {/* Nodes - Billboard Style (Stands up in 3D) */}
                    {NODES.map((node) => (
                        <div
                            key={node.id}
                            className="absolute z-20 flex flex-col items-center cursor-pointer group"
                            style={{
                                left: `${node.x}%`,
                                top: `${node.y}%`,
                                transform: 'translate(-50%, -50%)'
                            }}
                            onMouseEnter={() => {
                                setActiveNode(node);
                                playSFX('UI_HOVER');
                            }}
                            onClick={() => {
                                if (node.locked || !node.path) {
                                    playSFX('ERROR');
                                    return;
                                }
                                playSFX('UI_CLICK');
                                navigate(node.path);
                            }}
                        >
                            {/* Floating Node Base */}
                            <motion.div
                                className={`w-24 h-24 rounded-2xl flex items-center justify-center relative transition-all duration-500 
                                    ${node.id === activeNode.id ? 'scale-125 z-30 shadow-[0_20px_50px_rgba(0,0,0,0.5)]' : 'scale-100 opacity-80 shadow-[0_10px_30px_rgba(0,0,0,0.5)]'} 
                                    ${node.locked ? 'grayscale opacity-50' : ''}
                                `}
                                animate={node.id === activeNode.id ? { y: [0, -10, 0] } : {}}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            >
                                {/* Glass Cube Effect */}
                                <div className={`absolute inset-0 ${node.bg} backdrop-blur-md border border-t-white/20 border-l-white/10 border-r-black/20 border-b-black/40 ${node.borderColor} rounded-2xl transition-all duration-300 shadow-inner`} />

                                {/* Icon */}
                                <node.icon
                                    size={36}
                                    className={`relative z-10 ${node.locked ? 'text-gray-500' : (node.id === activeNode.id ? node.color : 'text-gray-300')} transition-colors duration-300 drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)]`}
                                />

                                {/* Glow ring for active */}
                                {node.id === activeNode.id && !node.locked && (
                                    <div className={`absolute -inset-4 border-2 ${node.borderColor} rounded-full animate-ping opacity-20`} />
                                )}
                            </motion.div>

                            {/* Label floating below */}
                            <div className={`
                                mt-4 px-4 py-2 bg-black/80 backdrop-blur-sm border rounded-lg text-xs font-bold font-orbitron tracking-widest uppercase shadow-xl transition-all duration-300 transform
                                ${node.id === activeNode.id ? `${node.borderColor} ${node.color} scale-110 -translate-y-2` : 'border-gray-800 text-gray-500 border-transparent'}
                            `}>
                                {node.label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right: Detailed Info Panel */}
                <div className="w-96 glass-panel p-6 flex flex-col relative overflow-hidden shrink-0 border-l border-white/10">
                    <h3 className="font-orbitron theme-text text-lg flex items-center gap-2 mb-6 border-b border-theme-text/10 pb-4 tracking-wider">
                        <MapPin size={18} className="text-cyan-400" /> CURRICULUM DATA
                    </h3>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeNode.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                            className="flex-1 flex flex-col"
                        >
                            {/* Header */}
                            <div className="flex items-center gap-4 mb-4">
                                <div className={`w-16 h-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center ${activeNode.color} shadow-[0_0_20px_rgba(0,0,0,0.3)]`}>
                                    <activeNode.icon size={32} />
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500 font-mono mb-1">MASTERY LEVEL {activeNode.difficulty}</div>
                                    <div className={`text-xl font-black font-orbitron ${activeNode.color} leading-none`}>
                                        {activeNode.label.split(':')[1]}
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="text-sm text-gray-300 font-light mb-6 leading-relaxed p-4 bg-black/40 rounded-lg border border-white/5 relative overflow-hidden">
                                <div className={`absolute left-0 top-0 bottom-0 w-1 ${activeNode.color.replace('text', 'bg')}`} />
                                {activeNode.desc}
                            </div>

                            {/* Topics List */}
                            <div className="space-y-4 mb-8">
                                <div className="text-xs text-gray-500 flex items-center gap-2 font-bold tracking-wider">
                                    <Layers size={12} /> CORE TOPICS
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    {activeNode.rewards.map((topic, i) => (
                                        <div key={i} className="flex items-center gap-2 text-xs text-gray-400 bg-white/5 px-2 py-2 rounded border border-white/5">
                                            <div className={`w-1.5 h-1.5 rounded-full ${activeNode.color.replace('text', 'bg')}`} />
                                            {topic}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Action Button */}
                            <div className="mt-auto">
                                {activeNode.locked ? (
                                    <Button variant="danger" disabled className="w-full h-14 opacity-50 font-bold flex flex-col items-center justify-center gap-1">
                                        <Lock size={16} />
                                        <span>MASTERY LOCKED</span>
                                    </Button>
                                ) : (
                                    <Button variant="primary" className="w-full h-14 text-lg font-bold tracking-widest shadow-lg shadow-cyan-500/20 group" onClick={() => navigate(activeNode.path)}>
                                        <span className="group-hover:animate-pulse">START TRAINING</span>
                                    </Button>
                                )}
                                <div className="text-center mt-2 text-[10px] text-gray-600 font-mono">
                                    ESTIMATED TIME: {activeNode.difficulty * 2} HOURS
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </PageLayout>
    );
};

export default World;
