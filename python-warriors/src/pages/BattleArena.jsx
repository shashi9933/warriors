import React, { useState, useEffect, useRef } from 'react';
import PageLayout from '../components/layout/PageLayout';
import Button from '../components/ui/Button';
import { usePlayer } from '../context/PlayerContext';
import { executePython } from '../engine/pythonExecutor';
import { detectPatterns } from '../engine/patternDetector';
import { calculateDamage, calculateBossDamage } from '../engine/combatEngine';
import { BOSSES } from '../data/gameData';
import { Terminal, Play, AlertTriangle, Cpu, Zap, Activity, Bug, Map as MapIcon, ChevronRight, Skull, Crosshair } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useSound } from '../context/SoundContext';

// --- Sub-Component: Dragon Avatar ---
const DragonAvatar = ({ hp, maxHp, isHit }) => {
    return (
        <div className={`relative w-64 h-64 transition-all duration-100 ${isHit ? 'scale-95 brightness-150 saturate-0' : 'animate-float'}`}>
            <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_0_30px_rgba(239,68,68,0.4)]">
                <defs>
                    <linearGradient id="dragonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ef4444" />
                        <stop offset="100%" stopColor="#7f1d1d" />
                    </linearGradient>
                </defs>
                <path d="M100 40 L120 70 L160 60 L140 100 L170 140 L100 120 L80 160 L60 120 L30 140 L50 90 L40 60 L80 70 Z" fill="url(#dragonGrad)" stroke="#fee2e2" strokeWidth="2" className={isHit ? "fill-white" : ""} />
                <circle cx="90" cy="80" r="4" fill="#fbbf24" className="animate-pulse" />
                <circle cx="110" cy="80" r="4" fill="#fbbf24" className="animate-pulse" />
                <circle cx="100" cy="100" r="10" fill="transparent" stroke="#fbbf24" strokeWidth="2" className="animate-spin-slow" />
            </svg>
        </div>
    );
};

