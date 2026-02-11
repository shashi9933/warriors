import React from 'react';
import PageLayout from '../components/layout/PageLayout';
import { usePlayer } from '../context/PlayerContext';
import { RANKS, getRank } from '../data/achievements';
import { motion } from 'framer-motion';
import { Medal, Star, Trophy, Target, Award, Crown } from 'lucide-react';
import { clsx } from 'clsx';

const Leaderboard = () => {
    const { playerData } = usePlayer();
    const currentRank = getRank(playerData.level);

    // Mock Leaderboard Data
    const globalRankings = [
        { rank: 1, name: "Neo", level: 99, score: 99999 },
        { rank: 2, name: "Trinity", level: 85, score: 85000 },
        { rank: 3, name: "Morpheus", level: 78, score: 78000 },
        { rank: 42, name: playerData.name || "Player", level: playerData.level, score: playerData.xp, isPlayer: true },
        { rank: 43, name: "Cypher", level: 12, score: 1200 },
    ].sort((a, b) => b.score - a.score); // Simple sort

    return (
        <PageLayout>
            <div className="flex-1 w-full p-4 md:p-8 flex flex-col gap-8 animate-in fade-in duration-500">
                {/* Header */}
                <div className="text-center space-y-2 mb-4">
                    <div className="flex justify-center mb-2">
                        <div className="p-3 bg-yellow-500/10 rounded-full border border-yellow-500/50 shadow-[0_0_20px_rgba(234,179,8,0.3)]">
                            <Trophy size={32} className="text-yellow-400" />
                        </div>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-orbitron font-bold text-white tracking-wider">
                        GLOBAL LEADERBOARD
                    </h1>
                    <p className="text-sm text-gray-400 font-mono">
                        Elite operatives ranked by contribution and combat efficiency.
                    </p>
                </div>

                {/* Player Status Card */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="glass-panel p-6 border-l-4 border-l-yellow-500 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-amber-700 rounded-lg flex items-center justify-center font-bold text-2xl text-black border-2 border-white/20 shadow-lg">
                            #{globalRankings.find(p => p.isPlayer)?.rank || "--"}
                        </div>
                        <div>
                            <div className="text-xs text-yellow-500 font-bold tracking-widest mb-1">YOUR RANKING</div>
                            <div className="text-2xl font-orbitron text-white">{playerData.name || "OPERATIVE"}</div>
                            <div className="text-sm text-gray-400 font-mono">Level {playerData.level} // {currentRank.title}</div>
                        </div>
                    </div>

                    <div className="flex gap-8 text-center">
                        <div>
                            <div className="text-[10px] text-gray-500 font-bold mb-1">TOTAL SCORE</div>
                            <div className="text-xl font-mono text-cyan-400">{playerData.xp.toLocaleString()}</div>
                        </div>
                        <div>
                            <div className="text-[10px] text-gray-500 font-bold mb-1">WIN RATE</div>
                            <div className="text-xl font-mono text-green-400">--%</div>
                        </div>
                    </div>
                </motion.div>

                {/* Leaderboard Table */}
                <div className="glass-panel overflow-hidden">
                    <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/10 text-[10px] font-bold text-gray-500 tracking-widest uppercase">
                        <div className="col-span-2 text-center">Rank</div>
                        <div className="col-span-6">Operative</div>
                        <div className="col-span-2 text-center">Level</div>
                        <div className="col-span-2 text-right">Score</div>
                    </div>

                    <div className="divide-y divide-white/5">
                        {globalRankings.map((player, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className={clsx(
                                    "grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/5 transition-colors",
                                    player.isPlayer && "bg-yellow-500/10 hover:bg-yellow-500/20"
                                )}
                            >
                                <div className="col-span-2 flex justify-center">
                                    {player.rank <= 3 ? (
                                        <div className={clsx(
                                            "w-8 h-8 rounded-full flex items-center justify-center font-bold text-black shadow-lg",
                                            player.rank === 1 ? "bg-yellow-400" :
                                                player.rank === 2 ? "bg-gray-300" :
                                                    "bg-amber-600"
                                        )}>
                                            {player.rank}
                                        </div>
                                    ) : (
                                        <span className="font-mono text-gray-500 text-lg">#{player.rank}</span>
                                    )}
                                </div>
                                <div className="col-span-6 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded bg-gray-800 flex items-center justify-center">
                                        <UserIcon size={16} className="text-gray-400" />
                                    </div>
                                    <span className={clsx("font-orbitron text-sm", player.isPlayer ? "text-yellow-400 font-bold" : "text-gray-300")}>
                                        {player.name}
                                    </span>
                                    {player.rank === 1 && <Crown size={14} className="text-yellow-400" />}
                                </div>
                                <div className="col-span-2 text-center font-mono text-gray-400">
                                    {player.level}
                                </div>
                                <div className="col-span-2 text-right font-mono text-cyan-400 font-bold">
                                    {player.score.toLocaleString()}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};

const UserIcon = ({ size, className }) => (
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
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

export default Leaderboard;
