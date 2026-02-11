export const WEAPONS = [
    {
        id: "steel_blade",
        name: "Steel Blade",
        damage: 10,
        critChance: 0.05,
        rarity: "Common",
        description: "A standard issue blade for new recruits."
    },
    {
        id: "recursion_staff",
        name: "Recursion Staff",
        damage: 15,
        critChance: 0.10,
        special: "recursionBonus",
        rarity: "Rare",
        description: "Crackles with infinite potential."
    },
    {
        id: "loop_breaker",
        name: "Loop Breaker",
        damage: 30,
        critChance: 0.15,
        special: "timeFreezeCost",
        rarity: "Epic",
        description: "Forged from a shattered while-loop."
    },
    {
        id: "dragon_slayer",
        name: "Dragon Slayer",
        damage: 50,
        critChance: 0.25,
        special: "bossDamage",
        rarity: "Legendary",
        description: " The only weapon capable of piercing the Function Dragon's scales."
    }
];

export const CLASSES = {
    "Loop Knight": {
        baseHp: 120,
        baseDamage: 15,
        ultimate: "Rage Strike",
        passive: "Tanky",
        description: "Balanced warrior with high defense."
    },
    "Recursion Mage": {
        baseHp: 80,
        baseDamage: 20,
        ultimate: "Fireball",
        passive: "Fast Charge",
        description: "High damage glass cannon. Masters of self-reference."
    },
    "Async Assassin": {
        baseHp: 90,
        baseDamage: 25,
        ultimate: "Critical Storm",
        passive: "High Crit",
        description: "Strikes between clock cycles. Critical hit specialist."
    }
};

export const BOSSES = {
    lvl_1_syntax: {
        id: "lvl_1_syntax",
        name: "Syntax Spider",
        hp: 100,
        maxHp: 100,
        damage: 5,
        description: "A small bug that trips you up with missing parentheses.",
        phases: []
    },
    lvl_2_vars: {
        id: "lvl_2_vars",
        name: "Variable Viper",
        hp: 150,
        maxHp: 150,
        damage: 8,
        description: "Its venom changes types unexpectedly.",
        phases: []
    },
    lvl_3_math: {
        id: "lvl_3_math",
        name: "Operator Ogre",
        hp: 200,
        maxHp: 200,
        damage: 12,
        description: "Crushes those who divide by zero.",
        phases: [{ threshold: 50, name: "Modulo Rage", damageMult: 1.5, message: "The Ogre calculates the remainder... of your life!" }]
    },
    lvl_4_strings: {
        id: "lvl_4_strings",
        name: "String Serpent",
        hp: 250,
        maxHp: 250,
        damage: 10,
        description: "Wraps you in concatenated coils.",
        phases: []
    },
    lvl_5_lists: {
        id: "lvl_5_lists",
        name: "List Leviathan",
        hp: 350,
        maxHp: 350,
        damage: 15,
        description: "A deep sea monster with many segments.",
        phases: [{ threshold: 40, name: "Append Mode", damageMult: 1.2, message: "The Leviathan grows a new segment!" }]
    },
    lvl_6_conditions: {
        id: "lvl_6_conditions",
        name: "Boolean Basilisk",
        hp: 400,
        maxHp: 400,
        damage: 18,
        description: "One look at its False logic can petrify you.",
        phases: []
    },
    lvl_7_loops: {
        id: "lvl_7_loops",
        name: "Loop Lich",
        hp: 500,
        maxHp: 500,
        damage: 15,
        description: "Traps souls in an infinite cycle.",
        phases: [{ threshold: 30, name: "Infinite Loop", damageMult: 2, message: "BREAK THE LOOP OR PERISH!" }]
    },
    lvl_8_while: {
        id: "lvl_8_while",
        name: "Infinite Imp",
        hp: 450,
        maxHp: 450,
        damage: 12,
        description: "A chaotic demon that never stops until the condition is met.",
        phases: []
    },
    lvl_9_functions: {
        id: "lvl_9_functions",
        name: "Function Dragon",
        hp: 800,
        maxHp: 800,
        damage: 25,
        description: "The guardian of the Scope. Breathes pure logic.",
        phases: [
            { threshold: 60, name: "Recursive Flame", damageMult: 1.5, message: "The Dragon calls upon itself!" },
            { threshold: 20, name: "Stack Overflow", damageMult: 2.5, message: "MAXIMUM RECURSION DEPTH EXCEEDED" }
        ]
    },
    lvl_10_scope: {
        id: "lvl_10_scope",
        name: "Scope Spectre",
        hp: 600,
        maxHp: 600,
        damage: 20,
        description: "An intangible ghost that hides in local variables.",
        phases: []
    },
    lvl_11_dicts: {
        id: "lvl_11_dicts",
        name: "Dictionary Daemon",
        hp: 700,
        maxHp: 700,
        damage: 22,
        description: "Knows the key to your destruction.",
        phases: [{ threshold: 50, name: "Key Error", damageMult: 1.5, message: "The Daemon invalidates your inputs!" }]
    },
    lvl_12_sets: {
        id: "lvl_12_sets",
        name: "Set Sphinx",
        hp: 750,
        maxHp: 750,
        damage: 20,
        description: "Only accepts unique attacks.",
        phases: []
    },
    lvl_13_classes: {
        id: "lvl_13_classes",
        name: "Class Colossus",
        hp: 1000,
        maxHp: 1000,
        damage: 30,
        description: "A massive object-oriented construct.",
        phases: [{ threshold: 40, name: "Inheritance", damageMult: 1.5, message: "The Colossus inherits strength from its ancestors!" }]
    },
    lvl_14_modules: {
        id: "lvl_14_modules",
        name: "Module Mimic",
        hp: 900,
        maxHp: 900,
        damage: 25,
        description: "Can import any ability it sees.",
        phases: []
    },
    lvl_15_async: {
        id: "lvl_15_async",
        name: "Async Archon",
        hp: 1500,
        maxHp: 1500,
        damage: 40,
        description: "Exists outside of linear time. The final test.",
        phases: [
            { threshold: 75, name: "Await", damageMult: 0.5, message: "The Archon pauses time..." },
            { threshold: 25, name: "Promise Rejection", damageMult: 3, message: "UNHANDLED PROMISE REJECTION!" }
        ]
    }
};

