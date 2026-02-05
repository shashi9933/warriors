import React, { useState, useEffect } from 'react';
import PageLayout from '../components/layout/PageLayout';
import Button from '../components/ui/Button';
import { usePlayer } from '../context/PlayerContext';
import { executePython } from '../engine/pythonExecutor';
import { detectPatterns } from '../engine/patternDetector';
import { calculateDamage, calculateBossDamage } from '../engine/combatEngine';
import { BOSSES } from '../data/gameData';
import { Terminal, Play, AlertTriangle, Cpu, Zap, Activity, Bug } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSound } from '../context/SoundContext';

const DragonAvatar = ({ hp, maxHp, isHit }) => {
    return (
        <div className={`relative w-64 h-64 transition-all duration-100 ${isHit ? 'scale-95 brightness-150 saturate-0' : 'animate-float'}`}>
            <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_0_30px_rgba(239,68,68,0.4)]">
                <defs>
                    <linearGradient id="dragonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ef4444" />
                        <stop offset="100%" stopColor="#7f1d1d" />
                    </linearGradient>
                    <filter id="glitch">
                        <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="3" result="noise" />
                        <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" />
                    </filter>
                </defs>

                {/* Main Body */}
                <path
                    d="M100 40 L120 70 L160 60 L140 100 L170 140 L100 120 L80 160 L60 120 L30 140 L50 90 L40 60 L80 70 Z"
                    fill="url(#dragonGrad)"
                    stroke="#fee2e2"
                    strokeWidth="2"
                    className={isHit ? "fill-white" : ""}
                />

                {/* Eyes */}
                <circle cx="90" cy="80" r="4" fill="#fbbf24" className="animate-pulse" />
                <circle cx="110" cy="80" r="4" fill="#fbbf24" className="animate-pulse" />

                {/* Core */}
                <circle cx="100" cy="100" r="10" fill="transparent" stroke="#fbbf24" strokeWidth="2" className="animate-spin-slow" />
            </svg>

            {/* Glitch Overlay */}
            <div className="absolute inset-0 bg-red-500/10 mix-blend-overlay clip-glitch animate-pulse-fast pointer-events-none" />
        </div>
    );
};

