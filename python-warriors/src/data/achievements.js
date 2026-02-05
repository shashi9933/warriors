import { Award, Zap, Code, Terminal, Bug, Skull, Cpu, Shield, Flame } from 'lucide-react';

export const RANKS = [
    { minLevel: 1, title: "Script Kiddie", color: "text-gray-400" },
    { minLevel: 5, title: "Junior Dev", color: "text-green-400" },
    { minLevel: 10, title: "Code Warrior", color: "text-cyan-400" },
    { minLevel: 20, title: "Senior Architect", color: "text-purple-400" },
    { minLevel: 30, title: "Algorithm Master", color: "text-yellow-400" },
    { minLevel: 50, title: "AI Overlord", color: "text-red-500" },
];

export const ACHIEVEMENTS = [
    {
        id: "first_blood",
        title: "First Blood",
        description: "Defeat your first enemy.",
        icon: Skull,
        condition: (stats) => stats.bossesDefeated >= 1,
        xpReward: 100
    },
    {
        id: "syntax_survivor",
        title: "Syntax Survivor",
        description: "Survive a battle with < 10 HP.",
        icon: Shield,
        condition: (stats) => stats.lowHpSurvival >= 1,
        xpReward: 200
    },
    {
        id: "loop_master",
        title: "Loop Master",
        description: "Execute 50 Loops in combat.",
        icon: Zap,
        condition: (stats) => stats.loopsUsed >= 50,
        xpReward: 300
    },
    {
        id: "recursion_king",
        title: "Recursion King",
        description: "Use Recursion 10 times.",
        icon: Code,
        condition: (stats) => stats.recursionsUsed >= 10,
        xpReward: 500
    },
    {
        id: "glitch_hunter",
        title: "Glitch Hunter",
        description: "Trigger 50 Critical Hits.",
        icon: Bug,
        condition: (stats) => stats.criticalHits >= 50,
        xpReward: 400
    },
    {
        id: "damage_dealer",
        title: "buffer_overflow",
        description: "Deal 10,000 Total Damage.",
        icon: Flame,
        condition: (stats) => stats.totalDamage >= 10000,
        xpReward: 500
    }
];

export const getRank = (level) => {
    return RANKS.slice().reverse().find(r => level >= r.minLevel) || RANKS[0];
};
