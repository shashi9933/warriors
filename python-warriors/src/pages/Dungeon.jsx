import React, { useState, useEffect } from 'react';
import PageLayout from '../components/layout/PageLayout';
import Button from '../components/ui/Button';
import { usePlayer } from '../context/PlayerContext';
import { LEVELS } from '../data/gameData';
import { verifyStageSolution, startDungeonRun, progressStage } from '../engine/dungeonEngine';
import { Play, Lock, AlertTriangle, Server, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSound } from '../context/SoundContext';

// --- Visual Components ---

const SecurityNode = ({ active, completed, index }) => (
    <div className={`flex flex-col items-center gap-2 relative ${active ? 'scale-110' : 'scale-100 opacity-50'} transition-all duration-300 shrink-0`}>
        <div className={`w-3 h-3 rounded-full ${completed ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : active ? 'bg-amber-500 animate-pulse shadow-[0_0_15px_#f59e0b]' : 'bg-gray-700'}`} />
        <div className="absolute top-4 text-[10px] font-mono text-gray-500 whitespace-nowrap">LAYER {index + 1}</div>
    </div>
);

const TargetVisual = ({ stage, isExecuting, isDamaged }) => {
    return (
        <div className="relative w-full h-48 md:h-64 flex items-center justify-center">
            {/* Holographic Projection Base */}
            <div className="absolute bottom-0 w-32 h-8 bg-cyan-500/20 rounded-[100%] blur-xl animate-pulse" />

            {/* The Target Entity */}
            <motion.div
                animate={isExecuting ? { scale: [1, 0.95, 1.05, 1], rotate: [0, -2, 2, 0], filter: ["hue-rotate(0deg)", "hue-rotate(90deg)", "hue-rotate(0deg)"] } : {}}
                transition={{ duration: 0.5, repeat: isExecuting ? Infinity : 0 }}
                className="relative z-10"
            >
                <div className={`relative p-6 md:p-8 rounded-full border-4 ${isDamaged ? 'border-red-500 shadow-[0_0_50px_#ef4444]' : 'border-cyan-500/50 shadow-[0_0_30px_#06b6d4]'} bg-black/80 backdrop-blur-md transition-all duration-300`}>
                    <Lock size={48} className={`md:w-16 md:h-16 ${isDamaged ? 'text-red-500' : 'text-cyan-400'}`} />

                    {/* Rotating Rings */}
                    <div className="absolute inset-[-15px] md:inset-[-20px] border border-dashed border-cyan-500/30 rounded-full animate-spin-slow" />
                    <div className="absolute inset-[-30px] md:inset-[-40px] border border-dotted border-cyan-500/20 rounded-full animate-reverse-spin" />
                </div>
            </motion.div>

            {/* Scanning Lines */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent h-[10%] w-full animate-scan pointer-events-none" />
        </div>
    );
};

// --- Main Component ---

const Dungeon = () => {
    const { playerData, actions } = usePlayer();
    const { playSFX } = useSound();
    const [runState, setRunState] = useState(startDungeonRun());
    const [code, setCode] = useState("");
    const [output, setOutput] = useState("Initializing breach protocol...");
    const [isExecuting, setIsExecuting] = useState(false);
    const [shake, setShake] = useState(false); // To visually damage the target

    const currentLevel = LEVELS[runState.currentStageIndex];

    // Initialize code
    useEffect(() => {
        if (currentLevel) {
            setCode(currentLevel.starterCode || "");
            setOutput("Target locked. Awaiting payload injection...");
        }
    }, [runState.currentStageIndex, currentLevel]);

    const handleExecute = async () => {
        setIsExecuting(true);
        playSFX('LOADING');
        setOutput(">> Injecting payload...\n>> Bypassing firewalls...");

        const result = await verifyStageSolution(code, currentLevel.stage);

        setTimeout(() => {
            setOutput(prev => prev + "\n" + (result.output || result.error));

            if (result.success) {
                playSFX('SUCCESS');
                setShake(true); // Visual hit
                setTimeout(() => setShake(false), 500);

                const xpReward = currentLevel.xpReward;
                actions.gainXP(xpReward);

                setTimeout(() => {
                    if (runState.currentStageIndex + 1 >= LEVELS.length) {
                        setRunState(prev => ({ ...prev, isComplete: true }));
                    } else {
                        setRunState(prev => progressStage(prev));
                    }
                }, 1500);
            } else {
                playSFX('ERROR');
                actions.takeDamage(10);
                if (playerData.hp <= 10) {
                    setRunState(prev => ({ ...prev, isFailed: true }));
                }
            }
            setIsExecuting(false);
        }, 1200);
    };

    if (runState.isComplete || runState.isFailed) {
        return (
            <PageLayout>
                <div className="flex flex-col items-center justify-center min-h-[70vh]">
                    <h1 className={`text-4xl md:text-6xl font-black font-orbitron mb-4 ${runState.isComplete ? 'text-green-500' : 'text-red-500'}`}>
                        {runState.isComplete ? 'SYSTEM BREACHED' : 'CONNECTION LOST'}
                    </h1>
                    <Button variant="primary" onClick={() => window.location.href = '/war-room'}>DISCONNECT</Button>
                </div>
            </PageLayout>
        );
    }

    return (
        <PageLayout>
            <div className="max-w-7xl mx-auto h-[calc(100vh-64px)] md:h-[calc(100vh-120px)] flex flex-col gap-2 md:gap-4 p-2">

                {/* Top Bar: Progress & Status */}
                <div className="glass-panel p-2 md:p-4 flex flex-col md:flex-row items-center justify-between bg-black/60 border-b border-white/10 gap-2 md:gap-0 shrink-0">
                    <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto justify-between md:justify-start">
                        <div className="flex items-center gap-2 md:gap-4">
                            <div className="bg-red-500/20 p-1.5 md:p-2 rounded border border-red-500/50 animate-pulse">
                                <AlertTriangle size={16} className="text-red-500 md:w-5 md:h-5" />
                            </div>
                            <div>
                                <div className="text-[10px] text-red-500 font-mono tracking-widest hidden md:block">SECURITY ALERT</div>
                                <div className="text-sm md:text-lg font-bold font-orbitron text-white">LEVEL {runState.currentStageIndex + 1} // {currentLevel.title.toUpperCase()}</div>
                            </div>
                        </div>
                        <div className="text-right md:hidden">
                            <div className="text-lg font-mono text-cyan-500 font-bold">100%</div>
                        </div>
                    </div>

                    {/* Layer Progress */}
                    <div className="flex items-center gap-4 md:gap-8 overflow-x-auto w-full md:w-auto p-1 no-scrollbar justify-center md:justify-start">
                        {LEVELS.map((_, i) => (
                            <SecurityNode key={i} index={i} completed={i < runState.currentStageIndex} active={i === runState.currentStageIndex} />
                        ))}
                    </div>

                    <div className="text-right hidden md:block">
                        <div className="text-xs text-gray-400 font-mono">ENCRYPTION INTEGRITY</div>
                        <div className="text-xl font-mono text-cyan-500 font-bold">100%</div>
                    </div>
                </div>

                {/* Main Breach Interface */}
                <div className="flex-1 flex flex-col md:grid md:grid-cols-12 gap-4 md:gap-6 min-h-0 overflow-y-auto md:overflow-hidden">

                    {/* Left Col: Target Visualization (4 cols) */}
                    <div className="col-span-12 md:col-span-4 flex flex-col gap-4 shrink-0">
                        {/* The Target */}
                        <div className="flex-1 glass-panel relative flex flex-col items-center justify-center p-4 md:p-6 bg-gradient-to-b from-slate-900 to-black border border-cyan-500/20 overflow-hidden min-h-[300px] md:min-h-0">
                            <div className="absolute top-4 left-4 text-[10px] md:text-xs font-mono text-cyan-500 flex items-center gap-2">
                                <Server size={14} /> HOST: 192.168.X.X
                            </div>

                            <TargetVisual stage={runState.currentStageIndex} isExecuting={isExecuting} isDamaged={shake} />

                            <div className="mt-8 text-center space-y-2 relative z-10">
                                <div className="text-xs text-gray-400 font-mono uppercase">Decryption Challenge</div>
                                <div className="text-white font-mono text-xs md:text-sm bg-black/50 p-3 rounded border border-white/10">
                                    "{currentLevel.challenge}"
                                </div>
                            </div>
                        </div>

                        {/* Terminal Log */}
                        <div className="hidden md:flex h-48 glass-panel bg-black border-t-4 border-t-cyan-500 p-0 flex-col font-mono text-xs shrink-0">
                            <div className="bg-cyan-900/20 p-2 text-cyan-400 flex justify-between">
                                <span>TERMINAL.exe</span>
                                <span className={isExecuting ? "animate-pulse" : ""}>{isExecuting ? "● USR_BIN_PYTH" : "● IDLE"}</span>
                            </div>
                            <div className="flex-1 p-3 text-green-500/80 overflow-y-auto font-fira-code leading-relaxed">
                                {output.split('\n').map((line, i) => (
                                    <div key={i}>{line}</div>
                                ))}
                                {isExecuting && <div className="animate-pulse">_</div>}
                            </div>
                        </div>
                    </div>

                    {/* Right Col: Code Interface (8 cols) */}
                    <div className="col-span-12 md:col-span-8 flex flex-col glass-panel p-0 overflow-hidden border border-white/10 relative h-[400px] md:h-auto shrink-0">
                        {/* Editor Header */}
                        <div className="bg-[#1e1e1e] p-3 flex justify-between items-center border-b border-black/50 shrink-0">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                                <div className="w-3 h-3 rounded-full bg-green-500/50" />
                            </div>
                            <div className="text-gray-500 font-mono text-xs">breach_script.py</div>
                        </div>

                        {/* Editor Area */}
                        <div className="flex-1 bg-[#1a1a1a] relative flex">
                            {/* Line Numbers */}
                            <div className="w-8 md:w-12 bg-[#151515] text-gray-700 text-right pr-2 md:pr-3 pt-4 font-mono text-xs md:text-sm leading-6 border-r border-white/5 select-none shrink-0">
                                {[...Array(20)].map((_, i) => <div key={i}>{i + 1}</div>)}
                            </div>

                            {/* Text Area */}
                            <textarea
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="flex-1 bg-transparent text-gray-200 font-mono text-xs md:text-sm p-3 md:p-4 resize-none focus:outline-none leading-6 font-fira-code cursor-text selection:bg-cyan-500/30"
                                spellCheck="false"
                                placeholder="# Inject Python code here..."
                            />

                            {/* Execute Overlay Button (Floating) */}
                            <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6">
                                <Button
                                    variant="accent"
                                    className={`h-12 w-12 md:h-14 md:w-14 rounded-full shadow-[0_0_20px_purple] flex items-center justify-center transition-all ${isExecuting ? 'scale-90 opacity-50' : 'hover:scale-110'}`}
                                    onClick={handleExecute}
                                    disabled={isExecuting}
                                >
                                    {isExecuting ? <Zap className="animate-spin" /> : <Play fill="currentColor" className="ml-1" />}
                                </Button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <style jsx>{`
                @keyframes scan {
                    0% { top: -10%; opacity: 0; }
                    50% { opacity: 1; }
                    100% { top: 110%; opacity: 0; }
                }
                .animate-scan {
                    animation: scan 3s linear infinite;
                }
                .animate-reverse-spin {
                    animation: spin 10s linear infinite reverse;
                }
            `}</style>
        </PageLayout>
    );
};

export default Dungeon;