const BattleArena = () => {
    const { playerData, actions } = usePlayer();
    const { playSFX } = useSound();
    const [code, setCode] = useState("def spell():\n    return 'magic'");
    const [combatLog, setCombatLog] = useState(["Battle Started...", "Target: Function Dragon identified.", "System: Ready for code injection."]);
    const [isExecuting, setIsExecuting] = useState(false);

    // Boss State
    const [selectedBossId, setSelectedBossId] = useState('function_dragon');
    // Boss State initialized based on selection, but we'll use an effect to update it
    const [boss, setBoss] = useState({ ...BOSSES.function_dragon });
    const [isHit, setIsHit] = useState(false);

    // Update boss when selection changes
    useEffect(() => {
        setBoss({ ...BOSSES[selectedBossId] });
        addLog(`Target switched: ${BOSSES[selectedBossId].name}`);
    }, [selectedBossId]);

    // Visual Effects State
    const [floatingText, setFloatingText] = useState([]);
    const [shake, setShake] = useState(false);

    const addLog = (msg) => setCombatLog(prev => [msg, ...prev].slice(0, 8));

    const spawnFloatingText = (text, type, x, y) => {
        const id = Date.now() + Math.random();
        setFloatingText(prev => [...prev, { id, text, type, x, y }]);
        setTimeout(() => {
            setFloatingText(prev => prev.filter(ft => ft.id !== id));
        }, 1000);
    };

    const triggerShake = () => {
        setShake(true);
        setTimeout(() => setShake(false), 500);
    };

    const handleExecute = async () => {
        setIsExecuting(true);
        addLog(">> Injecting Payload...");

        // 1. Execute Code
        const result = await executePython(code);

        if (!result.success) {
            addLog(`Error: ${result.error}`);
            playSFX('ERROR');
            actions.buildRage(15);
            // Self damage on error
            actions.takeDamage(5);
            triggerShake();
            spawnFloatingText("-5 HP", "damage", 50, 50);
            setIsExecuting(false);
            return;
        }

        addLog(`Output: ${result.output}`);
        playSFX('ATTACK');

        // 2. Detect Patterns
        const patterns = detectPatterns(code);

        // 3. Calculate Damage
        const damageResult = calculateDamage(playerData, boss, { ...result, patterns });

        // 4. Apply Player Effects
        if (damageResult.damage > 0) {
            // Damage Boss
            const newBossHp = Math.max(0, boss.hp - damageResult.damage);
            setBoss(prev => ({ ...prev, hp: newBossHp }));
            addLog(damageResult.message);

            // Stats Tracking
            actions.updateStats({
                totalDamage: damageResult.damage,
                criticalHits: damageResult.isCrit ? 1 : 0,
                recursionsUsed: patterns.hasRecursion ? 1 : 0,
                loopsUsed: (code.match(/for |while /g) || []).length
            });

            // Visuals
            setIsHit(true);
            setTimeout(() => setIsHit(false), 200);

            spawnFloatingText(damageResult.damage, damageResult.isCrit ? "crit" : "normal", 70, 30);
            if (damageResult.isCrit) triggerShake();

            actions.buildFocus(10);

            if (newBossHp === 0) {
                addLog(`VICTORY! The ${boss.name} is defeated!`);
                playSFX('SUCCESS');
                spawnFloatingText("VICTORY!", "crit", 50, 50);
                actions.gainXP(500);
                actions.updateStats({ bossesDefeated: 1 }); // Track Kill
                setIsExecuting(false);
                return;
            }
        }

        // 5. Boss Turn & Mechanics
        setTimeout(() => {
            if (boss.hp > 0) {
                // Boss Attack
                const bossDmg = calculateBossDamage(boss, playerData);
                actions.takeDamage(bossDmg);
                spawnFloatingText(`-${bossDmg}`, "damage", 30, 40);
                triggerShake();

                // Special Boss Mechanics
                if (boss.id === 'memory_leech') {
                    // Heal Self
                    const healAmt = 15;
                    setBoss(prev => ({ ...prev, hp: Math.min(prev.maxHp, prev.hp + healAmt) }));
                    spawnFloatingText(`+${healAmt} HP`, "normal", 60, 20);

                    // Drain Focus
                    actions.buildFocus(-20);
                    addLog(`Memory Leech drains 20 Focus! Heals ${healAmt} HP.`);
                } else {
                    addLog(`${boss.name} hits you for ${bossDmg} damage!`);
                }
            }
            setIsExecuting(false);
        }, 800);
    };

    return (
        <PageLayout>
            {/* Floating Text Overlay */}
            <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
                <AnimatePresence>
                    {floatingText.map(ft => (
                        <motion.div
                            key={ft.id}
                            initial={{ opacity: 1, y: ft.y + "%", x: ft.x + "%", scale: 0.5 }}
                            animate={{ opacity: 0, y: (ft.y - 15) + "%", scale: 1.5 }}
                            exit={{ opacity: 0 }}
                            className={`absolute font-orbitron font-bold drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] text-2xl
                                ${ft.type === 'crit' ? 'text-yellow-400 text-5xl stroke-black' : ''}
                                ${ft.type === 'damage' ? 'text-red-500' : ''}
                                ${ft.type === 'normal' ? 'theme-text' : ''}
                            `}
                        >
                            {ft.text}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-140px)]">

                {/* Left Col: Combat View */}
                <motion.div
                    className="flex flex-col gap-4"
                    animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
                    transition={{ duration: 0.3 }}
                >
                    {/* Boss Arena */}
                    <div className="glass-panel p-6 flex-1 flex flex-col justify-center items-center relative overflow-hidden group">
                        {/* Background Grid */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(239,68,68,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(239,68,68,0.05)_1px,transparent_1px)] bg-[size:40px_40px] perspective-[500px] rotate-x-12" />

                        <div className="absolute top-4 left-4 text-xs font-mono text-red-400 flex items-center gap-2">
                            <Bug size={14} /> HOSTILE ENTITY DETECTED
                        </div>

                        <div className="relative z-10 flex flex-col items-center gap-6">
                            <DragonAvatar hp={boss.hp} maxHp={boss.maxHp} isHit={isHit} />

                            {/* Boss HUD */}
                            <div className="w-full max-w-sm space-y-2">
                                <div className="flex justify-between items-end text-sm font-bold text-red-500 font-orbitron">
                                    <span>{boss.name.toUpperCase()}</span>
                                    <span>{(boss.hp / boss.maxHp * 100).toFixed(0)}%</span>
                                </div>
                                <div className="h-4 bg-black/50 border border-red-900/50 rounded-sm overflow-hidden relative skew-x-[-12deg]">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-red-600 to-orange-600"
                                        initial={{ width: "100%" }}
                                        animate={{ width: `${(boss.hp / boss.maxHp) * 100}%` }}
                                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Debug Suite Analysis (Only if Unlocked) */}
                        {playerData.advancedSkills?.debug_suite && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="w-full max-w-sm mt-4 p-3 bg-black/60 border border-pink-500/30 rounded backdrop-blur-sm"
                            >
                                <div className="flex items-center gap-2 text-pink-400 font-orbitron text-xs mb-1">
                                    <Scan size={12} /> TACTICAL ANALYSIS
                                </div>
                                <div className="text-[10px] font-mono text-gray-400">
                                    Scan Complete. Target Vulnerability:
                                    <span className="theme-text block mt-1 font-bold">
                                        {boss.id === 'function_dragon' && "RECURSIVE FUNCTIONS"}
                                        {boss.id === 'memory_leech' && "LIST COMPREHENSION"}
                                    </span>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Combat Log */}
                    <div className="glass-panel h-48 flex flex-col relative overflow-hidden">
                        <div className="bg-black/40 p-2 border-b border-white/5 flex items-center gap-2 text-cyan-400 text-xs font-mono">
                            <Terminal size={14} /> SYSTEM_LOG
                        </div>
                        <div className="flex-1 overflow-y-auto p-3 space-y-1 font-mono text-xs text-gray-400 scrollbar-thin">
                            {combatLog.map((log, i) => (
                                <div key={i} className={`border-l-2 pl-2 ${log.includes("Error") ? 'border-red-500 text-red-400' : 'border-cyan-500/30'}`}>
                                    <span className="opacity-50 mr-2">[{new Date().toLocaleTimeString('en-US', { hour12: false, minute: '2-digit', second: '2-digit' })}]</span>
                                    {log}
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Right Col: Code Editor */}
                <div className="glass-panel p-0 flex flex-col overflow-hidden border border-white/10 shadow-2xl">
                    {/* Editor Toolbar */}
                    <div className="bg-[#1a1a1a] p-3 border-b border-white/5 flex justify-between items-center">
                        <div className="flex gap-4 text-xs font-mono text-gray-400 items-center">
                            <div className="flex items-center gap-1.5"><Cpu size={14} /> main.py</div>
                            {/* Boss Selector */}
                            <select
                                value={selectedBossId}
                                onChange={(e) => setSelectedBossId(e.target.value)}
                                className="bg-[#111] border border-white/10 rounded px-2 py-1 text-xs text-gray-300 focus:outline-none focus:border-cyan-500"
                            >
                                <option value="function_dragon">Function Dragon (Normal)</option>
                                <option value="memory_leech">Memory Leech (Hard)</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2" title="Rage: Increases Damage">
                                <Zap size={14} className="text-red-500" />
                                <div className="w-20 h-2 bg-gray-800 rounded-full overflow-hidden">
                                    <motion.div className="h-full bg-red-500" animate={{ width: `${playerData.rage}%` }} />
                                </div>
                            </div>
                            <div className="flex items-center gap-2" title="Focus: Increases Accuracy">
                                <Activity size={14} className="text-blue-500" />
                                <div className="w-20 h-2 bg-gray-800 rounded-full overflow-hidden">
                                    <motion.div className="h-full bg-blue-500" animate={{ width: `${playerData.focus}%` }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Editor Body */}
                    <div className="flex-1 flex bg-[#0d0d0d] font-mono text-sm relative">
                        {/* Line Numbers */}
                        <div className="w-12 bg-[#151515] text-gray-600 text-right pr-3 py-4 select-none border-r border-white/5 leading-relaxed">
                            {[...Array(15)].map((_, i) => (
                                <div key={i}>{i + 1}</div>
                            ))}
                        </div>

                        <textarea
                            className="flex-1 bg-transparent text-gray-200 p-4 resize-none focus:outline-none leading-relaxed"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                                    handleExecute();
                                }
                            }}
                            spellCheck="false"
                        />
                    </div>

                    {/* Action Bar */}
                    <div className="p-4 bg-[#1a1a1a] border-t border-white/5 flex justify-between items-center">
                        <div className="text-xs text-gray-500 font-mono">
                            {isExecuting ? 'Injecting Payload...' : 'CTRL + ENTER to Execute'}
                        </div>
                        <Button
                            variant="primary"
                            onClick={handleExecute}
                            disabled={isExecuting}
                            className="flex items-center gap-2 px-8 shadow-lg shadow-cyan-500/20"
                        >
                            {isExecuting ? 'COMPILING...' : <>INJECT CODE <Play size={16} fill="currentColor" /></>}
                        </Button>
                    </div>
                </div>

            </div>

            {/* Victory Overlay */}
            <AnimatePresence>
                {boss.hp <= 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm rounded-xl"
                    >
                        <div className="text-center space-y-6 p-8 border border-green-500/30 bg-green-900/10 rounded-xl shadow-[0_0_50px_rgba(34,197,94,0.2)]">
                            <h2 className="text-4xl font-black font-orbitron text-green-400">TARGET ELIMINATED</h2>
                            <p className="text-gray-300 font-mono">Runtime execution successful. Memory freed.</p>
                            <Button
                                variant="primary"
                                onClick={() => {
                                    setBoss({ ...BOSSES[selectedBossId] }); // Reset Logic
                                    setIsHit(false);
                                    addLog(">> SYSTEM: New entity spawned.");
                                }}
                                className="w-full py-4 text-lg"
                            >
                                SUMMON NEXT TARGET
                            </Button>
                            <div className="text-xs text-gray-500 uppercase tracking-widest">
                                Rewards Added to Inventory
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx>{`
                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                    100% { transform: translateY(0px); }
                }
            `}</style>
        </PageLayout >
    );
};

export default BattleArena;

