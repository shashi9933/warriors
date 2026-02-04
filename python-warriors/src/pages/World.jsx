import React, { useState } from 'react';
import PageLayout from '../components/layout/PageLayout';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sword, Shield, Skull, Home, MapPin, Globe, Signal, Zap, Lock } from 'lucide-react';
import { useSound } from '../context/SoundContext';
import Button from '../components/ui/Button';

const NODES = [
    {
        id: 'home',
        x: 50,
        y: 80,
        label: "WAR ROOM",
        icon: Shield,
        path: '/war-room',
        color: 'text-cyan-400',
        borderColor: 'border-cyan-500',
        bg: 'bg-cyan-900/20',
        desc: "Safe zone. Upgrade skills and manage inventory.",
        difficulty: 0,
        rewards: ["Rest", "Upgrades"]
    },
    {
        id: 'arena',
        x: 20,
        y: 40,
        label: "BATTLE ARENA",
        icon: Sword,
        path: '/battle-arena',
        color: 'text-red-400',
        borderColor: 'border-red-500',
        bg: 'bg-red-900/20',
        desc: "Engage in direct combat with Function Dragons. High lethality.",
        difficulty: 3,
        rewards: ["XP", "Rare Loot"]
    },
    {
        id: 'dungeon',
        x: 80,
        y: 40,
        label: "THE DUNGEON",
        icon: Skull,
        path: '/dungeon',
        color: 'text-purple-400',
        borderColor: 'border-purple-500',
        bg: 'bg-purple-900/20',
        desc: "Solve algorithmic puzzles to bypass security layers.",
        difficulty: 5,
        rewards: ["Skill Points", "Epic Gear"]
    },
    {
        id: 'wilds',
        x: 50,
        y: 20,
        label: "UNKNOWN SECTOR",
        icon: Lock,
        path: null,
        color: 'text-gray-500',
        borderColor: 'border-gray-700',
        bg: 'bg-gray-900/50',
        desc: "Data corrupted. Signal lost. Sector quarantined.",
        difficulty: 0,
        rewards: ["???"]
    },
];

const ConnectionLine = ({ start, end, color }) => {
    return (
        <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-visible">
            <line
                x1={`${start.x}%`} y1={`${start.y}%`}
                x2={`${end.x}%`} y2={`${end.y}%`}
                stroke={color || "rgba(0, 243, 255, 0.1)"}
                strokeWidth="2"
            />
            {/* Animated Packet */}
            <motion.circle
                r="3"
                fill="currentColor"
                className={color ? color.replace('text', 'text') : 'text-cyan-400'}
                initial={{ opacity: 0 }}
                animate={{
                    cx: [`${start.x}%`, `${end.x}%`],
                    cy: [`${start.y}%`, `${end.y}%`],
                    opacity: [0, 1, 1, 0]
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                    repeatDelay: Math.random() * 2
                }}
            />
        </svg>
    );
};

