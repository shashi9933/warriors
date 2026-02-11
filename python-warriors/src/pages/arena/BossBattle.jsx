import React, { useState, useRef, useCallback, useEffect } from 'react';
import PageLayout from '../../components/layout/PageLayout';
import Button from '../../components/ui/Button';
import { usePlayer } from '../../context/PlayerContext';
import { executePython } from '../../engine/pythonExecutor';
import { detectPatterns } from '../../engine/patternDetector';
import { calculateDamage, calculateBossDamage } from '../../engine/combatEngine';
import { BOSSES } from '../../data/gameData';
import { Play, AlertTriangle, Cpu, Zap, Activity, Bug, ChevronRight, Skull, Crosshair, Shield, User, Battery, Wifi, Settings, Terminal as TerminalIcon, Code, Hash, Monitor, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSound } from '../../context/SoundContext';
import { useNavigate } from 'react-router-dom';
import TutorialModal from '../../components/ui/TutorialModal';

// --- Constants ---
const POWERS = [
    { id: 'OVERCLOCK', name: 'Overclock', icon: Zap, cost: 30, cooldown: 0, effect: 'Next attack deals 2x damage' },
    { id: 'SHIELD', name: 'Firewall', icon: Shield, cost: 40, cooldown: 0, effect: 'Block next boss attack' },
    { id: 'REFACTOR', name: 'Refactor', icon: Activity, cost: 50, cooldown: 0, effect: 'Heal 20% HP' }
];

// --- Sub-Component: Enhanced Boss Avatar ---
const BossAvatar = ({ isHit, phase }) => {
    return (
        <div className="relative w-full h-64 md:h-96 flex items-center justify-center">
            {/* Boss Aura / Glitch Effect */}
            <div className={`absolute inset-0 bg-gradient-to-t from-red-900/20 to-transparent rounded-full blur-3xl animate-pulse ${phase === 'GLITCH' ? 'opacity-80' : 'opacity-20'}`} />

            <motion.div
                className={`relative w-48 h-48 md:w-80 md:h-80 transition-all duration-100 
                    ${isHit ? 'scale-95 brightness-150 saturate-0' : 'animate-float'}
                    ${phase === 'GLITCH' ? 'skew-x-12 opacity-80' : ''}
                `}
                animate={phase === 'GLITCH' ? { x: [-2, 2, -2, 2, 0], opacity: [0.8, 1, 0.8] } : {}}
            >
                {/* Dynamic SVG based on Phase */}
                <svg viewBox="0 0 200 200" className={`w-full h-full drop-shadow-[0_0_50px_rgba(239,68,68,0.6)] ${phase === 'FIREWALL' ? 'opacity-50' : 'opacity-100'}`}>
                    <defs>
                        <linearGradient id="bossGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#ef4444" />
                            <stop offset="100%" stopColor="#7f1d1d" />
                        </linearGradient>
                        <filter id="glitch">
                            <feTurbulence type="fractalNoise" baseFrequency="0.15" numOctaves="1" result="turbulence" />
                            <feDisplacementMap in2="turbulence" in="SourceGraphic" scale="10" xChannelSelector="R" yChannelSelector="G" />
                        </filter>
                    </defs>

                    {/* Boss Shape */}
                    <path d="M100 20 L130 60 L180 50 L160 100 L190 150 L100 130 L80 180 L50 130 L10 150 L40 100 L20 50 L70 60 Z"
                        fill="url(#bossGrad)"
                        stroke="#fee2e2"
                        strokeWidth="2"
                        className={isHit ? "fill-white" : ""}
                        filter={phase === 'GLITCH' ? "url(#glitch)" : ""}
                    />

                    {/* Core Core */}
                    <circle cx="100" cy="90" r="15" fill="#000" stroke="#ef4444" strokeWidth="2" className="animate-pulse" />
                    <circle cx="100" cy="90" r="8" fill="#ef4444" />
                </svg>

                {/* Firewall Overlay */}
                {phase === 'FIREWALL' && (
                    <div className="absolute inset-0 border-4 border-orange-500 rounded-full animate-spin-slow opacity-60 border-dashed" />
                )}
            </motion.div>
        </div>
    );
};