// --- Sub-Component: Holographic Hover Card ---
const HoloCard = ({ level, x, y }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className="absolute z-50 pointer-events-none"
            style={{ left: x, top: y, transform: 'translate(-50%, -100%)' }}
        >
            <div className="w-64 bg-black/80 backdrop-blur-xl border border-cyan-500/50 rounded-lg p-4 shadow-[0_0_30px_rgba(6,182,212,0.3)] relative overflow-hidden">
                {/* Scanlines */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.05)_1px,transparent_1px)] bg-[size:10px_10px] opacity-50" />

                <div className="flex justify-between items-start mb-2 relative z-10">
                    <h3 className="font-orbitron font-bold text-cyan-400 text-lg">{level.name}</h3>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${level.difficulty === 'EASY' ? 'border-green-500 text-green-400' :
                        level.difficulty === 'MEDIUM' ? 'border-yellow-500 text-yellow-400' :
                            'border-red-500 text-red-500'
                        }`}>{level.difficulty}</span>
                </div>

                <div className="space-y-2 relative z-10">
                    <div className="flex items-center gap-2 text-xs text-gray-300">
                        <Skull size={14} className="text-red-500" />
                        <span>HP: Unknown</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-300">
                        <Crosshair size={14} className="text-yellow-500" />
                        <span>Focus: {level.chapter}</span>
                    </div>
                    {level.status === 'locked' && (
                        <div className="mt-2 text-xs text-red-400 bg-red-900/20 p-2 rounded border border-red-500/30">
                            <AlertTriangle size={12} className="inline mr-1" /> ACCESS DENIED
                        </div>
                    )}
                </div>

                {/* Decoration */}
                <div className="absolute -bottom-4 -right-4 w-16 h-16 border-2 border-cyan-500/20 rounded-full" />
            </div>
        </motion.div>
    );
};

// --- Sub-Component: Circuit Line ---
const CircuitLine = ({ start, end, color }) => {
    const x1 = start.x;
    const y1 = start.y;
    const x2 = end.x;
    const y2 = end.y;

    // Midpoint for turn
    const midY = (y1 + y2) / 2;
    const pathD = `M ${x1} ${y1} L ${x1} ${midY} L ${x2} ${midY} L ${x2} ${y2}`;

    return (
        <svg
            className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
        >
            <path d={pathD} fill="none" stroke={color || '#06b6d4'} strokeWidth="0.5" strokeOpacity="0.1" vectorEffect="non-scaling-stroke" />
            <path d={pathD} fill="none" stroke={color || '#06b6d4'} strokeWidth="0.2" vectorEffect="non-scaling-stroke" />
            <circle r="1" fill={color || '#fff'}>
                <animateMotion dur="3s" repeatCount="indefinite" path={pathD} keyPoints="0;1" keyTimes="0;1" />
            </circle>
            <circle r="0.5" fill={color || '#fff'}>
                <animateMotion dur="4s" begin="1s" repeatCount="indefinite" path={pathD} keyPoints="0;1" keyTimes="0;1" />
            </circle>
        </svg>
    );
};

// --- Sub-Component: Battle Map View ---
const BattleMap = ({ onSelectLevel }) => {
    const [filterChapter, setFilterChapter] = useState('ALL');
    const [filterDifficulty, setFilterDifficulty] = useState('ALL');
    const [hoveredLevel, setHoveredLevel] = useState(null);
    const containerRef = useRef(null);

    // Parallax logic
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const rotateX = useTransform(mouseY, [-0.5, 0.5], [5, -5]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], [-5, 5]);

    // Smooth spring physics
    const springRotateX = useSpring(rotateX, { stiffness: 100, damping: 20 });
    const springRotateY = useSpring(rotateY, { stiffness: 100, damping: 20 });

    const handleMouseMove = (e) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        mouseX.set(x);
        mouseY.set(y);
    };

    const allLevels = [
        { id: 'syntax_spider', name: 'Syntax Spider', chapter: 'BASICS', difficulty: 'EASY', status: 'unlocked', x: 50, y: 85 },
        { id: 'memory_leech', name: 'Memory Leech', chapter: 'BASICS', difficulty: 'MEDIUM', status: 'locked', x: 25, y: 65 },
        { id: 'array_golem', name: 'Array Golem', chapter: 'DATA_STRUCTURES', difficulty: 'HARD', status: 'locked', x: 75, y: 45 },
        { id: 'recursion_wraith', name: 'Recursion Wraith', chapter: 'ALGORITHMS', difficulty: 'EXTREME', status: 'locked', x: 35, y: 25 },
        { id: 'function_dragon', name: 'Function Dragon', chapter: 'BASICS', difficulty: 'HARD', status: 'unlocked', x: 50, y: 10 },
    ];

    const filteredLevels = allLevels.filter(l => {
        if (filterChapter !== 'ALL' && l.chapter !== filterChapter) return false;
        if (filterDifficulty !== 'ALL' && l.difficulty !== filterDifficulty) return false;
        return true;
    });

    const sortedLevels = [...filteredLevels].sort((a, b) => b.y - a.y);

    // Calculate Hover Position relative to % coordinates for popup
    const getPopupPosition = (level) => {
        // Since x and y are percentages, we return them as strings
        return { left: level.x + '%', top: (level.y - 8) + '%' };
    };

    return (
        <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => { mouseX.set(0); mouseY.set(0); }}
            className="relative w-full h-full bg-[#050510] overflow-hidden flex flex-col font-orbitron perspective-[1500px]"
        >

            {/* Filter Bar */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex gap-4 p-2 bg-black/80 backdrop-blur-md border border-white/10 rounded-full shadow-2xl">
                <select
                    value={filterChapter}
                    onChange={(e) => setFilterChapter(e.target.value)}
                    className="bg-transparent text-xs text-cyan-400 font-bold outline-none uppercase cursor-pointer"
                >
                    <option value="ALL">ALL CHAPTERS</option>
                    <option value="BASICS">BASICS</option>
                    <option value="DATA_STRUCTURES">DATA STRUCTURES</option>
                    <option value="ALGORITHMS">ALGORITHMS</option>
                </select>
                <div className="w-px bg-white/20" />
                <select
                    value={filterDifficulty}
                    onChange={(e) => setFilterDifficulty(e.target.value)}
                    className="bg-transparent text-xs text-purple-400 font-bold outline-none uppercase cursor-pointer"
                >
                    <option value="ALL">ALL DIFFICULTIES</option>
                    <option value="EASY">EASY</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HARD">HARD</option>
                    <option value="EXTREME">EXTREME</option>
                </select>
            </div>

            {/* 3D Container */}
            <motion.div
                style={{ rotateX: springRotateX, rotateY: springRotateY, transformStyle: 'preserve-3d' }}
                className="flex-1 relative w-full h-full"
            >
                {/* Background Tech Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(30,58,138,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(30,58,138,0.1)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 transform -translate-z-50" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.1),transparent_70%)] transform -translate-z-40" />

                {/* Floating Particles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-1 h-1 bg-cyan-500 rounded-full animate-float opacity-30"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDuration: `${3 + Math.random() * 5}s`,
                                animationDelay: `${Math.random() * 2}s`
                            }}
                        />
                    ))}
                </div>

                {/* Circuit Connections */}
                {sortedLevels.map((level, i) => {
                    if (i === sortedLevels.length - 1) return null;
                    const nextLevel = sortedLevels[i + 1];
                    return (
                        <CircuitLine
                            key={`link-${level.id}`}
                            start={level}
                            end={nextLevel}
                            color={level.status === 'locked' ? '#374151' : '#06b6d4'}
                        />
                    );
                })}

                {/* Nodes */}
                <AnimatePresence>
                    {filteredLevels.map((level) => (
                        <div key={level.id}>
                            <motion.div
                                initial={{ scale: 0, opacity: 0, z: 0 }}
                                animate={{ scale: 1, opacity: 1, z: 20 }}
                                exit={{ scale: 0, opacity: 0 }}
                                whileHover={{ scale: 1.2, z: 50 }}
                                onHoverStart={() => setHoveredLevel(level)}
                                onHoverEnd={() => setHoveredLevel(null)}
                                onClick={() => level.status !== 'locked' && onSelectLevel(level.id)}
                                className={`absolute w-24 h-24 flex flex-col items-center justify-center cursor-pointer transform-gpu text-sm
                                    ${level.status === 'locked' ? 'opacity-50 grayscale cursor-not-allowed' : ''}
                                `}
                                style={{ left: `${level.x}%`, top: `${level.y}%`, transform: 'translate(-50%, -50%)' }}
                            >
                                {/* Chip Body */}
                                <div className={`relative w-14 h-14 bg-black border-2 ${level.status === 'unlocked' ? 'border-cyan-500 shadow-[0_0_25px_rgba(6,182,212,0.6)]' : 'border-gray-700'} rounded-lg flex items-center justify-center overflow-hidden group transition-all duration-300`}>
                                    <div className="absolute inset-0 opacity-30 bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,currentColor_2px,currentColor_3px)] text-white" />

                                    <div className={`z-10 ${level.status === 'unlocked' ? 'text-cyan-400 group-hover:text-white' : 'text-gray-500'}`}>
                                        {level.status === 'locked' ? <AlertTriangle size={20} /> : <Bug size={24} />}
                                    </div>
                                </div>

                                {/* Reflected Floor Shadow */}
                                <div className="absolute top-16 w-12 h-2 bg-black/50 blur-sm rounded-full transform scale-x-150 opacity-50" />
                            </motion.div>

                            {/* Holo Card Popup */}
                            <AnimatePresence>
                                {hoveredLevel?.id === level.id && (
                                    <HoloCard
                                        level={level}
                                        x={`${level.x}%`}
                                        y={`${level.y}%`}
                                        alignment={level.x > 50 ? 'left' : 'right'}
                                    />
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

// --- Sub-Component: Active Combat View ---
const ActiveCombat = ({ bossId, onBack }) => {
    const { playerData, actions } = usePlayer();
    const { playSFX } = useSound();
    const [code, setCode] = useState("def spell():\n    return 'magic'");
    const [combatLog, setCombatLog] = useState(["Battle Started...", "Target Identified.", "System Ready."]);
    const [isExecuting, setIsExecuting] = useState(false);

    // Initialize Boss
    const [boss, setBoss] = useState(BOSSES[bossId] ? { ...BOSSES[bossId] } : { ...BOSSES.function_dragon, name: "Unknown Entity" });
    const [isHit, setIsHit] = useState(false);
    const [shake, setShake] = useState(false);
    const [floatingText, setFloatingText] = useState([]);

    const addLog = (msg) => setCombatLog(prev => [msg, ...prev].slice(0, 8));

    const spawnFloatingText = (text, type, x, y) => {
        const id = Date.now() + Math.random();
        setFloatingText(prev => [...prev, { id, text, type, x, y }]);
        setTimeout(() => setFloatingText(prev => prev.filter(ft => ft.id !== id)), 1000);
    };

    const triggerShake = () => {
        setShake(true);
        setTimeout(() => setShake(false), 500);
    };

    const handleExecute = async () => {
        setIsExecuting(true);
        addLog(">> Injecting Payload...");

        const result = await executePython(code);

        if (!result.success) {
            addLog(`Error: ${result.error}`);
            playSFX('ERROR');
            actions.takeDamage(5); // Self damage
            triggerShake();
            spawnFloatingText("-5 HP", "damage", 50, 50);
            setIsExecuting(false);
            return;
        }

        addLog(`Output: ${result.output}`);
        playSFX('ATTACK');

        const patterns = detectPatterns(code);
        const damageResult = calculateDamage(playerData, boss, { ...result, patterns });

        if (damageResult.damage > 0) {
            const newBossHp = Math.max(0, boss.hp - damageResult.damage);
            setBoss(prev => ({ ...prev, hp: newBossHp }));
            addLog(damageResult.message);
            setIsHit(true);
            setTimeout(() => setIsHit(false), 200);
            spawnFloatingText(damageResult.damage, damageResult.isCrit ? "crit" : "normal", 70, 30);
            if (damageResult.isCrit) triggerShake();

            if (newBossHp === 0) {
                addLog('VICTORY!');
                playSFX('SUCCESS');
                spawnFloatingText("VICTORY!", "crit", 50, 50);
                setIsExecuting(false);
                return;
            }
        }

        // Boss Retaliation
        setTimeout(() => {
            if (boss.hp > 0) {
                const bossDmg = calculateBossDamage(boss, playerData);
                actions.takeDamage(bossDmg);
                spawnFloatingText(`-${bossDmg}`, "damage", 30, 40);
                triggerShake();
                addLog(`${boss.name} attacks!`);
            }
            setIsExecuting(false);
        }, 800);
    };

    return (
        <div className="h-full flex flex-col relative">
            {/* Back Button Overlay */}
            <button
                onClick={onBack}
                className="absolute top-4 left-4 z-50 bg-black/50 border border-white/10 text-gray-400 px-3 py-1 rounded hover:bg-white/10 transition flex items-center gap-2"
            >
                <ChevronRight className="rotate-180" size={14} /> LEAVE ARENA
            </button>

            {/* Floating Text */}
            <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
                <AnimatePresence>
                    {floatingText.map(ft => (
                        <motion.div
                            key={ft.id}
                            initial={{ opacity: 1, y: ft.y + "%", x: ft.x + "%", scale: 0.5 }}
                            animate={{ opacity: 0, y: (ft.y - 15) + "%", scale: 1.5 }}
                            exit={{ opacity: 0 }}
                            className={`absolute font-extrabold ${ft.type === 'damage' ? 'text-red-500' : 'text-white'}`}
                        >
                            {ft.text}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full p-6 pt-16">
                {/* Left: Visuals */}
                <motion.div
                    className="flex flex-col gap-4"
                    animate={shake ? { x: [-5, 5, -5, 5, 0] } : {}}
                >
                    <div className="glass-panel p-6 flex-1 flex flex-col justify-center items-center relative group bg-black/40">
                        {/* Boss HP Bar */}
                        <div className="absolute top-4 w-64">
                            <div className="flex justify-between text-xs font-bold text-red-500 mb-1">
                                <span>{boss.name.toUpperCase()}</span>
                                <span>{Math.round(boss.hp)}/{boss.maxHp}</span>
                            </div>
                            <div className="h-2 bg-gray-900 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-red-600"
                                    animate={{ width: `${(boss.hp / boss.maxHp) * 100}%` }}
                                />
                            </div>
                        </div>
                        <DragonAvatar hp={boss.hp} maxHp={boss.maxHp} isHit={isHit} />
                    </div>

                    {/* Log */}
                    <div className="h-48 glass-panel bg-black/80 font-mono text-xs p-4 overflow-y-auto text-green-500/80">
                        {combatLog.map((l, i) => <div key={i}>&gt; {l}</div>)}
                    </div>
                </motion.div>

                {/* Right: Code */}
                <div className="glass-panel p-0 flex flex-col bg-[#111] border border-white/10 shadow-2xl">
                    <div className="bg-[#1a1a1a] p-2 border-b border-white/5 text-xs text-gray-500 font-mono flex items-center gap-2">
                        <Cpu size={14} /> COMBAT_TERMINAL_V2
                    </div>
                    <textarea
                        className="flex-1 bg-transparent text-gray-200 p-4 font-mono resize-none focus:outline-none"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        onKeyDown={(e) => (e.ctrlKey && e.key === 'Enter' ? handleExecute() : null)}
                    />
                    <div className="p-4 bg-[#1a1a1a] flex justify-end">
                        <Button onClick={handleExecute} disabled={isExecuting} className="flex gap-2 items-center">
                            {isExecuting ? 'EXECUTING...' : <>INJECT CODE <Play size={14} /></>}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Main Page Component ---
const BattleArena = () => {
    const [view, setView] = useState('MAP'); // 'MAP' or 'COMBAT'
    const [selectedLevelId, setSelectedLevelId] = useState(null);

    return (
        <PageLayout>
            <div className="h-[calc(100vh-64px)] w-full overflow-hidden mt-2 border border-white/10 rounded-lg relative z-0">
                <AnimatePresence mode="wait">
                    {view === 'MAP' ? (
                        <motion.div
                            key="map"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.1 }}
                            className="w-full h-full"
                        >
                            <BattleMap onSelectLevel={(id) => {
                                setSelectedLevelId(id);
                                setView('COMBAT');
                            }} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="combat"
                            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                            className="w-full h-full"
                        >
                            <ActiveCombat bossId={selectedLevelId} onBack={() => setView('MAP')} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </PageLayout>
    );
};

export default BattleArena;