export const QUESTS = {
    dragon_slayer: {
        id: "dragon_slayer",
        title: "Slay the Function Dragon",
        description: "Defeat the boss in Battle Arena to restore order to the codebase.",
        reward: { xp: 1000, item: "dragon_scale" },
        reqLevel: 1
    },
    recursion_mastery: {
        id: "recursion_mastery",
        title: "Master the Spiral",
        description: "Execute a recursive function successfully in combat.",
        reward: { xp: 200, unlock: "Fireball" },
        reqLevel: 2
    }
};

export const LEVELS = [
    {
        stage: 1,
        title: "The Loop Initiation",
        challenge: "Print the numbers 1 to 5, each on a new line.",
        description: "Demonstrate your command over basic iteration.",
        starterCode: "for i in range(1, 6):\n    print(i)",
        validationCode: `
expected = "1\\n2\\n3\\n4\\n5"
if output.strip() == expected:
    print("CORRECT")
else:
    print("INCORRECT")
    `,
        xpReward: 100
    },
    {
        stage: 2,
        title: "The Conditional Gate",
        challenge: "Write a function 'check_even(n)' that returns True if n is even, False otherwise.",
        description: "Master logic flow to bypass the gate.",
        starterCode: "def check_even(n):\n    # Your code here\n    pass\n\nprint(check_even(4))\nprint(check_even(7))",
        validationCode: `
try:
    if check_even(10) == True and check_even(11) == False:
        print("CORRECT")
    else:
        print("INCORRECT")
except:
    print("ERROR")
    `,
        xpReward: 150
    },
    {
        stage: 3,
        title: "String Theory",
        challenge: "Write a function 'reverse_string(s)' that returns the reversed string.",
        description: "Manipulate the fabric of text.",
        starterCode: "def reverse_string(s):\n    return s",
        validationCode: `
if reverse_string("hello") == "olleh" and reverse_string("Python") == "nohtyP":
    print("CORRECT")
else:
    print("INCORRECT")
    `,
        xpReward: 200
    },
    {
        stage: 4,
        title: "The List Labyrinth",
        challenge: "Write a function 'sum_list(numbers)' that returns the sum of all numbers in the list.",
        description: "Iterate through the data streams.",
        starterCode: "def sum_list(numbers):\n    total = 0\n    return total",
        validationCode: `
if sum_list([1, 2, 3]) == 6 and sum_list([10, -10, 5]) == 5:
    print("CORRECT")
else:
    print("INCORRECT")
    `,
        xpReward: 250
    },
    {
        stage: 5,
        title: "Key-Value Vault",
        challenge: "Write a function 'get_value(d, key)' that returns the value for the given key from dictionary d.",
        description: "Unlock the secrets of the hash map.",
        starterCode: "def get_value(d, key):\n    pass",
        validationCode: `
test_dict = {"a": 1, "b": 2}
if get_value(test_dict, "a") == 1 and get_value(test_dict, "b") == 2:
    print("CORRECT")
else:
    print("INCORRECT")
    `,
        xpReward: 300
    }
];