// --- Sub-Component: Power Card ---
const PowerCard = ({ power, isActive, isCooldown, onClick }) => {
    return (
        <button
            onClick={onClick}
            disabled={isCooldown || isActive}
            className={`
                relative group flex flex-col items-center justify-center p-2 rounded-lg border transition-all duration-300 w-full
                ${isActive ? 'bg-cyan-500/20 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]' :
                    isCooldown ? 'bg-gray-800/50 border-gray-700 opacity-50 cursor-not-allowed' :
                        'bg-black/40 border-white/10 hover:bg-white/10 hover:border-white/30'}
            `}
        >
            <div className={`p-2 rounded-md mb-1 ${isActive ? 'bg-cyan-500 text-black' : 'bg-gray-800 text-gray-400 group-hover:text-white'}`}>
                <power.icon size={20} />
            </div>
            <div className="text-[10px] font-bold font-orbitron uppercase tracking-wider text-gray-300 group-hover:text-white">
                {power.name}
            </div>
            {isCooldown && (
                <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <span className="font-mono font-bold text-white text-xs">{power.cooldown}T</span>
                </div>
            )}
        </button>
    );
};

// --- Sub-Component: Roadmap Level Node ---
const RoadmapNode = ({ levelId, index, status, onSelect }) => {
    const boss = BOSSES[levelId];
    const isLocked = status === 'LOCKED';
    const isCompleted = status === 'COMPLETED';
    const isNext = status === 'NEXT';

    return (
        <div id={levelId} className={`flex items-center gap-4 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} w-full max-w-2xl mx-auto my-8 relative z-10 group`}>

            {/* Level Indicator (Circle) */}
            <motion.button
                whileHover={!isLocked ? { scale: 1.1 } : {}}
                whileTap={!isLocked ? { scale: 0.95 } : {}}
                onClick={() => !isLocked && onSelect(levelId)}
                className={`
                    w-16 h-16 md:w-20 md:h-20 rounded-full border-4 flex items-center justify-center relative shrink-0 z-20 transition-all duration-300
                    ${isLocked ? 'border-gray-700 bg-gray-900 text-gray-600 cursor-not-allowed grayscale' :
                        isCompleted ? 'border-green-500 bg-green-900/20 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.4)]' :
                            'border-cyan-400 bg-cyan-900/20 text-cyan-400 animate-pulse shadow-[0_0_30px_rgba(34,211,238,0.4)] ring-4 ring-cyan-500/20'}
                `}
            >
                {isCompleted ? <Code size={32} /> : isLocked ? <Lock size={24} /> : <Skull size={32} />}

                {/* Level Number Badge */}
                <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border ${isLocked ? 'bg-gray-800 border-gray-600' : 'bg-black border-white text-white'}`}>
                    {index + 1}
                </div>
            </motion.button>

            {/* Connecting Line (Part of the road) - Visual only, main line handled by SVG */}

            {/* Level Info Card */}
            <div className={`flex-1 ${index % 2 === 0 ? 'text-left' : 'text-right'}`}>
                <div className={`
                    inline-block p-4 rounded-xl border backdrop-blur-sm transition-all duration-300
                    ${isLocked ? 'border-white/5 bg-black/40 opacity-50' :
                        isNext ? 'border-cyan-500/50 bg-black/80 shadow-lg transform scale-105' :
                            'border-green-500/30 bg-black/60'}
                `}>
                    <h3 className={`font-orbitron font-bold text-sm md:text-lg ${isLocked ? 'text-gray-500' : isNext ? 'text-cyan-400' : 'text-green-400'}`}>
                        {boss?.name || "Unknown Sector"}
                    </h3>
                    {!isLocked && (
                        <p className="text-xs text-gray-400 mt-1 font-mono max-w-[200px] md:max-w-xs">{boss?.description}</p>
                    )}
                    {isNext && <div className="text-[10px] text-cyan-500 uppercase tracking-widest mt-2 animate-pulse">&gt;&gt; CURRENT OBJECTIVE</div>}
                    {isCompleted && <div className="text-[10px] text-green-500 uppercase tracking-widest mt-2">MISSION ACCOMPLISHED</div>}
                </div>
            </div>
        </div>
    );
};

// --- Sub-Component: Battle Map View (Roadmap) ---
const BattleMap = ({ onSelectLevel }) => {
    // Define the progression path (IDs match gameData keys)
    const LEVEL_IDS = [
        "lvl_1_syntax", "lvl_2_vars", "lvl_3_math", "lvl_4_strings", "lvl_5_lists",
        "lvl_6_conditions", "lvl_7_loops", "lvl_8_while", "lvl_9_functions", "lvl_10_scope",
        "lvl_11_dicts", "lvl_12_sets", "lvl_13_classes", "lvl_14_modules", "lvl_15_async"
    ];

    // Locked state logic (Mocked for now - Level 1 is Next, others locked)
    // In real app, check user progress. defaulting to level 1 unlocked.
    const completedLevels = []; // Add logic to read from user state
    const currentLevelId = "lvl_1_syntax";

    // Auto-scroll to current level
    useEffect(() => {
        const currentElement = document.getElementById(currentLevelId);
        if (currentElement) {
            currentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [currentLevelId]);

    return (
        <div className="relative w-full h-full bg-[#050510] overflow-y-auto custom-scrollbar flex flex-col font-orbitron pb-10">
            {/* Background Tech Grid */}
            <div className="fixed inset-0 bg-[linear-gradient(rgba(30,58,138,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(30,58,138,0.1)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none" />

            <div className="text-center py-10 z-10 relative">
                <h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-600 mb-2">CAMPAIGN MAP</h2>
                <div className="text-cyan-500 text-xs tracking-[0.3em] uppercase">Sector: Python Core</div>
            </div>

            <div className="relative w-full max-w-4xl mx-auto px-4 flex-1">
                {/* Central Road Line (SVG) */}
                <div className="absolute left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 bg-gradient-to-b from-cyan-500 via-purple-500 to-red-500 opacity-20 hidden md:block" />

                <div className="flex flex-col gap-8 pb-10">
                    {/* Rendering Top-Down 1 -> 15 (Level 1 at Top) */}

                    {LEVEL_IDS.map((id, index) => {
                        let status = 'LOCKED';
                        if (completedLevels.includes(id)) status = 'COMPLETED';
                        else if (id === currentLevelId) status = 'NEXT';

                        // Temporary unlock all for testing if needed, or stick to strict
                        // For demo, let's unlock first 3
                        if (index < 3) if (index === 0) status = 'NEXT'; else if (index < 3) status = 'LOCKED'; // Wait logic needs fix

                        // Better Logic for Demo:
                        // If index is 0, it's NEXT (if not completed).
                        // Let's rely on passed prop or simple local logic
                        if (index === 0) status = 'NEXT'; // Force level 1 open

                        return (
                            <RoadmapNode
                                key={id}
                                levelId={id}
                                index={index}
                                status={status}
                                onSelect={onSelectLevel}
                            />
                        );
                    })}
                </div>
            </div>

            {/* Bottom Fade */}
            <div className="fixed bottom-0 inset-x-0 h-20 bg-gradient-to-t from-[#050510] to-transparent pointer-events-none z-20" />
        </div>
    );
};

// --- Sub-Component: Top Status Bar ---
const TopStatusBar = ({ player, boss }) => {
    return (
        <div className="h-12 bg-[#0a0a10] border-b border-white/10 flex items-center justify-between px-4 z-50 shrink-0">
            {/* Left: Player Status */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                        <User size={16} className="text-white" />
                    </div>
                    <div>
                        <div className="text-[10px] text-gray-400 font-mono leading-none">LVL {player?.level || 12}</div>
                        <div className="text-sm font-bold text-white font-orbitron leading-none">{player?.name || "LOOP KNIGHT"}</div>
                    </div>
                </div>
                {/* XP Bar */}
                <div className="hidden md:flex flex-col gap-0.5 w-32">
                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <motion.div className="h-full bg-blue-500" initial={{ width: 0 }} animate={{ width: `${(player?.xp / player?.maxXp) * 100 || 45}%` }} />
                    </div>
                    <div className="text-[9px] text-blue-400 font-mono text-right">XP: {player?.xp || 450}/{player?.maxXp || 1200}</div>
                </div>
            </div>

            {/* Center: Environment Info */}
            <div className="hidden md:flex items-center gap-4 text-gray-500 text-xs font-mono">
                <div className="flex items-center gap-1.5"><Wifi size={14} /> NET_STABLE</div>
                <div className="flex items-center gap-1.5"><Battery size={14} /> SYS_OPTIMAL</div>
            </div>

            {/* Right: Boss Status (Compact) */}
            <div className="flex items-center gap-4">
                <div className="text-right">
                    <div className="text-[10px] text-red-400 font-mono leading-none">TARGET</div>
                    <div className="text-sm font-bold text-red-500 font-orbitron leading-none">{boss.name}</div>
                </div>
                <div className="w-8 h-8 rounded border border-red-500/30 bg-red-900/10 flex items-center justify-center">
                    <Skull size={16} className="text-red-500" />
                </div>
                <div className="h-6 w-[1px] bg-white/10 mx-2" />
                <button className="text-gray-400 hover:text-white"><Settings size={18} /></button>
            </div>
        </div>
    );
};

// --- Sub-Component: Player Stats Panel (Bottom Left) ---
const PlayerStats = ({ player, rage, focus }) => {
    return (
        <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black via-black/80 to-transparent">
            <div className="flex flex-col gap-3">
                {/* HP */}
                <div>
                    <div className="flex justify-between text-xs font-bold text-green-400 mb-1">
                        <span>HP INTEGRITY</span>
                        <span>{player.hp}/{player.maxHp}</span>
                    </div>
                    <div className="h-2 bg-gray-900 rounded-full overflow-hidden border border-green-900/30">
                        <motion.div
                            className="h-full bg-gradient-to-r from-green-600 to-emerald-400"
                            animate={{ width: `${(player.hp / player.maxHp) * 100}%` }}
                        />
                    </div>
                </div>

                <div className="flex gap-4">
                    {/* Rage Meter (Red) */}
                    <div className="flex-1">
                        <div className="flex justify-between text-[10px] font-bold text-red-400 mb-1">
                            <span>RAGE</span>
                            <span>{rage}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-900 rounded-full overflow-hidden border border-red-900/30">
                            <motion.div className="h-full bg-red-600" animate={{ width: `${rage}%` }} />
                        </div>
                    </div>
                    {/* Focus Meter (Blue) */}
                    <div className="flex-1">
                        <div className="flex justify-between text-[10px] font-bold text-cyan-400 mb-1">
                            <span>FOCUS</span>
                            <span>{focus}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-900 rounded-full overflow-hidden border border-cyan-900/30">
                            <motion.div className="h-full bg-cyan-600" animate={{ width: `${focus}%` }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
// --- Sub-Component: Visual Effect Overlay ---
const VisualEffectOverlay = ({ effect }) => {
    if (!effect) return null;

    return (
        <div className="absolute inset-0 pointer-events-none z-40 flex items-center justify-center">
            {effect === 'SLASH' && (
                <motion.div
                    initial={{ pathLength: 0, opacity: 1 }} animate={{ pathLength: 1, opacity: 0 }} transition={{ duration: 0.3 }}
                    className="w-full h-full"
                >
                    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_10px_rgba(0,255,255,0.8)]">
                        <motion.path d="M 10 10 L 90 90" stroke="cyan" strokeWidth="2" fill="none"
                            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                        />
                    </svg>
                </motion.div>
            )}
            {effect === 'EXPLOSION' && (
                <motion.div
                    initial={{ scale: 0, opacity: 1 }} animate={{ scale: 3, opacity: 0 }} transition={{ duration: 0.5 }}
                    className="w-32 h-32 bg-orange-500/50 rounded-full blur-xl"
                />
            )}
            {effect === 'SHIELD_HIT' && (
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-blue-500/20"
                />
            )}
        </div>
    );
};

// --- Sub-Component: Visual Battle Panel ---
const VisualPanel = ({ boss, phase, isHit, player, floatingText, rage, focus, visualEffect }) => {
    return (
        <div className="relative w-full h-[40vh] md:h-full bg-black/40 border-r border-white/10 overflow-hidden group">
            {/* Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px]" />

            {/* Visual Effect Overlay */}
            <AnimatePresence>
                {visualEffect && <VisualEffectOverlay effect={visualEffect} />}
            </AnimatePresence>

            {/* Boss Avatar Centered */}
            <div className="absolute inset-x-0 bottom-24 md:top-1/2 md:-translate-y-1/2 flex justify-center z-10">
                <BossAvatar hp={boss.hp} maxHp={boss.maxHp} isHit={isHit} phase={phase} />
            </div>

            {/* Boss HP Overlay (Top) */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 w-3/4 max-w-lg z-20">
                <div className="flex justify-between text-xs font-mono text-red-500 mb-1 font-bold tracking-wider">
                    <span>{boss.name}</span>
                    <span>{(boss.hp / boss.maxHp * 100).toFixed(0)}%</span>
                </div>
                <div className="h-4 bg-black/50 backdrop-blur border border-red-500/30 rounded-full overflow-hidden p-0.5">
                    <motion.div
                        className="h-full bg-gradient-to-r from-red-600 via-orange-500 to-red-600 bg-[length:200%_100%] animate-pulse"
                        animate={{ width: `${(boss.hp / boss.maxHp) * 100}%` }}
                    />
                </div>
            </div>

            {/* Player Stats Overlay (Bottom) */}
            <PlayerStats player={player} rage={rage} focus={focus} />

            {/* Floating Text */}
            <div className="absolute inset-0 pointer-events-none z-50">
                <AnimatePresence>
                    {floatingText.map(ft => (
                        <motion.div
                            key={ft.id}
                            initial={{ opacity: 1, y: ft.y + "%", x: ft.x + "%", scale: 0.5 }}
                            animate={{ opacity: 0, y: (ft.y - 15) + "%", scale: 1.5 }}
                            exit={{ opacity: 0 }}
                            className={`absolute font-black text-2xl drop-shadow-md ${ft.type === 'damage' ? 'text-red-500' : ft.type === 'crit' ? 'text-yellow-400' : 'text-white'}`}
                        >
                            {ft.text}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

// --- Sub-Component: Terminal Panel (Right Side) ---
const TerminalPanel = ({ code, setCode, logs, isExecuting, quest }) => {
    return (
        <div className="flex flex-col h-full bg-[#0a0a10] border-l border-white/10 font-mono text-sm relative">
            {/* 1. Quest Panel (Top 15%) */}
            <div className="h-[15%] min-h-[100px] border-b border-white/10 bg-black/40 p-4 flex flex-col justify-center relative overflow-hidden">
                <div className="absolute top-2 right-2 text-[10px] text-gray-600">MISSION_ID: BOSS_01</div>
                <div className="flex items-start gap-3 relative z-10">
                    <div className="p-2 bg-yellow-500/10 rounded border border-yellow-500/20 text-yellow-500">
                        <TerminalIcon size={18} />
                    </div>
                    <div>
                        <div className="text-yellow-500 text-xs font-bold mb-0.5 uppercase tracking-wider">{quest.title || "Current Objective"}</div>
                        <div className="text-gray-300 text-sm leading-tight">{quest.desc || "Analyze pattern."}</div>
                        <div className="text-gray-500 text-xs mt-1 flex items-center gap-2">
                            <span className="bg-gray-800 px-1.5 py-0.5 rounded text-[10px]">CONSTRAINT</span>
                            {quest.constraint || "None"}
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Code Editor (Middle 55%) */}
            <div className="flex-1 relative bg-[#1e1e1e] flex flex-col min-h-0">
                {/* Editor Header */}
                <div className="h-8 bg-[#252526] flex items-center px-4 text-xs text-gray-400 gap-4 border-b border-[#333]">
                    <div className="flex items-center gap-1 text-cyan-400"><Code size={12} /> spell.py</div>
                    <div className="flex-1" />
                    <div className="flex items-center gap-1 hover:text-white cursor-pointer"><Monitor size={12} /> AST: Valid</div>
                </div>

                {/* Editor Content */}
                <div className="flex-1 relative flex overflow-hidden">
                    {/* Line Numbers (Fake for visual) */}
                    <div className="w-10 bg-[#1e1e1e] border-r border-[#333] flex flex-col items-end pr-2 pt-4 text-gray-600 font-mono text-xs select-none">
                        {Array.from({ length: 20 }).map((_, i) => <div key={i} className="leading-6">{i + 1}</div>)}
                    </div>
                    {/* Textarea */}
                    <textarea
                        className="flex-1 h-full bg-[#1e1e1e] text-gray-300 p-4 pt-4 leading-6 focus:outline-none resize-none custom-scrollbar font-mono text-sm border-none"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="# Initiate combat protocol..."
                        spellCheck={false}
                    />
                </div>
            </div>

            {/* 3. Console Output (Bottom 30%) */}
            <div className="h-[30%] min-h-[150px] bg-black border-t border-white/10 flex flex-col font-mono text-xs">
                <div className="h-8 bg-gray-900/50 flex items-center px-4 text-gray-500 border-b border-white/5 gap-2">
                    <Hash size={12} /> CONSOLE OUTPUT
                </div>
                <div className="flex-1 p-4 overflow-y-auto custom-scrollbar text-green-500/90 space-y-1">
                    {logs.map((l, i) => (
                        <div key={i} className="break-words border-l-2 border-transparent hover:border-green-500/30 pl-2 transition-colors">
                            <span className="opacity-50 mr-2 text-[10px]">{new Date().toLocaleTimeString().split(' ')[0]}</span>
                            {l}
                        </div>
                    ))}
                    {isExecuting && <div className="text-cyan-400 animate-pulse">&gt;&gt; COMPILING SPELL...</div>}
                </div>
            </div>
        </div>
    );
};

// --- Sub-Component: Bottom Action Bar ---
const BottomActionBar = ({ onExecute, isExecuting, activePowers, powerCharge, onPowerClick, powersList }) => {
    return (
        <div className="h-20 bg-[#0a0a10] border-t border-white/10 flex items-center px-6 gap-6 z-50 shrink-0 relative shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">

            {/* Left: Mini Log (Hidden on mobile) */}
            <div className="hidden md:flex flex-1 items-center gap-2 text-xs text-gray-500">
                <Activity size={14} className="text-gray-600" />
                <span className="animate-pulse">SYSTEM READY. Awaiting input...</span>
            </div>

            {/* Center: EXECUTE BUTTON (Main CTA) */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-4 md:bottom-2">
                <button
                    onClick={onExecute}
                    disabled={isExecuting}
                    className={`
                        relative group flex items-center justify-center gap-3 
                        w-64 h-16 rounded-xl font-bold font-orbitron tracking-widest text-lg transition-all duration-200
                        ${isExecuting ? 'bg-gray-800 text-gray-500 cursor-not-allowed border-gray-700' : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_30px_rgba(8,145,178,0.4)] hover:shadow-[0_0_50px_rgba(8,145,178,0.6)] border-cyan-400'}
                        border-2 transform hover:-translate-y-1
                    `}
                >
                    {isExecuting ? <Activity className="animate-spin" /> : <Play className="fill-current" />}
                    {isExecuting ? 'COMPILING...' : 'EXECUTE SPELL'}

                    {/* Button Glitch Decoration */}
                    {!isExecuting && (
                        <>
                            <div className="absolute top-0 right-0 w-2 h-2 bg-white rounded-bl opacity-50" />
                            <div className="absolute bottom-0 left-0 w-2 h-2 bg-white rounded-tr opacity-50" />
                        </>
                    )}
                </button>
            </div>

            {/* Right: Ultimate Hotbar */}
            <div className="flex-1 flex justify-end gap-3">
                {powersList.map(p => (
                    <div key={p.id} className="w-12 h-12 md:w-14 md:h-14">
                        <button
                            onClick={() => onPowerClick(p)}
                            disabled={activePowers.includes(p.id) || powerCharge < p.cost}
                            className={`
                                w-full h-full rounded-lg border flex flex-col items-center justify-center relative overflow-hidden transition-all
                                ${activePowers.includes(p.id) ? 'bg-cyan-500/20 border-cyan-400' :
                                    powerCharge < p.cost ? 'bg-gray-900/50 border-gray-800 opacity-50' : 'bg-gray-900 border-gray-700 hover:border-cyan-500 hover:bg-gray-800'}
                            `}
                        >
                            <p.icon size={20} className={activePowers.includes(p.id) ? 'text-cyan-400' : 'text-gray-400'} />

                            {/* Cooldown/Cost Overlay */}
                            {powerCharge < p.cost && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                    <span className="text-[10px] font-bold text-gray-500">{p.cost}</span>
                                </div>
                            )}

                            {/* Active Indicator */}
                            {activePowers.includes(p.id) && <div className="absolute inset-0 border-2 border-cyan-400 rounded-lg animate-pulse" />}
                        </button>
                    </div>
                ))}

                {/* Meter Display for Hotbar */}
                <div className="flex flex-col justify-center items-end gap-1 ml-2">
                    <div className="text-[10px] font-mono text-cyan-400">CHARGE</div>
                    <div className="w-1.5 h-10 bg-gray-800 rounded-full overflow-hidden flex flex-col justify-end">
                        <motion.div className="w-full bg-cyan-500" animate={{ height: `${powerCharge}%` }} />
                    </div>
                </div>
            </div>
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

    // Game State
    const [boss, setBoss] = useState(BOSSES[bossId] ? { ...BOSSES[bossId] } : { ...BOSSES.lvl_9_functions, name: "Unknown Entity" });
    const [phase, setPhase] = useState('NORMAL'); // NORMAL, FIREWALL, GLITCH
    const [powerCharge, setPowerCharge] = useState(0); // 0-100
    const [activePowers, setActivePowers] = useState([]); // List of active effects
    const [floatingText, setFloatingText] = useState([]);
    const [visualEffect, setVisualEffect] = useState(null);
    const [rage, setRage] = useState(0);
    const [focus, setFocus] = useState(100);

    // Tutorial Data
    const tutorialSlides = [
        {
            title: "BOSS BATTLE PROTOCOL",
            description: "Engage the Enemy Algorithm using Python code. Your goal is to reduce their HP to zero while maintaining your system integrity.",
            icon: TerminalIcon,
        },
        {
            title: "CODING COMBAT",
            description: "Type valid Python code in the terminal to execute attacks. Use 'attack()' for basic damage or 'loop(n)' for combos.",
            icon: Code,
            content: (
                <div className="font-mono text-xs text-green-400 bg-black p-3 rounded border border-gray-700">
                    <div className="text-gray-500 mb-1"># Example Attack</div>
                    <span className="text-purple-400">def</span> <span className="text-yellow-400">execute_strike</span>():<br />
                    &nbsp;&nbsp;attack(boss)<br />
                    &nbsp;&nbsp;<span className="text-blue-400">return</span> True
                </div>
            )
        },
        {
            title: "PHASE SHIFTS",
            description: "Bosses have phases. 'Firewall' reduces incoming damage. 'Glitch' is chaotic and dangerous. Adapt your strategy.",
            icon: AlertTriangle,
        },
        {
            title: "SYSTEM RESOURCES",
            description: "Manage your HP (Health), Focus (Mana for special moves), and Rage (Ultimate ability charge).",
            icon: Activity,
        }
    ];

    // Powers Definition (Using global constant)

    const addLog = useCallback((msg) => {
        setCombatLog(prev => [msg, ...prev].slice(0, 10));
    }, []);
    const triggerVisualEffect = useCallback((effect) => {
        setVisualEffect(effect);
        setTimeout(() => setVisualEffect(null), 500);
    }, []);

    const spawnFloatingText = useCallback((text, type, x, y) => {
        const id = Date.now().toString() + Math.random().toString();
        setFloatingText(prev => [...prev, { id, text, type, x, y }]);
        setTimeout(() => setFloatingText(prev => prev.filter(ft => ft.id !== id)), 1000);
    }, []);

    const handlePower = (power) => {
        if (powerCharge >= power.cost) {
            setPowerCharge(prev => prev - power.cost);
            playSFX('POWER_UP');
            addLog(`>> SYSTEM: Activated ${power.name}`);

            if (power.id === 'REFACTOR') {
                actions.heal(playerData.maxHp * 0.2);
                spawnFloatingText("+HP", "heal", 50, 50);
            } else {
                setActivePowers(prev => [...prev, power.id]);
            }
        } else {
            playSFX('ERROR');
        }
    };

    const handleExecute = async () => {
        setIsExecuting(true);
        addLog(">> Injecting Payload...");

        const result = await executePython(code);
        let moveDamage = 0;

        if (!result.success) {
            addLog(`Error: ${result.error}`);
            playSFX('ERROR');
            actions.takeDamage(5);
            // Shake effect here
            spawnFloatingText("-5 HP", "damage", 50, 50);
        } else {
            addLog(`Output: ${result.output}`);
            playSFX('ATTACK');

            const patterns = detectPatterns(code);
            // Visual Mappings
            if (patterns.loops) triggerVisualEffect('SLASH');
            else if (patterns.conditionals) triggerVisualEffect('EXPLOSION');
            else triggerVisualEffect('SLASH');
            const baseDamage = calculateDamage(playerData, boss, { ...result, patterns }).damage;

            moveDamage = baseDamage;
            if (activePowers.includes('OVERCLOCK')) {
                moveDamage *= 2;
                setActivePowers(prev => prev.filter(p => p !== 'OVERCLOCK'));
                spawnFloatingText("OVERCLOCK!", "crit", 50, 20);
            }

            if (moveDamage > 0) {
                // Check Phases
                if (phase === 'FIREWALL') {
                    moveDamage = Math.floor(moveDamage * 0.5); // 50% reduction
                    addLog(">> DAMAGE REDUCED BY FIREWALL");
                }

                const newBossHp = Math.max(0, boss.hp - moveDamage);
                setBoss(prev => ({ ...prev, hp: newBossHp }));
                spawnFloatingText(moveDamage, "normal", 70, 30);
                setPowerCharge(prev => Math.min(100, prev + 15)); // Charge power

                // Phase Transitions
                if (newBossHp < boss.maxHp * 0.6 && phase === 'NORMAL') {
                    setPhase('FIREWALL');
                    addLog(">> WARNING: BOSS ENABLED FIREWALL");
                    playSFX('ALERT');
                } else if (newBossHp < boss.maxHp * 0.3 && phase === 'FIREWALL') {
                    setPhase('GLITCH');
                    addLog(">> CRITICAL: BOSS ENTRING GLITCH STATE");
                    playSFX('GLITCH');
                }

                if (newBossHp === 0) {
                    addLog('VICTORY!');
                    playSFX('SUCCESS');
                    setIsExecuting(false);
                    return;
                }
            }
        }

        // Boss Retaliation
        setTimeout(() => {
            if (boss.hp > 0) {
                let bossDmg = calculateBossDamage(boss, playerData);

                if (activePowers.includes('SHIELD')) {
                    bossDmg = 0;
                    setActivePowers(prev => prev.filter(p => p !== 'SHIELD'));
                    addLog(">> ATTACK BLOCKED BY FIREWALL");
                    spawnFloatingText("BLOCKED", "heal", 50, 50);
                    triggerVisualEffect('SHIELD_HIT');
                } else {
                    actions.takeDamage(bossDmg);
                    spawnFloatingText(`-${bossDmg}`, "damage", 30, 40);
                    addLog(`${boss.name} attacks!`);
                }
            }
            setIsExecuting(false);
        }, 800);
    };

    return (
        <div className="h-full flex flex-col bg-[#050510] overflow-hidden relative">
            <TutorialModal tutorialId="boss_battle_combat" slides={tutorialSlides} />
            <TopStatusBar player={playerData} boss={boss} />

            <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
                {/* Left Panel (Visuals) */}
                <div className="h-[45vh] md:h-full md:w-[40%] shrink-0">
                    <VisualPanel boss={boss} phase={phase} isHit={false} player={playerData} floatingText={floatingText} rage={rage} focus={focus} visualEffect={visualEffect} />
                </div>

                {/* Right Panel (Terminal) */}
                <div className="flex-1 h-full min-w-0">
                    <TerminalPanel code={code} setCode={setCode} logs={combatLog} isExecuting={isExecuting} quest={{}} />
                </div>
            </div>

            <BottomActionBar
                onExecute={handleExecute}
                isExecuting={isExecuting}
                activePowers={activePowers}
                powerCharge={powerCharge}
                onPowerClick={handlePower}
                powersList={POWERS}
            />

            {/* Absolute Back Button for Desktop (if needed) or handle via TopBar later. 
                For now, TopBar has no back button logic, so adding a floating one for safety 
                if the user gets stuck. 
            */}
            <button onClick={onBack} className="absolute top-14 left-4 z-50 md:hidden bg-black/50 p-2 rounded-full border border-white/10">
                <ChevronRight className="rotate-180 text-white" size={20} />
            </button>
        </div>
    );
};

// --- Main Page Component ---
const BossBattle = () => {
    const [view, setView] = useState('MAP');
    const [selectedLevelId, setSelectedLevelId] = useState(null);
    const navigate = useNavigate();

    return (
        <PageLayout>
            {view === 'MAP' && (
                <div className="absolute top-20 left-6 z-50">
                    <button onClick={() => navigate('/battle-arena')} className="flex items-center gap-2 text-cyan-400 hover:text-white transition-colors text-sm font-bold tracking-widest uppercase">
                        <ChevronRight className="rotate-180" size={16} /> Return to Hub
                    </button>
                </div>
            )}

            <div className="flex-1 w-full overflow-hidden mt-1 border border-white/10 rounded-lg relative z-0 bg-black">
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
                            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
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

export default BossBattle;
