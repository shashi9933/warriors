import React from 'react';
import PageLayout from '../components/layout/PageLayout';
import { usePlayer } from '../context/PlayerContext';
import { RANKS, getRank } from '../data/achievements';
import { motion } from 'framer-motion';
import { Medal, Star, Trophy, Target } from 'lucide-react';
import { clsx } from 'clsx';

const Rankings = () => {
    const { playerData } = usePlayer();
    const currentRank = getRank(playerData.level);

    return (
        <PageLayout>
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-3xl md:text-4xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600 drop-shadow-md">
                        RANK HIERARCHY
                    </h1>
                    <p className="text-sm text-gray-400 max-w-lg mx-auto">
                        Climb the corporate ladder of the Cyberverse. Earn XP to promote your clearance level.
                    </p>
                </div>

                {/* Current Status */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="glass-panel p-6 text-center border-l-4 border-l-neon-cyan relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Trophy size={80} />
                    </div>

                    <h2 className="text-sm text-gray-500 font-orbitron mb-1 tracking-widest">CURRENT CLEARANCE</h2>
                    <div className={clsx("text-2xl md:text-3xl font-bold font-orbitron mb-2", currentRank.color)}>
                        {currentRank.title}
                    </div>
                    <div className="text-lg font-mono text-white">
                        LEVEL <span className="text-neon-cyan">{playerData.level}</span>
                    </div>
                </motion.div>

                {/* Rank List */}
                <div className="space-y-3">
                    {RANKS.map((rank, index) => {
                        const isUnlocked = playerData.level >= rank.minLevel;
                        const isNext = !isUnlocked && playerData.level < rank.minLevel && (index === 0 || playerData.level >= RANKS[index - 1].minLevel);

                        return (
                            <motion.div
                                key={rank.title}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className={clsx(
                                    "flex items-center gap-4 p-4 rounded-lg border transition-all duration-300 relative overflow-hidden",
                                    isUnlocked
                                        ? "bg-white/5 border-theme-text/20"
                                        : "bg-black/40 border-white/5 opacity-60",
                                    isNext && "border-yellow-500/50 shadow-[0_0_15px_rgba(255,200,0,0.1)] opacity-100"
                                )}
                            >
                                {/* Level Badge */}
                                <div className={clsx(
                                    "w-12 h-12 rounded-full flex items-center justify-center font-bold font-orbitron text-lg border-2 shrink-0 z-10 bg-deep-space",
                                    isUnlocked ? rank.color.replace('text-', 'border-') : "border-gray-700 text-gray-700",
                                    isNext && "border-yellow-500 text-yellow-500 animate-pulse"
                                )}>
                                    {rank.minLevel}
                                </div>

                                {/* Info */}
                                <div className="flex-1 z-10">
                                    <h3 className={clsx(
                                        "text-lg font-orbitron font-bold",
                                        isUnlocked ? rank.color : "text-gray-600",
                                        isNext && "text-yellow-100"
                                    )}>
                                        {rank.title}
                                    </h3>
                                    {isNext && (
                                        <div className="text-xs text-yellow-500 mt-0.5 flex items-center gap-1">
                                            <Target size={12} /> NEXT PROMOTION OBJECTIVE
                                        </div>
                                    )}
                                </div>

                                {/* Status Icon */}
                                <div className="z-10">
                                    {isUnlocked ? (
                                        <Medal className={rank.color} size={24} />
                                    ) : (
                                        <Star className="text-gray-800" size={24} />
                                    )}
                                </div>

                                {/* Progress Bar Background for unlocked ranks */}
                                {isUnlocked && (
                                    <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent w-full opacity-20" />
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </PageLayout>
    );
};

export default Rankings;
