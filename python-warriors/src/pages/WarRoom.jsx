import React, { useState } from 'react';
import PageLayout from '../components/layout/PageLayout';
import { usePlayer } from '../context/PlayerContext';
import { Shield, Sword, Cpu, Activity, Database, Terminal, Zap, Lock, Scan } from 'lucide-react';
import Button from '../components/ui/Button';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

const RarityColor = {
    "Common": "text-gray-400 border-gray-600 shadow-gray-500/10",
    "Rare": "text-cyan-400 border-cyan-500 shadow-cyan-500/20",
    "Epic": "text-purple-400 border-purple-500 shadow-purple-500/20",
    "Legendary": "text-yellow-400 border-yellow-500 shadow-yellow-500/20",
};

const SkillNode = ({ icon: Icon, label, level, max = 10, color, active, onUpgrade, canUpgrade }) => {
    return (
        <div className="relative group">
            {/* Connection Line Placeholder (Vertical) */}
            <div className={`absolute -top-8 left-1/2 w-0.5 h-8 bg-gray-800 transition-colors duration-500 ${level > 0 ? color.replace('text-', 'bg-').replace('400', '500') : ''}`} />

            <button
                onClick={onUpgrade}
                disabled={!canUpgrade}
                className={clsx(
                    "relative z-10 w-24 h-24 hexagon flex flex-col items-center justify-center p-2 transition-all duration-300 clip-hexagon",
                    level > 0
                        ? `bg-gray-900 border-2 ${color.replace('text-', 'border-')}`
                        : "bg-gray-900/50 border-2 border-dashed border-gray-700 hover:border-gray-500",
                    canUpgrade && "hover:scale-110 cursor-pointer shadow-[0_0_20px_rgba(var(--accent-primary),0.3)]"
                )}
            >
                <Icon size={24} className={level > 0 ? color : "text-gray-600"} />
                <span className="text-[10px] font-orbitron mt-1 text-gray-300">{label}</span>
                <div className="flex gap-0.5 mt-1">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className={`w-1 h-3 rounded-sm ${i < level ? color.replace('text-', 'bg-') : 'bg-gray-800'}`} />
                    ))}
                </div>
            </button>

            {/* Hover Detail */}
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-48 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                <div className="bg-black/90 border border-white/20 p-2 rounded text-center backdrop-blur-md">
                    <p className="text-xs text-gray-300">Level {level} / {max}</p>
                    <p className="text-[10px] text-gray-500">{canUpgrade ? "Click to Upgrade" : "Locked / No Points"}</p>
                </div>
            </div>
        </div>
    );
};

