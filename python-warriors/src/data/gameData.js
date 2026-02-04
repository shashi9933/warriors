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
    function_dragon: {
        id: "function_dragon",
        name: "Function Dragon",
        hp: 500,
        maxHp: 500,
        damage: 10,
        phases: [
            { threshold: 70, name: "Normal", damageMult: 1 },
            { threshold: 40, name: "Enraged", damageMult: 1.5, message: "The dragon's eyes glow red! (Damage x1.5)" },
            { threshold: 0, name: "Desperate", damageMult: 2, message: "The dragon unleashes unlimited recursion! (Damage x2)" }
        ]
    },
    memory_leech: {
        id: "memory_leech",
        name: "Memory Leech",
        hp: 300,
        maxHp: 300,
        damage: 5,
        description: "A parasitic entity that drains system resources.",
        mechanic: "Regenerates HP every turn. Drains your Focus.",
        phases: [
            { threshold: 50, name: "Siphon", damageMult: 1, message: "The Leech siphons your memory! (Focus Drained)" },
            { threshold: 0, name: "Overflow", damageMult: 3, message: "Use List Comprehension to purge it!" }
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
