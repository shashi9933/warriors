# 🐉 Python Warriors — Game Manual
## *The Loop Knight Saga: A Player's Guide*

---

## 🎮 Welcome, Code Warrior

You are a **Code Knight** in a world where logic is law and bugs are monsters. Your weapon is Python. Your battlefield is the terminal. Your enemy is Chaos itself.

This manual will teach you how to:
- ⚔️ **Master combat mechanics**
- 🧙 **Unlock ultimate abilities**
- 📈 **Progress efficiently**
- 🎯 **Defeat the Function Dragon**
- 🏆 **Become a legendary Loop Knight**

---

## 📖 Table of Contents

1. [Game Modes](#game-modes)
2. [Combat System](#combat-system)
3. [Rage & Focus](#rage--focus-meters)
4. [Ultimate Abilities](#ultimate-abilities)
5. [Classes](#classes)
6. [Skills & Progression](#skills--progression)
7. [Inventory & Weapons](#inventory--weapons)
8. [Quests](#quests)
9. [Controls](#controls)
10. [Victory Conditions](#victory-conditions)
11. [Tips & Strategies](#tips--strategies)
12. [Lore](#lore)
13. [Endgame](#endgame)

---

## 🎯 Game Modes

### 1. War Room (Hub)
**Your command center for preparation**

**What You Can Do:**
- 📊 View your stats (Level, XP, HP, Class)
- 🌳 Spend skill points on Damage, Crit, or Heal
- 🎒 Manage inventory and equip weapons
- 💫 Unlock and upgrade ultimate abilities
- 📜 Check active quests and completed missions
- 📈 Review combat statistics and history

**Navigation:**
```
Main Menu → War Room
         → Skills Tab (spend points)
         → Inventory Tab (equip gear)
         → Ultimates Tab (unlock abilities)
         → Quests Tab (track missions)
```

---

### 2. Battle Arena (Boss Fight)
**Face the Function Dragon in epic combat**

**Objective:**  
Write Python code to solve challenges. Correct code deals damage; errors hurt you.

**Flow:**
1. Read the quest prompt (e.g., "Write a function that adds two numbers")
2. Write Python code in the editor
3. Click **EXECUTE_SPELL()**
4. Watch the combat animation
5. Repeat until victory or defeat

**Example Challenge:**
```
Quest: Write a function add(a, b) that returns a+b, then print add(2, 3).
Expected Output: 5
```

**Your Solution:**
```python
def add(a, b):
    return a + b

print(add(2, 3))
```
**Result:** ✅ Deals 15 damage to boss, charges Focus +5

---

### 3. Dungeon Run
**Multi-stage progression challenges**

**Structure:**
- 5 increasingly difficult stages
- Each stage requires Python code
- XP and loot rewards per stage
- **Permadeath:** If you die, the run resets

**Example Run:**
```
Stage 1: Print 1-10           → 100 XP, Common Weapon
Stage 2: Sum a list           → 200 XP, Uncommon Armor
Stage 3: Reverse a string     → 300 XP, Rare Potion
Stage 4: Implement quicksort  → 500 XP, Epic Rune
Stage 5: Boss Fight           → 1000 XP, Legendary Weapon
```

---

### 4. World (Exploration) — *Coming Soon*
**Node-based map with story content**

**Planned Features:**
- Travel between regions (Sventeit, Geerteit, Gerle)
- Story nodes with lore
- Combat nodes with enemies
- Merchant nodes for shopping
- Quest chains that span multiple nodes

---

## ⚔️ Combat System

### How Combat Works

**Turn Structure:**
1. **Your Turn:**
   - Write Python code
   - Execute code
   - If **correct** → Deal damage, heal, charge Focus
   - If **wrong/error** → Take damage, build Rage

2. **Boss Turn:**
   - Boss attacks you
   - Damage scales with boss phase
   - Can be skipped with **Time Freeze** ultimate

### Damage Calculation

```javascript
// Your damage formula
baseDamage = 10 + (damageSkill * 2) + weaponDamage
critMultiplier = (Math.random() < critChance) ? 2 : 1
rageBonus = rage * 0.01
finalDamage = baseDamage * critMultiplier * (1 + rageBonus)

// Boss damage formula
bossDamage = 5 + (bossPhase * 5) - (playerDefense)
```

**Example:**
```
Player: Level 3 Loop Knight
Damage Skill: 5
Weapon: Steel Blade (+10 ATK)
Rage: 30

Base Damage = 10 + (5*2) + 10 = 30
Crit Roll = 0.15 (no crit)
Rage Bonus = 30 * 0.01 = 0.3 (30% more damage)
Final Damage = 30 * 1 * 1.3 = 39 damage
```

### Pattern Detection

**The game detects HOW you code, not just IF it works.**

| Pattern | Trigger | Effect |
|---------|---------|--------|
| **Recursion** | Function calls itself | Charges **Fireball** ultimate |
| **Loop + Break** | `for` or `while` with `break` | Charges **Time Freeze** ultimate |
| **Base Case** | `if` condition with `return` | Charges **Mega Heal** ultimate |

**Example Code:**
```python
# Recursion detected → Fireball charges +10
def factorial(n):
    if n <= 1:           # Base case → Mega Heal charges +5
        return 1
    return n * factorial(n-1)

# Loop with break → Time Freeze charges +8
for i in range(10):
    if i == 5:
        break
```

**Pro Tip:** Write elegant code with all three patterns to charge multiple ultimates at once!

---

## 🔥 Rage & Focus Meters

### Rage (Red Bar)
**Source:** Taking damage from boss attacks or code errors  
**Effect:** Increases your damage output  
**Formula:** `+1% damage per 1 Rage`  
**Max:** 100 Rage

**Strategy:**  
- Rage is a **glass cannon** mechanic
- High Rage = high risk, high reward
- Use healing to reset Rage if it gets too dangerous

---

### Focus (Blue Bar)
**Source:** Writing correct code  
**Effect:** Powers ultimate abilities  
**Cost:**
- Fireball: 25 Focus
- Time Freeze: 30 Focus
- Mega Heal: 20 Focus

**Gain Rate:**
- Correct code: +5 Focus
- Perfect code (all patterns): +15 Focus
- Critical hit: +3 bonus Focus

**Strategy:**  
- Focus is your **super meter**
- Save it for boss phases 2 and 3
- Mega Heal is cheapest; use it first in emergencies

---

## 💫 Ultimate Abilities

### Unlocking Ultimates
1. Go to **War Room**
2. Click **Ultimates** tab
3. Click **Unlock** next to desired ability
4. *(Note: Some ultimates require quests or level requirements)*

---

### Fireball 🔥
**Cost:** 25 Focus  
**Effect:** Deal 50 AoE damage to boss  
**Best For:** Burst damage in Phase 3  
**Charge Trigger:** Use recursion in your code

**Example Charge Code:**
```python
def power(base, exp):
    if exp == 0:
        return 1
    return base * power(base, exp - 1)  # Recursion!
```

---

### Time Freeze ⏰
**Cost:** 30 Focus  
**Effect:** Skip the boss's next turn  
**Best For:** Avoiding Phase 2 enrage attacks  
**Charge Trigger:** Use loop + break in your code

**Example Charge Code:**
```python
for i in range(100):
    if i == 10:
        break  # Loop + break!
    print(i)
```

---

### Mega Heal 💚
**Cost:** 20 Focus  
**Effect:** Restore 40% of max HP  
**Best For:** Emergencies when HP < 30%  
**Charge Trigger:** Use base cases in recursion

**Example Charge Code:**
```python
def countdown(n):
    if n <= 0:        # Base case!
        return "Done"
    return countdown(n-1)
```

---

### Ultimate Hotbar
During combat, your hotbar shows:
```
[🔥 Fireball: 25/30] [⏰ Time Freeze: 15/30] [💚 Mega Heal: 20/20 READY!]
```

**How to Cast:**
1. Check if ability is charged (number >= cost)
2. Click the ability button
3. Ability activates immediately
4. Cooldown timer starts (3 turns)

---

## 🎭 Classes

### Choosing Your Class
Classes are selected in **War Room → Character Tab**.

---

### Loop Knight (Balanced)
**Base Stats:**
- HP: 120
- Damage: 15
- Crit Chance: 10%

**Passive:** *Tanky*  
- Take 10% less damage from all sources

**Ultimate:** *Rage Strike*  
- Converts 50% of Rage into instant damage

**Best For:** New players, solo play, consistency

---

### Recursion Mage (High Risk, High Reward)
**Base Stats:**
- HP: 80
- Damage: 20
- Crit Chance: 15%

**Passive:** *Fast Charge*  
- Gain 2x Focus from recursion patterns

**Ultimate:** *Fireball*  
- Fireball costs 20 Focus instead of 25

**Best For:** Aggressive players, speedruns, glass cannon builds

---

### Async Assassin (Critical Specialist)
**Base Stats:**
- HP: 90
- Damage: 25
- Crit Chance: 25%

**Passive:** *High Crit*  
- Critical hits deal 3x damage instead of 2x

**Ultimate:** *Critical Storm*  
- Next 3 attacks automatically crit

**Best For:** Advanced players, risk-takers, burst damage builds

---

## 📈 Skills & Progression

### Leveling Up
**XP Requirements:**
```
Level 1 → 2: 5,000 XP
Level 2 → 3: 10,000 XP
Level 3 → 4: 20,000 XP
(XP requirement doubles each level)
```

**XP Sources:**
- Defeating Function Dragon: 1,000 XP
- Completing Dungeon Stage: 100-500 XP
- Quest completion: Varies

**Rewards per Level:**
- +10 Max HP
- +1 Skill Point
- +5 Base Damage

---

### Skill Tree
**Three branches to invest in:**

#### Damage (Red)
- **Effect:** +2 base damage per point
- **Best For:** Aggressive playstyles
- **Max:** 10 points

#### Crit (Yellow)
- **Effect:** +5% crit chance per point
- **Best For:** Burst damage builds
- **Max:** 10 points

#### Heal (Green)
- **Effect:** +10% self-healing per point
- **Best For:** Survivability, long fights
- **Max:** 10 points

---

### Recommended Builds

**Beginner Build:**
```
Damage: 5 points
Crit: 3 points
Heal: 2 points
Focus: Balanced survivability
```

**Speedrun Build:**
```
Damage: 8 points
Crit: 7 points
Heal: 0 points
Focus: Kill boss before you die
```

**Tank Build:**
```
Damage: 3 points
Crit: 2 points
Heal: 10 points
Focus: Outlast the boss
```

---

## 🎒 Inventory & Weapons

### Weapon System
Weapons provide:
- ✅ **Damage bonus** (added to base damage)
- ✅ **Crit chance bonus**
- ✅ **Special effects** (rare weapons only)

---

### Weapon Tiers

#### Common (White)
**Example:** *Steel Blade*
- Damage: +10
- Crit: +5%
- Effect: None

#### Uncommon (Green)
**Example:** *Iron Axe*
- Damage: +15
- Crit: +8%
- Effect: None

#### Rare (Blue)
**Example:** *Recursion Staff*
- Damage: +20
- Crit: +10%
- Effect: +2 Focus per recursion

#### Epic (Purple)
**Example:** *Loop Breaker*
- Damage: +30
- Crit: +15%
- Effect: Time Freeze costs 25 Focus

#### Legendary (Gold)
**Example:** *Dragon Slayer*
- Damage: +50
- Crit: +25%
- Effect: Deal 2x damage to bosses

---

### Equipping Weapons
1. Go to **War Room**
2. Click **Inventory** tab
3. Click on a weapon card
4. Click **Equip**
5. Stats update immediately

---

## 📜 Quests

### Quest Types

#### Main Quests
- Story-driven missions
- Unlock new areas
- Grant legendary rewards

**Example:** *Defeat the Function Dragon*
- Reward: 1,000 XP, Dragon Scale (crafting material)

#### Side Quests
- Optional challenges
- Unlock ultimates
- Grant bonus XP

**Example:** *Master Recursion*
- Reward: Unlock Fireball ultimate

#### Daily Quests *(Coming Soon)*
- Refresh every 24 hours
- Quick XP boosts

---

### Quest Log
Access via **War Room → Quests Tab**

**Displays:**
- ✅ Active quest
- ✅ Completed quests
- ✅ Available quests
- ✅ Quest rewards

---

## 🎮 Controls

### In Battle
- **Type Code:** Use keyboard in editor
- **Execute Code:** Click `EXECUTE_SPELL()` button (or `Ctrl+Enter`)
- **Cast Ultimate:** Click ability button on hotbar
- **View Stats:** Hover over HP/Rage/Focus bars

### In War Room
- **Navigate Tabs:** Click Skills / Inventory / Ultimates / Quests
- **Spend Skill Point:** Click `+` next to skill
- **Equip Weapon:** Click weapon card, then `Equip`
- **Unlock Ultimate:** Click `Unlock` next to ability

### In World *(Coming Soon)*
- **Travel:** Click on connected nodes
- **Enter Node:** Click `[ENTER NODE]` button
- **Open Quest:** Click quest icon

---

## 🏆 Victory Conditions

### Win Condition
**Defeat the Function Dragon**
- Boss HP reaches 0
- You survive

**Rewards:**
- 1,000 XP
- Random loot (weapon or potion)
- Quest completion (if active)

---

### Lose Condition
**Your HP reaches 0**
- Game over
- Run resets
- XP penalty: Lose 10% of current XP

**Important:** Dungeon Run progress is also lost on death.

---

## 💡 Tips & Strategies

### Beginner Tips
1. **Unlock Mega Heal first** — It's the cheapest and most forgiving
2. **Invest in Heal skill early** — Survivability > damage at low levels
3. **Equip any weapon** — Even Common weapons help
4. **Use recursion often** — Fireball is the strongest ultimate
5. **Read quest descriptions** — They hint at optimal solutions

### Intermediate Tips
6. **Learn pattern detection** — Combine recursion + base case + loop for max Focus gain
7. **Save Time Freeze for Phase 2** — Boss enrage is the most dangerous
8. **Don't spam ultimates** — Wait for high-value moments
9. **Manage Rage** — Let it build to 50-70, then heal before it gets deadly
10. **Complete side quests** — They unlock powerful abilities

### Advanced Tips
11. **Speedrun strat:** Max Damage + Crit, use Recursion Mage, spam Fireball
12. **Tank strat:** Max Heal, use Loop Knight passive, play defensive
13. **Perfect code bonus:** Write solutions with ALL three patterns for +15 Focus
14. **Crit fishing:** Reroll code until you get a crit on low HP
15. **Ultimate combos:** Time Freeze → Write perfect code → Fireball for massive damage

---

## 📚 Lore

### The Function Dragon

*"In the beginning, there was the Core Loop—an infinite algorithm that powered all of existence. But within the loop, a single bug emerged. A missing `break`. An infinite recursion. A stack overflow that gained sentience.*

*Thus was born the Function Dragon.*

*Born from corrupted logic and endless errors, the Dragon feeds on broken code and devours debugging attempts. Legends say it was once a benevolent algorithm designed to teach programmers, but repeated exposure to bad code twisted it into a monster.*

*Only a warrior who masters the Three Sacred Patterns can hope to defeat it:"*

1. **Recursion** — The spiral of infinite power
2. **Base Case** — The mercy that ends suffering
3. **Loop Break** — The escape from eternity

---

### The Loop Knight Prophecy

*"When the Compiler runs cold and the Stack grows deep,  
A coder shall rise who breaks not loops, but limits.  
They shall wield the sacred `return`,  
Command the forbidden `break`,  
And in the final recursion,  
They shall find… the base case of salvation."*

---

### The Three Classes

**Loop Knight:**  
*"Warriors who embrace the cycle. Neither recursive nor linear, they walk the balanced path."*

**Recursion Mage:**  
*"Scholars who dive into their own minds, calling themselves from within, spiraling deeper into power—or madness."*

**Async Assassin:**  
*"Rogues who strike between clock cycles, existing in moments no timeline can catch. Their crits land before the enemy knows they've attacked."*

---

## 🚀 Endgame

### What Awaits at Max Level

#### Current Endgame *(v1.0)*
- Max Level: 10
- Max Skill Points: 10
- Ultimate Loadout: All 3 abilities unlocked
- Perfect Gear: Legendary weapons equipped
- All Main Quests: Completed

#### Planned Endgame *(v1.1+)*
- **Raid Boss Mode** — 4-player co-op against Mega Dragon
- **Prestige System** — Reset to Level 1, gain permanent bonuses
- **Procedural Dungeons** — Infinite runs with scaling rewards
- **Leaderboards** — Global rankings for fastest boss kills
- **Legendary Quest Chains** — Multi-hour story arcs

---

## 🎉 Closing Words

Welcome, Loop Knight.

You now hold the knowledge to face the Function Dragon. But knowledge is not power—**execution** is.

Remember:
- Your code is your weapon
- Your logic is your armor
- Your base cases are your mercy

The Dragon awaits. The Stack grows deep. The Core Loop hums with anticipation.

**Enter the Battle Arena.**  
**Write your spell.**  
**Execute your destiny.**

*May your code always compile, and your stack never overflow.*

---

**[⬆ Back to Top](#-python-warriors--game-manual)**

---

*Last Updated: February 4, 2026*  
*Version: 1.0.0 — Loop Knight Edition*  
*For technical docs, see [README.md](README.md)*
