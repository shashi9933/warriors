import React from 'react';
import PageLayout from '../components/layout/PageLayout';
import { Award, Medal, Crown, Lock, Star, Shield, Zap, Code, Bug, Flame, Skull } from 'lucide-react';
import { ACHIEVEMENTS, RANKS, getRank } from '../data/achievements';
import { usePlayer } from '../context/PlayerContext';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

const AchievementCard = ({ achievement, unlocked }) => {
    const Icon = achievement.icon;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={clsx(
                "glass-panel p-4 flex flex-col items-center justify-center text-center gap-3 relative overflow-hidden group transition-all duration-300",
                unlocked
                    ? "border-cyan-500/30 bg-cyan-900/10 hover:border-cyan-400 hover:bg-cyan-900/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                    : "border-white/5 bg-white/5 opacity-60 grayscale"
            )}
        >
            <div className={clsx(
                "w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all duration-500",
                unlocked
                    ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.3)] group-hover:scale-110"
                    : "bg-black/40 border-gray-700 text-gray-600"
            )}>
                {unlocked ? <Icon size={32} /> : <Lock size={24} />}
            </div>

            <div className="z-10">
                <div className={clsx("font-bold text-sm font-orbitron mb-1", unlocked ? "text-white" : "text-gray-500")}>
                    {achievement.title.toUpperCase()}
                </div>
                <div className="text-[10px] text-gray-400 font-mono leading-tight max-w-[120px] mx-auto">
                    {achievement.description}
                </div>
            </div>

            {unlocked && (
                <div className="absolute top-2 right-2 flex items-center gap-1 text-[10px] font-bold text-yellow-400 bg-yellow-400/10 px-1.5 py-0.5 rounded border border-yellow-400/20">
                    <Star size={8} fill="currentColor" />
                    {achievement.xpReward} XP
                </div>
            )}
        </motion.div>
    );
};

const Honors = () => {
    const { playerData } = usePlayer();
    const currentRank = getRank(playerData.level);

    // Mock stats for demonstration if not in playerData yet
    const playerStats = playerData.stats || {
        bossesDefeated: 0,
        lowHpSurvival: 0,
        loopsUsed: 0,
        recursionsUsed: 0,
        criticalHits: 0,
        totalDamage: 0
    };

    return (
        <PageLayout>
            <div className="flex-1 w-full p-4 flex flex-col gap-8 animate-in fade-in duration-500">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-end justify-between gap-6 border-b border-white/10 pb-6">
                    <div>
                        <div className="text-xs font-mono text-amber-500 mb-1 flex items-center gap-2">
                            <Award size={12} /> HALL OF HALLS
                        </div>
                        <h1 className="text-4xl font-orbitron font-bold text-white mb-2">HONORS & RANKINGS</h1>
                        <p className="text-gray-400 font-mono text-sm">Verify your clearance level and combat citations.</p>
                    </div>

                    {/* Current Rank Display */}
                    <div className="glass-panel p-4 flex items-center gap-4 bg-gradient-to-r from-black via-black to-amber-900/20 border-amber-500/30">
                        <div className="w-16 h-16 rounded-lg bg-black border border-amber-500/50 flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-amber-500/10 animate-pulse" />
                            <Crown size={32} className="text-amber-400 relative z-10" />
                        </div>
                        <div>
                            <div className="text-[10px] text-amber-500 font-bold tracking-widest">CURRENT RANK</div>
                            <div className="text-xl font-orbitron text-white font-bold">{currentRank.title}</div>
                            <div className="text-xs text-gray-400 font-mono">Clearance Level {playerData.level}</div>
                        </div>
                    </div>
                </div>

                {/* Ranks Progression */}
                <div>
                    <h2 className="text-lg font-orbitron text-white mb-4 flex items-center gap-2">
                        <Medal size={18} className="text-cyan-400" /> CLEARANCE LEVELS
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                        {RANKS.map((rank, idx) => {
                            const isUnlocked = playerData.level >= rank.minLevel;
                            const isNext = !isUnlocked && playerData.level < rank.minLevel && (idx === 0 || playerData.level >= RANKS[idx - 1].minLevel);

                            return (
                                <div
                                    key={idx}
                                    className={clsx(
                                        "p-3 rounded border flex flex-col gap-2 relative overflow-hidden transition-all",
                                        isUnlocked
                                            ? "bg-white/5 border-white/10 opacity-100"
                                            : isNext
                                                ? "bg-white/5 border-cyan-500/50 opacity-100 ring-1 ring-cyan-500/30"
                                                : "bg-black/40 border-white/5 opacity-40 grayscale"
                                    )}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className={clsx("text-xs font-bold font-mono", isUnlocked ? rank.color : "text-gray-500")}>
                                            LVL {rank.minLevel}
                                        </div>
                                        {isUnlocked ? <CheckHeart size={14} className="text-green-500" /> : <Lock size={12} className="text-gray-600" />}
                                    </div>
                                    <div className={clsx("font-orbitron text-sm font-bold", isUnlocked ? "text-white" : "text-gray-400")}>
                                        {rank.title}
                                    </div>
                                    {isNext && (
                                        <div className="text-[10px] text-cyan-400 mt-1 animate-pulse">
                                            NEXT PROMOTION
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Achievements Grid */}
                <div>
                    <h2 className="text-lg font-orbitron text-white mb-4 flex items-center gap-2">
                        <Award size={18} className="text-amber-400" /> SERVICE MEDALS
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {ACHIEVEMENTS.map((ach) => (
                            <AchievementCard
                                key={ach.id}
                                achievement={ach}
                                unlocked={ach.condition(playerStats)}
                            />
                        ))}
                    </div>
                </div>

            </div>
        </PageLayout>
    );
};

// Icon component needed for Ranks section
const CheckHeart = ({ size, className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M20 6 9 17l-5-5" />
    </svg>
);

export default Honors;