const World = () => {
    const navigate = useNavigate();
    const { playSFX } = useSound();
    const [activeNode, setActiveNode] = useState(NODES[0]); // Default to War Room highlight

    return (
        <PageLayout>
            <div className="h-[calc(100vh-140px)] flex gap-6">

                {/* Left: Map View (3D Grid) */}
                <div className="flex-1 glass-panel p-0 relative overflow-hidden group perspective-[1000px]">

                    {/* 3D Floor Grid */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.05)_1px,transparent_1px)] bg-[size:60px_60px] transform rotate-x-60 scale-150 origin-bottom opacity-50 pointer-events-none" />

                    {/* Horizon Glow */}
                    <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-black via-black/50 to-transparent z-10 pointer-events-none" />

                    {/* Connections */}
                    <ConnectionLine start={NODES[0]} end={NODES[1]} color="text-red-500" />
                    <ConnectionLine start={NODES[0]} end={NODES[2]} color="text-purple-500" />
                    <ConnectionLine start={NODES[1]} end={NODES[3]} color="text-gray-600" />
                    <ConnectionLine start={NODES[2]} end={NODES[3]} color="text-gray-600" />

                    {/* Nodes */}
                    {NODES.map((node) => (
                        <div
                            key={node.id}
                            className="absolute z-20 flex flex-col items-center cursor-pointer"
                            style={{ left: `${node.x}%`, top: `${node.y}%`, transform: 'translate(-50%, -50%)' }}
                            onMouseEnter={() => {
                                setActiveNode(node);
                                playSFX('UI_HOVER');
                            }}
                            onClick={() => {
                                if (!node.path) {
                                    playSFX('ERROR');
                                    return;
                                }
                                playSFX('UI_CLICK');
                                navigate(node.path);
                            }}
                        >
                            <motion.div
                                className={`w-24 h-24 clip-hexagon flex items-center justify-center relative transition-all duration-300 ${node.id === activeNode.id ? 'scale-110' : 'scale-100 opacity-80'}`}
                                animate={{ y: [0, -5, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: Math.random() }}
                            >
                                {/* Hexagon Background */}
                                <div className={`absolute inset-0 ${node.bg} backdrop-blur-md border-2 ${node.id === activeNode.id ? node.borderColor : 'border-gray-700'} transition-colors duration-300 clip-hexagon`} />

                                {/* Icon */}
                                <node.icon
                                    size={32}
                                    className={`relative z-10 ${node.id === activeNode.id ? node.color : 'text-gray-500'} transition-colors duration-300 drop-shadow-[0_0_10px_rgba(0,0,0,0.8)]`}
                                />

                                {/* Active Ring Effect */}
                                {node.id === activeNode.id && (
                                    <div className={`absolute inset-0 border-2 ${node.borderColor} clip-hexagon animate-ping opacity-20`} />
                                )}
                            </motion.div>

                            {/* Label under node */}
                            <div className={`mt-4 font-orbitron text-xs font-bold tracking-widest px-3 py-1 bg-black/80 border border-white/10 rounded-full transition-colors ${node.id === activeNode.id ? node.color : 'text-gray-600'}`}>
                                {node.label}
                            </div>
                        </div>
                    ))}

                    <div className="absolute bottom-4 left-4 text-xs font-mono text-gray-500">
                        LAT: {activeNode.x.toFixed(2)} | LON: {activeNode.y.toFixed(2)}
                    </div>
                </div>

                {/* Right: Sector Analysis Panel */}
                <div className="w-80 glass-panel p-6 flex flex-col relative overflow-hidden shrink-0">
                    <h3 className="font-orbitron text-white text-lg flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
                        <Globe size={18} className="text-cyan-400" /> SECTOR ANALYSIS
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
                            <div className={`text-4xl font-bold font-orbitron mb-2 ${activeNode.color} drop-shadow-lg`}>
                                {activeNode.label}
                            </div>
                            <div className="text-sm text-gray-400 font-mono mb-6 leading-relaxed">
                                {activeNode.desc}
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <div className="text-xs text-gray-500 mb-1 flex items-center gap-2">THREAT LEVEL</div>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map(lvl => (
                                            <div
                                                key={lvl}
                                                className={`h-2 flex-1 rounded-sm ${lvl <= activeNode.difficulty ? 'bg-red-500' : 'bg-gray-800'}`}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <div className="text-xs text-gray-500 mb-2 flex items-center gap-2">DETECTED RESOURCES</div>
                                    <div className="flex flex-wrap gap-2">
                                        {activeNode.rewards.map((rew, i) => (
                                            <span key={i} className={`text-xs px-2 py-1 rounded bg-white/5 border border-white/10 ${activeNode.color}`}>
                                                {rew}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-auto pt-6 border-t border-white/10">
                                {activeNode.path ? (
                                    <Button variant="primary" className="w-full h-12 text-sm tracking-widest" onClick={() => navigate(activeNode.path)}>
                                        INITIATE GRAVITY JUMP
                                    </Button>
                                ) : (
                                    <Button variant="danger" disabled className="w-full h-12 opacity-50">
                                        ACCESS DENIED
                                    </Button>
                                )}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            <style jsx>{`
                .clip-hexagon {
                    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
                }
            `}</style>
        </PageLayout>
    );
};

export default World;
