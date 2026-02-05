import React, { useState, useEffect } from 'react';
import PageLayout from '../components/layout/PageLayout';
import Button from '../components/ui/Button';
import { usePlayer } from '../context/PlayerContext';
import { LEVELS } from '../data/gameData';
import { verifyStageSolution, startDungeonRun, progressStage } from '../engine/dungeonEngine';
import { Play, Skull, Trophy, ArrowRight, Code, Terminal, CheckCircle, Lock, Shield, Gift } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Sub-components ---

const StageTracker = ({ stages, currentStage }) => {
    return (
        <div className="flex items-center justify-between w-full max-w-2xl mx-auto mb-6 relative">
            {/* Connecting Line */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-800 -z-10 rounded-full" />
            <div
                className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-purple-600 to-cyan-500 -z-10 rounded-full transition-all duration-500"
                style={{ width: `${(currentStage / (stages.length - 1)) * 100}%` }}
            />

            {stages.map((stage, idx) => {
                const isCompleted = idx < currentStage;
                const isCurrent = idx === currentStage;
                const isLocked = idx > currentStage;

                return (
                    <div key={idx} className="relative group">
                        <motion.div
                            className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300 z-10 bg-[#0a0a0a]
                                ${isCompleted ? 'border-green-500 text-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]' : ''}
                                ${isCurrent ? 'border-cyan-400 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.6)] scale-110' : ''}
                                ${isLocked ? 'border-gray-700 text-gray-700' : ''}
                            `}
                            initial={{ scale: 0.8 }}
                            animate={{ scale: isCurrent ? 1.2 : 1 }}
                        >
                            {isCompleted ? <CheckCircle size={16} /> : isLocked ? <Lock size={14} /> : <span className="font-orbitron font-bold text-sm">{idx + 1}</span>}
                        </motion.div>

                        {/* Tooltip */}
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-gray-400 bg-black/80 px-2 py-1 rounded border border-theme-text/10">
                            {stage.title}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const TypewriterText = ({ text }) => {
    const [displayedText, setDisplayedText] = useState("");

    useEffect(() => {
        setDisplayedText("");
        let i = 0;
        const speed = 30;
        const interval = setInterval(() => {
            if (i < text.length) {
                setDisplayedText((prev) => prev + text.charAt(i));
                i++;
            } else {
                clearInterval(interval);
            }
        }, speed);
        return () => clearInterval(interval);
    }, [text]);

    return <span className="font-mono text-cyan-300">{displayedText}<span className="animate-pulse">_</span></span>;
};

const LootCard = ({ item, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: delay * 0.2, type: 'spring' }}
        className="flex flex-col items-center bg-black/60 p-4 rounded-xl border border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.2)] w-32"
    >
        <div className="w-16 h-16 bg-purple-900/20 rounded-full flex items-center justify-center mb-3 animate-bounce-slow">
            <Gift size={24} className="text-purple-300" />
        </div>
        <span className="text-xs font-orbitron text-purple-300 mb-1">ITEM FOUND</span>
        <span className="text-sm font-bold theme-text text-center leading-tight">{item.name}</span>
        <span className="text-[10px] text-gray-500 mt-2">{item.rarity}</span>
    </motion.div>
);

// --- Main Component ---

const Dungeon = () => {
    const { playerData, actions } = usePlayer();
    const [runState, setRunState] = useState(startDungeonRun());
    const [code, setCode] = useState("");
    const [output, setOutput] = useState("Initializing execution environment...");
    const [isExecuting, setIsExecuting] = useState(false);

    const currentLevel = LEVELS[runState.currentStageIndex];

    // Initialize code pattern when level changes
    useEffect(() => {
        if (currentLevel) {
            setCode(currentLevel.starterCode || "");
            setOutput("Ready for input...");
        }
    }, [runState.currentStageIndex, currentLevel]);

    const handleExecute = async () => {
        setIsExecuting(true);
        setOutput(">> Compiling solution...\n>> Running test cases...");

        const result = await verifyStageSolution(code, currentLevel.stage);

        setTimeout(() => {
            setOutput(prev => prev + "\n" + (result.output || result.error));

            if (result.success) {
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
                actions.takeDamage(10);
                if (playerData.hp <= 10) {
                    setRunState(prev => ({ ...prev, isFailed: true }));
                }
            }
            setIsExecuting(false);
        }, 800); // Fake delay for dramatic effect
    };

    if (runState.isFailed || playerData.hp <= 0) {
        return (
            <PageLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-in zoom-in duration-500">
                    <Skull size={80} className="text-red-500 animate-pulse" />
                    <h1 className="text-5xl font-orbitron text-red-500 font-bold">CRITICAL FAILURE</h1>
                    <p className="text-gray-400 text-xl max-w-md">Runtime execution failed. Stack overflow detected.</p>
                    <Button variant="danger" onClick={() => window.location.href = '/war-room'}>
                        ABORT PROCESS
                    </Button>
                </div>
            </PageLayout>
        );
    }

    if (runState.isComplete) {
        return (
            <PageLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-in zoom-in duration-700">
                    <div className="text-center space-y-4">
                        <motion.div
                            initial={{ scale: 0 }} animate={{ scale: 1 }}
                            className="inline-block p-6 rounded-full bg-yellow-400/10 border border-yellow-400/30"
                        >
                            <Trophy size={64} className="text-yellow-400" />
                        </motion.div>
                        <h1 className="text-5xl font-orbitron theme-text font-bold drop-shadow-lg">SYSTEM CORE SECURED</h1>
                        <p className="text-gray-400 text-lg">All encryption layers bypassed successfully.</p>
                    </div>

                    <div className="bg-glass-panel p-8 rounded-2xl border border-theme-text/10 w-full max-w-2xl bg-black/40 backdrop-blur-md">
                        <div className="flex justify-between items-center mb-8 pb-4 border-b border-theme-text/10">
                            <div>
                                <h3 className="text-sm text-gray-400 mb-1">TOTAL XP ACQUIRED</h3>
                                <div className="text-3xl font-mono text-cyan-400 font-bold">+{LEVELS.reduce((a, b) => a + b.xpReward, 0)} XP</div>
                            </div>
                            <div>
                                <h3 className="text-sm text-gray-400 mb-1">STAGES</h3>
                                <div className="text-3xl font-mono theme-text font-bold">{LEVELS.length}/{LEVELS.length}</div>
                            </div>
                        </div>

                        {runState.rewards.loot.length > 0 && (
                            <div>
                                <h4 className="text-sm font-orbitron text-purple-400 mb-4 flex items-center gap-2">
                                    <Gift size={16} /> REWARD CACHE OPENED
                                </h4>
                                <div className="flex gap-6 justify-center flex-wrap">
                                    {runState.rewards.loot.map((item, i) => (
                                        <LootCard key={i} item={item} delay={i} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <Button variant="primary" onClick={() => {
                        runState.rewards.loot.forEach(item => actions.addItem(item));
                        window.location.href = '/war-room';
                    }} className="px-12 py-4 text-lg">
                        RETURN TO BASE
                    </Button>
                </div>
            </PageLayout>
        );
    }

    return (
        <PageLayout>
            <div className="max-w-6xl mx-auto h-[calc(100vh-140px)] flex flex-col gap-6">

                {/* Header / Progress */}
                <div className="glass-panel p-6 pb-2">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-2xl font-orbitron theme-text mb-1">{currentLevel.title}</h2>
                            <div className="text-sm text-gray-400 flex items-center gap-2">
                                <Code size={14} className="text-cyan-400" />
                                <span className="font-mono text-xs uppercase tracking-widest">Protocol {currentLevel.stage}</span>
                            </div>
                        </div>
                        <div className="bg-purple-900/20 border border-purple-500/30 px-3 py-1 rounded text-xs text-purple-300 font-mono">
                            REWARD: {currentLevel.xpReward} XP
                        </div>
                    </div>

                    <StageTracker stages={LEVELS} currentStage={runState.currentStageIndex} />
                </div>

                {/* Main Content Split */}
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">

                    {/* Left: Briefing & Console */}
                    <div className="flex flex-col gap-6">
                        {/* Briefing Card */}
                        <div className="glass-panel p-6 bg-blue-900/10 border-l-4 border-l-cyan-500 relative overflow-hidden">
                            <div className="absolute top-2 right-2 opacity-10">
                                <Shield size={100} />
                            </div>
                            <h3 className="text-cyan-400 font-orbitron text-sm mb-2 flex items-center gap-2">
                                <Terminal size={14} /> MISSION OBJECTIVE
                            </h3>
                            <div className="text-lg leading-relaxed text-gray-200">
                                <TypewriterText text={currentLevel.challenge} />
                            </div>
                            <p className="mt-4 text-sm text-gray-500 italic">"{currentLevel.description}"</p>
                        </div>

                        {/* Console Output */}
                        <div className="glass-panel p-0 flex-1 flex flex-col overflow-hidden border-2 border-gray-800 bg-[#0a0a0a]">
                            <div className="bg-gray-900/80 p-2 border-b border-white/5 flex items-center justify-between px-4">
                                <span className="text-xs font-mono text-gray-400 flex items-center gap-2"><Terminal size={14} /> TERMINAL_OUTPUT</span>
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 rounded-full bg-red-500/50" />
                                    <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                                    <div className="w-2 h-2 rounded-full bg-green-500/50" />
                                </div>
                            </div>
                            <div className="flex-1 p-4 font-mono text-sm text-gray-300 overflow-y-auto whitespace-pre-wrap font-fira-code selection:bg-white/20">
                                {output}
                            </div>
                        </div>
                    </div>

                    {/* Right: Editor */}
                    <div className="glass-panel p-0 flex flex-col overflow-hidden ring-1 ring-purple-500/30 shadow-2xl h-full">
                        <div className="bg-[#151515] p-3 border-b border-white/5 flex justify-between items-center px-4 shrink-0">
                            <span className="text-xs font-mono text-gray-400 flex items-center gap-2"><Code size={14} /> solution.py</span>
                            <span className="text-[10px] text-gray-600 font-mono">UTF-8</span>
                        </div>

                        <div className="flex-1 flex bg-[#0d0d0d] relative min-h-0">
                            {/* Line Gutter */}
                            <div className="w-10 bg-[#111] text-gray-700 text-right pr-2 py-4 select-none border-r border-white/5 font-mono text-sm leading-relaxed overflow-hidden">
                                {[...Array(15)].map((_, i) => <div key={i}>{i + 1}</div>)}
                            </div>

                            <textarea
                                className="flex-1 bg-transparent text-gray-200 font-mono p-4 resize-none focus:outline-none leading-relaxed h-full overflow-auto"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                                        handleExecute();
                                    }
                                }}
                                spellCheck="false"
                                placeholder="# Write your python code here..."
                            />
                        </div>

                        <div className="p-4 bg-[#151515] border-t border-white/5 flex justify-between items-center shrink-0">
                            <div className="text-xs text-gray-500 font-mono">
                                {isExecuting ? 'Status: COMPILING...' : 'CTRL + ENTER to Execute'}
                            </div>
                            <Button
                                variant="accent"
                                onClick={handleExecute}
                                disabled={isExecuting}
                                className="flex items-center gap-2 px-6 shadow-lg shadow-purple-500/20"
                            >
                                {isExecuting ? 'PROCESSING...' : <>EXECUTE <Play size={16} /></>}
                            </Button>
                        </div>
                    </div>
                </div>

            </div>
        </PageLayout>
    );
};

export default Dungeon;