const WarRoom = () => {
    const { playerData, actions } = usePlayer();
    const { level, xp, maxXp, hp, maxHp, skillPoints, damageSkill, critSkill, healSkill } = playerData;
    const [scanning, setScanning] = useState(false);

    // XP Progress
    const xpPercent = (xp / maxXp) * 100;

    return (
        <PageLayout>
            <div className="space-y-6 animate-in fade-in duration-700">
                {/* Top Diagnostics Bar */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* ID Card */}
                    <div className="glass-panel p-4 flex items-center gap-4 relative overflow-hidden">
                        <div className="w-16 h-16 bg-gradient-to-br from-cyan-900 to-blue-900 rounded-full flex items-center justify-center border-2 border-cyan-500/50 relative">
                            <Scan size={32} className="text-cyan-400 animate-pulse-slow" />
                            <div className="absolute inset-0 border-t border-cyan-400 rounded-full animate-spin-slow opacity-50" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-orbitron text-white">{playerData.classType}</h2>
                            <p className="text-sm text-cyan-400">Level {level} Operator</p>
                        </div>
                        <div className="absolute right-4 top-4 text-right">
                            <div className="text-xs text-gray-500">SYS_ID</div>
                            <div className="font-mono text-gray-300">#0xFFFF</div>
                        </div>
                    </div>

                    {/* XP Module */}
                    <div className="glass-panel p-4 flex flex-col justify-center col-span-2 relative overflow-hidden group">
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-sm font-orbitron text-gray-400">MEMORY ALLOCATION (XP)</span>
                            <span className="text-lg font-mono text-cyan-300">{xp} / {maxXp}</span>
                        </div>
                        <div className="h-4 bg-gray-900 rounded-sm overflow-hidden border border-white/5 relative">
                            {/* Standard Bar */}
                            <motion.div
                                className="h-full bg-gradient-to-r from-cyan-600 via-blue-500 to-purple-600"
                                initial={{ width: 0 }}
                                animate={{ width: `${xpPercent}%` }}
                                transition={{ duration: 1, ease: 'easeOut' }}
                            />
                            {/* Loading particle effect */}
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                        </div>
                        <div className="absolute right-0 top-0 h-full w-px bg-cyan-500/20" />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Stats & Scan */}
                    <div className="space-y-6">
                        <div className="glass-panel p-6 relative overflow-hidden">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-orbitron text-white text-lg flex items-center gap-2">
                                    <Activity size={18} className="text-red-400" /> VITALS
                                </h3>
                                <button onClick={() => setScanning(!scanning)} className="text-xs text-cyan-400 border border-cyan-500/30 px-2 py-1 rounded hover:bg-cyan-500/10 transition-colors">
                                    {scanning ? 'STOP SCAN' : 'DIAGNOSE'}
                                </button>
                            </div>

                            <div className="relative h-48 flex items-center justify-center mb-4">
                                {/* Humanwireframe or abstract rep */}
                                <div className={`relative transition-all duration-1000 ${scanning ? 'scale-100 opacity-100' : 'scale-95 opacity-50 blur-[1px]'}`}>
                                    <div className="w-32 h-48 border-2 border-dashed border-cyan-500/30 rounded-lg flex flex-col items-center justify-center p-2">
                                        <div className="w-full h-px bg-cyan-500/50 absolute top-1/2 animate-scan" />
                                        <span className="font-mono text-[10px] text-cyan-500 absolute top-2 left-2">L: {level}</span>
                                        <span className="font-mono text-[10px] text-red-500 absolute bottom-2 right-2">HP: {hp}</span>
                                        <Shield size={48} className="text-gray-700" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 font-mono text-sm">
                                <div className="flex justify-between border-b border-white/5 pb-2">
                                    <span className="text-gray-400">Health Integrity</span>
                                    <span className="text-green-400">{hp} / {maxHp}</span>
                                </div>
                                <div className="flex justify-between border-b border-white/5 pb-2">
                                    <span className="text-gray-400">Base Dmg</span>
                                    <span className="text-red-400">{(10 + damageSkill * 2).toFixed(1)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Execution Speed</span>
                                    <span className="text-yellow-400">{(1.0 + critSkill * 0.05).toFixed(2)}x</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Middle: Neural Graph (Skill Tree) */}
                    <div className="lg:col-span-2 glass-panel p-8 relative overflow-hidden backdrop-blur-xl">
                        <div className="absolute top-0 right-0 p-4">
                            <span className="text-xs font-mono text-purple-300 bg-purple-900/40 px-3 py-1 rounded border border-purple-500/30">
                                AVAILABLE POINTS: {skillPoints}
                            </span>
                        </div>
                        <h3 className="font-orbitron text-white text-lg mb-12 flex items-center gap-2">
                            <Cpu size={18} className="text-purple-400" /> NEURAL UPGRADE PATH
                        </h3>

                        <div className="flex flex-wrap justify-center gap-12 md:gap-24 relative z-10">
                            {/* Damage Node */}
                            <SkillNode
                                icon={Sword}
                                label="OVERCLOCK"
                                level={damageSkill}
                                color="text-red-400"
                                active={true}
                                onUpgrade={() => actions.spendSkillPoint('damage')}
                                canUpgrade={skillPoints > 0}
                            />

                            {/* Crit Node */}
                            <SkillNode
                                icon={Terminal}
                                label="PRECISION"
                                level={critSkill}
                                color="text-yellow-400"
                                active={true}
                                onUpgrade={() => actions.spendSkillPoint('crit')}
                                canUpgrade={skillPoints > 0}
                            />

                            {/* Heal Node */}
                            <SkillNode
                                icon={Database}
                                label="RECOVERY"
                                level={healSkill}
                                color="text-green-400"
                                active={true}
                                onUpgrade={() => actions.spendSkillPoint('heal')}
                                canUpgrade={skillPoints > 0}
                            />
                        </div>

                        {/* Advanced Perks Section */}
                        <div className="mt-16 border-t border-white/5 pt-8">
                            <h4 className="font-orbitron text-xs text-gray-500 mb-6 text-center tracking-[0.2em] uppercase">Advanced Neural Protocols (Cost: 2 SP)</h4>
                            <div className="flex justify-center gap-8">
                                <SkillNode
                                    icon={Cpu}
                                    label="PY_COMPILER"
                                    level={playerData.advancedSkills?.optimized_compiler ? 1 : 0}
                                    max={1}
                                    color="text-blue-400"
                                    active={true}
                                    onUpgrade={() => actions.unlockAdvancedSkill('optimized_compiler')}
                                    canUpgrade={skillPoints >= 2 && !playerData.advancedSkills?.optimized_compiler}
                                />
                                <SkillNode
                                    icon={Zap}
                                    label="LOOP_MASTERY"
                                    level={playerData.advancedSkills?.loop_mastery ? 1 : 0}
                                    max={1}
                                    color="text-orange-400"
                                    active={true}
                                    onUpgrade={() => actions.unlockAdvancedSkill('loop_mastery')}
                                    canUpgrade={skillPoints >= 2 && !playerData.advancedSkills?.loop_mastery}
                                />
                                <SkillNode
                                    icon={Scan}
                                    label="DEBUG_SUITE"
                                    level={playerData.advancedSkills?.debug_suite ? 1 : 0}
                                    max={1}
                                    color="text-pink-400"
                                    active={true}
                                    onUpgrade={() => actions.unlockAdvancedSkill('debug_suite')}
                                    canUpgrade={skillPoints >= 2 && !playerData.advancedSkills?.debug_suite}
                                />
                            </div>
                        </div>

                        {/* Background Deco Grid */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none z-0" />
                    </div>
                </div>

                {/* Bottom: Inventory Grid */}
                <div className="glass-panel p-6">
                    <h3 className="font-orbitron text-white text-lg mb-6">STORAGE_DRIVE_01</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                        {playerData.inventory.map((item, idx) => (
                            <div key={idx} className="group relative">
                                <div className={`aspect-square bg-gray-900/80 border rounded-xl flex flex-col items-center justify-center p-3 transition-all hover:bg-gray-800 cursor-pointer ${RarityColor[item.rarity] || RarityColor["Common"]}`}>
                                    <div className="mb-2 transform group-hover:scale-110 transition-transform duration-300">
                                        <Sword size={24} />
                                    </div>
                                    <span className="text-[10px] font-mono text-center leading-tight truncate w-full px-1">{item.name}</span>
                                </div>

                                {/* Item Tooltip */}
                                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 bg-black/95 border border-gray-700 rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
                                    <h4 className={`text-sm font-bold mb-1 ${item.rarity === 'Legendary' ? 'text-yellow-400' : 'text-gray-200'}`}>{item.name}</h4>
                                    <div className="text-[10px] text-gray-400 space-y-1 font-mono">
                                        <div className="flex justify-between">
                                            <span>DMG DEALT</span>
                                            <span className="text-white">{item.damage}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>CRIT %</span>
                                            <span className="text-white">{(item.critChance * 100).toFixed(0)}%</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>TYPE</span>
                                            <span className={RarityColor[item.rarity]?.split(' ')[0]}>{item.rarity}</span>
                                        </div>
                                        <div className="pt-2 italic text-gray-500 border-t border-gray-800 mt-1">
                                            "{item.description}"
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {[...Array(Math.max(0, 12 - playerData.inventory.length))].map((_, i) => (
                            <div key={`empty-${i}`} className="aspect-square bg-black/20 border border-dashed border-gray-800 rounded-xl flex items-center justify-center opacity-50">
                                <div className="w-2 h-2 rounded-full bg-gray-800" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .clip-hexagon {
                    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
                }
                .animate-scan {
                    animation: scan 2s linear infinite;
                }
                @keyframes scan {
                    0% { top: 0%; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
            `}</style>
        </PageLayout>
    );
};

export default WarRoom;
