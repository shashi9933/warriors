import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { CLASSES, WEAPONS } from '../data/gameData';
import { ACHIEVEMENTS } from '../data/achievements';

const PlayerContext = createContext();

const initialState = {
    // Identity
    level: 1,
    xp: 0,
    maxXp: 1000,
    classType: "Loop Knight",

    // Stats
    hp: 120,
    maxHp: 120,
    damageSkill: 0,
    critSkill: 0,
    healSkill: 0,
    skillPoints: 0,

    // Combat Meters
    rage: 0,
    focus: 0,

    // Inventory & Equipment
    inventory: [WEAPONS[0]], // Start with Steel Blade
    equippedWeapon: WEAPONS[0],

    // Progression
    unlockedUltimates: [],
    completedQuests: [],
    advancedSkills: {
        optimized_compiler: false, // +10% Damage
        loop_mastery: false,       // +20% Loop Damage
        debug_suite: false         // Reveal Boss Weakness
    },

    // Analytics
    stats: {
        totalDamage: 0,
        bossesDefeated: 0,
        recursionsDetected: 0
    }
};

// Reducer for state updates
const playerReducer = (state, action) => {
    switch (action.type) {
        case 'LOAD_GAME':
            return {
                ...state,
                ...action.payload,
                // Ensure new state shape exists if loading old save
                advancedSkills: action.payload.advancedSkills || initialState.advancedSkills
            };

        case 'GAIN_XP':
            const newXp = state.xp + action.payload;
            if (newXp >= state.maxXp) {
                // Level Up!
                return {
                    ...state,
                    level: state.level + 1,
                    xp: newXp - state.maxXp,
                    maxXp: Math.floor(state.maxXp * 1.5),
                    skillPoints: state.skillPoints + 1,
                    maxHp: state.maxHp + 10,
                    hp: state.maxHp + 10 // Full heal on level up
                };
            }
            return { ...state, xp: newXp };

        case 'UPDATE_HP':
            return { ...state, hp: Math.min(state.maxHp, Math.max(0, action.payload)) };

        case 'UPDATE_METERS':
            return {
                ...state,
                rage: Math.min(100, Math.max(0, action.payload.rage ?? state.rage)),
                focus: Math.min(100, Math.max(0, action.payload.focus ?? state.focus))
            };

        case 'EQUIP_WEAPON':
            return { ...state, equippedWeapon: action.payload };

        case 'ADD_ITEM':
            return { ...state, inventory: [...state.inventory, action.payload] };

        case 'SPEND_SKILL':
            // payload is 'damage', 'crit', or 'heal'
            if (state.skillPoints <= 0) return state;
            return {
                ...state,
                skillPoints: state.skillPoints - 1,
                [`${action.payload}Skill`]: state[`${action.payload}Skill`] + 1
            };

        case 'UNLOCK_ADVANCED_SKILL':
            // payload is skillId (e.g., 'optimized_compiler')
            if (state.skillPoints < 2) return state; // Advanced skills cost 2 points
            if (state.advancedSkills[action.payload]) return state; // Already unlocked

            return {
                ...state,
                skillPoints: state.skillPoints - 2,
                advancedSkills: {
                    ...state.advancedSkills,
                    [action.payload]: true
                }
            };

        case 'UPDATE_STATS':
            // Recursive merge for stats
            const updatedStats = { ...state.stats };
            Object.keys(action.payload).forEach(key => {
                updatedStats[key] = (updatedStats[key] || 0) + action.payload[key];
            });
            return {
                ...state,
                stats: updatedStats
            };

        case 'UNLOCK_ACHIEVEMENT':
            if (state.achievements?.includes(action.payload)) return state;
            return {
                ...state,
                achievements: [...(state.achievements || []), action.payload]
            };

        default:
            return state;
    }
};

export const PlayerProvider = ({ children }) => {
    // State
    const [playerData, dispatch] = useReducer(playerReducer, initialState, () => {
        // Load from local storage
        const saved = localStorage.getItem('pythonWarriors_save');
        return saved ? JSON.parse(saved) : initialState;
    });

    // Auto-save
    useEffect(() => {
        localStorage.setItem('pythonWarriors_save', JSON.stringify(playerData));
    }, [playerData]);

    // Check Achievements on stats update
    useEffect(() => {
        if (!playerData.stats) return;

        ACHIEVEMENTS.forEach(ach => {
            if (!playerData.achievements?.includes(ach.id)) {
                if (ach.condition(playerData.stats)) {
                    dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: ach.id });
                    // Optional: Add notification here or handled by UI observing state
                }
            }
        });
    }, [playerData.stats, playerData.achievements]);

    // Helper Actions
    const gainXP = (amount) => dispatch({ type: 'GAIN_XP', payload: amount });
    const takeDamage = (amount) => dispatch({ type: 'UPDATE_HP', payload: playerData.hp - amount });
    const heal = (amount) => dispatch({ type: 'UPDATE_HP', payload: playerData.hp + amount });
    const buildRage = (amount) => dispatch({ type: 'UPDATE_METERS', payload: { rage: playerData.rage + amount } });
    const buildFocus = (amount) => dispatch({ type: 'UPDATE_METERS', payload: { focus: playerData.focus + amount } });
    const equipWeapon = (weapon) => dispatch({ type: 'EQUIP_WEAPON', payload: weapon });
    const addItem = (item) => dispatch({ type: 'ADD_ITEM', payload: item });
    const spendSkillPoint = (skillType) => dispatch({ type: 'SPEND_SKILL', payload: skillType });
    const unlockAdvancedSkill = (skillId) => dispatch({ type: 'UNLOCK_ADVANCED_SKILL', payload: skillId });

    // Stats & Achievements
    const updateStats = (newStats) => dispatch({ type: 'UPDATE_STATS', payload: newStats });
    const unlockAchievement = (id) => dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: id });

    return (
        <PlayerContext.Provider value={{
            playerData,
            dispatch,
            actions: {
                gainXP,
                takeDamage,
                heal,
                buildRage,
                buildFocus,
                equipWeapon,
                addItem,
                spendSkillPoint,
                unlockAdvancedSkill,
                updateStats,
                unlockAchievement
            }
        }}>
            {children}
        </PlayerContext.Provider>
    );
};

export const usePlayer = () => useContext(PlayerContext);
