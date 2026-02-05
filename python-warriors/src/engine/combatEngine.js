export const calculateDamage = (player, boss, codeResult) => {
    if (!codeResult.success) {
        // Penalty for error
        // If they attempted error handling (Try/Except), reduce penalty
        const hasSafetyNet = codeResult.code?.includes('try:') && codeResult.code?.includes('except:');

        return {
            damage: 0,
            isCrit: false,
            message: hasSafetyNet ? "Error caught! Shield active." : "Syntax Error! The spell fizzled.",
            selfDamage: hasSafetyNet ? 1 : 5 // Reduced damage
        };
    }

    let baseDamage = 10 + (player.damageSkill * 2);

    // Weapon Bonus
    if (player.equippedWeapon) {
        baseDamage += player.equippedWeapon.damage;
    }

    // Rage Bonus (0-100% bonus)
    const rageMultiplier = 1 + (player.rage / 100);

    // Crit Calculation
    // Base 10% + Skill * 5% + Weapon Bonus
    let critChance = 0.10 + (player.critSkill * 0.05);
    if (player.equippedWeapon) {
        critChance += (player.equippedWeapon.critChance || 0);
    }

    const isCrit = Math.random() < critChance;
    const critMultiplier = isCrit ? 2 : 1;

    // Pattern Bonuses
    let patternBonus = 1;
    let patternMsg = "";

    if (codeResult.patterns?.hasRecursion) {
        patternBonus += 0.5; // +50% for recursion
        patternMsg += " [Recursion +50%]";
    }
    if (codeResult.patterns?.hasLoopBreak) {
        patternBonus += 0.3; // +30% for optimized loops
        patternMsg += " [Loop Break +30%]";
    }
    if (codeResult.patterns?.hasListComp) {
        critChance += 0.20; // +20% Flat Crit Chance
        patternMsg += " [List Comp: Crit Up]";
    }
    if (codeResult.patterns?.hasTryExcept) {
        // Safe Code Bonus
        baseDamage += 5;
        patternMsg += " [Safe Code +5]";
    }

    // --- Advanced Skill Modifiers ---
    if (player.advancedSkills?.optimized_compiler) {
        baseDamage *= 1.1; // +10% Base Damage
    }
    if (player.advancedSkills?.loop_mastery && (codeResult.code?.includes('for ') || codeResult.code?.includes('while '))) {
        patternBonus += 0.2; // +20% Loop Mastery
        patternMsg += " [Loop Mastery +20%]";
    }

    if (player.advancedSkills?.debug_suite) {
        // Base Analysis Bonus
        baseDamage += 5; // Flat detection bonus

        // Weakness Exploits
        if (boss.id === 'function_dragon' && codeResult.patterns?.hasRecursion) {
            patternBonus += 0.25;
            patternMsg += " [WEAKNESS EXPLOITED: RECURSION]";
        }
        if (boss.id === 'memory_leech' && codeResult.patterns?.hasListComp) {
            patternBonus += 0.25;
            patternMsg += " [WEAKNESS EXPLOITED: LIST COMP]";
        }
    }

    const totalDamage = Math.floor(baseDamage * rageMultiplier * critMultiplier * patternBonus);

    return {
        damage: totalDamage,
        isCrit,
        message: `Dealt ${totalDamage} damage!${isCrit ? ' CRITICAL HIT!' : ''}${patternMsg}`,
        selfDamage: 0
    };
};

export const calculateBossDamage = (boss, player) => {
    // Basic logic: Boss damage increases as HP gets lower (Enrage)
    const hpPercent = (boss.hp / boss.maxHp);
    let multiplier = 1;

    if (hpPercent < 0.4) multiplier = 1.5; // Enraged
    if (hpPercent < 0.1) multiplier = 2.0; // Desperate

    return Math.floor(boss.damage * multiplier);
};
