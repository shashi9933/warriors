import { LEVELS, WEAPONS } from '../data/gameData';
import { executePython } from './pythonExecutor';

export const startDungeonRun = () => {
    return {
        currentStageIndex: 0,
        stagesComplete: 0,
        isComplete: false,
        isFailed: false,
        rewards: {
            xp: 0,
            loot: [] // Array of item objects
        }
    };
};

export const verifyStageSolution = async (code, stageId) => {
    const level = LEVELS.find(l => l.stage === stageId);
    if (!level) return { success: false, error: "Level not found" };

    // 1. Run User Code
    const result = await executePython(code);

    if (!result.success) {
        return {
            success: false,
            output: result.output,
            error: result.error || "Runtime Error"
        };
    }

    // 2. Run Validation Logic (Python side check)
    // We append the validation code to the user's code context
    // Ideally we re-run with validation wrapper, but for simplicity/performance in this MVP:
    // We'll run a new python script that defines the user's function (if any) and runs tests.
    // BUT Pyodide state is persistent unless reset. keeping it simple:

    const validationCheck = await executePython(level.starterCode + "\n" + code + "\n" + level.validationCode);

    // We check stdout for "CORRECT"
    const passed = validationCheck.output.includes("CORRECT");

    return {
        success: passed,
        output: result.output + "\n>>> Test Result: " + (passed ? "PASS" : "FAIL"),
        error: passed ? null : "Incorrect Output"
    };
};

export const progressStage = (runState) => {
    const nextIndex = runState.currentStageIndex + 1;
    const isComplete = nextIndex >= LEVELS.length;

    // Loot Logic
    const newLoot = [...runState.rewards.loot];
    const dropChance = 0.3; // 30% chance per stage
    if (Math.random() < dropChance) {
        // Find a random weapon that isn't Common (just for fun)
        const possibleLoot = WEAPONS.filter(w => w.rarity !== 'Common');
        if (possibleLoot.length > 0) {
            const item = possibleLoot[Math.floor(Math.random() * possibleLoot.length)];
            // Avoid duplicates in this run? Nah, let 'em have it.
            newLoot.push(item);
        }
    }

    return {
        ...runState,
        currentStageIndex: nextIndex,
        stagesComplete: runState.stagesComplete + 1,
        isComplete,
        rewards: {
            ...runState.rewards,
            loot: newLoot
        }
    };
};
