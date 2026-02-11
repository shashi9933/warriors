import React, { useState, useEffect } from 'react';
import PageLayout from '../components/layout/PageLayout';
import { Target, CheckSquare, Calendar, Shield, Clock, AlertTriangle, Gift, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayer } from '../context/PlayerContext';
import { useSound } from '../context/SoundContext';
import { clsx } from 'clsx';

const MissionCard = ({ mission, onClaim }) => {
    const isComplete = mission.progress >= mission.maxProgress;
    const { playSFX } = useSound();

    const handleClaim = () => {
        if (isComplete && !mission.claimed) {
            playSFX('SUCCESS');
            onClaim(mission.id);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={clsx(
                "relative group p-4 border rounded-lg transition-all duration-300",
                isComplete && !mission.claimed
                    ? "bg-green-500/10 border-green-500/50 hover:bg-green-500/20"
                    : mission.claimed
                        ? "bg-white/5 border-white/5 opacity-50"
                        : "bg-black/40 border-white/10 hover:border-white/30"
            )}
        >
            <div className="flex justify-between items-start mb-2">
                <div className="flex gap-3">
                    <div className={clsx(
                        "p-2 rounded-lg flex items-center justify-center",
                        isComplete ? "bg-green-500/20 text-green-400" : "bg-white/5 text-gray-400"
                    )}>
                        <Target size={20} />
                    </div>
                    <div>
                        <h3 className={clsx("font-orbitron font-bold text-sm", isComplete ? "text-white" : "text-gray-300")}>
                            {mission.title}
                        </h3>
                        <p className="text-xs text-gray-500 font-mono mt-0.5">{mission.description}</p>
                    </div>
                </div>

                {/* Reward Badge */}
                <div className="flex items-center gap-1.5 px-2 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded text-[10px] text-yellow-400 font-mono">
                    <Gift size={10} />
                    <span>{mission.reward.value} {mission.reward.type}</span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-3">
                <div className="flex justify-between text-[10px] font-mono mb-1 text-gray-500">
                    <span>PROGRESS</span>
                    <span className={isComplete ? "text-green-400" : ""}>{mission.progress} / {mission.maxProgress}</span>
                </div>
                <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(mission.progress / mission.maxProgress) * 100}%` }}
                        className={clsx(
                            "h-full transition-all duration-500",
                            isComplete ? "bg-green-500" : "bg-cyan-500"
                        )}
                    />
                </div>
            </div>

            {/* Claim Button */}
            <div className="mt-3 flex justify-end">
                {mission.claimed ? (
                    <span className="text-xs font-mono text-gray-600 flex items-center gap-1">
                        <CheckSquare size={12} /> DOCTRINE FULFILLED
                    </span>
                ) : (
                    <button
                        onClick={handleClaim}
                        disabled={!isComplete}
                        className={clsx(
                            "text-xs px-4 py-1.5 rounded font-orbitron transition-all flex items-center gap-2",
                            isComplete
                                ? "bg-green-500 hover:bg-green-400 text-black font-bold shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                                : "bg-white/5 text-gray-500 cursor-not-allowed"
                        )}
                    >
                        {isComplete ? "CLAIM REWARD" : "IN PROGRESS"}
                        {isComplete && <ChevronRight size={12} />}
                    </button>
                )}
            </div>
        </motion.div>
    );
};

const Directives = () => {
    const { playerData } = usePlayer();
    const [activeTab, setActiveTab] = useState('daily');
    const [timeLeft, setTimeLeft] = useState('');

    // Mock Mission Data
    const [missions, setMissions] = useState([
        { id: 1, type: 'daily', title: "System Calibration", description: "Log in and visit the Nexus.", progress: 1, maxProgress: 1, reward: { type: 'XP', value: 50 }, claimed: false },
        { id: 2, type: 'daily', title: "Combat Drill", description: "Complete 1 Battle Arena simulation.", progress: 0, maxProgress: 1, reward: { type: 'GOLD', value: 100 }, claimed: false },
        { id: 3, type: 'daily', title: "Knowledge Intake", description: "Read 2 documentation entries in Archives.", progress: 1, maxProgress: 2, reward: { type: 'XP', value: 75 }, claimed: false },
        { id: 4, type: 'weekly', title: "Algorithm Master", description: "Solve 5 Python challenges.", progress: 2, maxProgress: 5, reward: { type: 'XP', value: 500 }, claimed: false },
        { id: 5, type: 'weekly', title: "Boss Slayer", description: "Defeat a Level 5+ Boss.", progress: 0, maxProgress: 1, reward: { type: 'RARE ITEM', value: 1 }, claimed: false },
    ]);

    // Countdown Timer Logic
    useEffect(() => {
        const updateTimer = () => {
            const now = new Date();
            const end = new Date();
            end.setHours(24, 0, 0, 0); // Next midnight
            const diff = end - now;

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            setTimeLeft(`${hours}h ${minutes}m`);
        };

        updateTimer();
        const interval = setInterval(updateTimer, 60000);
        return () => clearInterval(interval);
    }, []);

    const handleClaim = (id) => {
        setMissions(prev => prev.map(m => m.id === id ? { ...m, claimed: true } : m));
        // Here you would also call usePlayer().addReward(...)
    };

    const filteredMissions = missions.filter(m => m.type === activeTab);

    return (
        <PageLayout>
            <div className="flex-1 w-full p-4 md:p-8 flex flex-col gap-6 animate-in fade-in duration-500">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-white/10 pb-6">
                    <div>
                        <div className="text-xs font-mono text-yellow-500 mb-1 flex items-center gap-2">
                            <AlertTriangle size={12} /> PRIORITY: ALPHA
                        </div>
                        <h1 className="text-3xl md:text-4xl font-orbitron font-bold text-white mb-2 flex items-center gap-3">
                            DIRECTIVES
                        </h1>
                        <p className="text-gray-400 font-mono text-sm max-w-xl">
                            Complete daily mandates to maintain operational status and earn requisition credits.
                        </p>
                    </div>

                    <div className="bg-white/5 px-4 py-2 rounded border border-white/10 flex items-center gap-3">
                        <Clock size={16} className="text-cyan-400" />
                        <div>
                            <div className="text-[10px] text-gray-500 font-bold">CYCLE RESET IN</div>
                            <div className="font-mono text-white text-lg font-bold">{timeLeft}</div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 bg-black/40 p-1 rounded-lg border border-white/10 w-fit">
                    <button
                        onClick={() => setActiveTab('daily')}
                        className={clsx(
                            "px-4 py-2 rounded text-xs font-orbitron font-bold transition-all flex items-center gap-2",
                            activeTab === 'daily' ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/20" : "text-gray-400 hover:text-white"
                        )}
                    >
                        <Target size={14} /> DAILY ORDERS
                    </button>
                    <button
                        onClick={() => setActiveTab('weekly')}
                        className={clsx(
                            "px-4 py-2 rounded text-xs font-orbitron font-bold transition-all flex items-center gap-2",
                            activeTab === 'weekly' ? "bg-purple-500 text-white shadow-lg shadow-purple-500/20" : "text-gray-400 hover:text-white"
                        )}
                    >
                        <Calendar size={14} /> WEEKLY OPERATIONS
                    </button>
                </div>

                {/* Mission Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AnimatePresence mode="popLayout">
                        {filteredMissions.map(mission => (
                            <MissionCard key={mission.id} mission={mission} onClaim={handleClaim} />
                        ))}
                    </AnimatePresence>
                </div>

                {filteredMissions.length === 0 && (
                    <div className="text-center py-20 border border-dashed border-white/10 rounded-lg">
                        <div className="text-gray-600 font-mono mb-2">NO ACTIVE DIRECTIVES</div>
                        <p className="text-xs text-gray-500">Wait for the next cycle reset.</p>
                    </div>
                )}
            </div>
        </PageLayout>
    );
};

export default Directives;
