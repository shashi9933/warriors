# 🐍 Python Warriors — Agentic Coding RPG
### Loop Knight Edition — *Where Code Becomes Combat*

[![License: MIT](https://img.shields.io/badge/License-MIT-cyan.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite)](https://vitejs.dev/)
[![Python](https://img.shields.io/badge/Python-In--Browser-3776AB?logo=python)](https://pyodide.org/)

---

## 🎯 What Is Python Warriors?

**Python Warriors** is a revolutionary **story-driven coding RPG** where your Python programming skills determine your survival in combat. This isn't a tutorial disguised as a game—it's a **full-scale boss-battling experience** where:

- ✨ **Your code IS your weapon** — Real Python execution, not multiple choice
- 🔥 **Pattern detection rewards mastery** — Recursion, loops, and base cases trigger ultimate abilities
- ⚔️ **Boss AI reacts to YOUR code style** — Write better algorithms, deal more damage
- 🎨 **Cinematic cyber-fantasy aesthetics** — Glassmorphism UI with reactive animations
- 📈 **Deep RPG progression** — Classes, skill trees, ultimates, inventory, and quest systems

> *"The Function Dragon guards the Core Loop. Every recursion is a wound. Every base case is mercy. Every bug feeds the abyss."*

---

## 🎮 Game Modes

### 1️⃣ War Room (Command Center)
**Your strategic hub for preparation and progression**

**Features:**
- 📊 **Player Dashboard** — Level, XP, Class, Stats
- 🌳 **Skill Tree System** — Allocate points to Damage, Crit, Heal
- 🎒 **Inventory Management** — Equip weapons and artifacts
- 🎭 **Class System** — Loop Knight, Recursion Mage, Async Assassin
- 💫 **Ultimate Abilities** — Unlock Fireball, Time Freeze, Mega Heal
- 🧩 **Passive Skill Grid** — Permanent stat bonuses
- 📜 **Quest Journal** — Track active and completed missions
- 📈 **Combat Statistics** — Win rate, damage dealt, patterns mastered

**Navigation:**
```
War Room → Skills → Spend points on Damage/Crit/Heal
         → Inventory → Equip "Steel Blade" (+10 ATK)
         → Ultimates → Unlock "Fireball" (25 Focus required)
         → Quests → Accept "Dragon's Challenge"
```

---

### 2️⃣ Battle Arena (Boss Fights)
**Face the Function Dragon in cinematic combat**

**Core Combat Loop:**
1. **Read Quest Prompt** — e.g., "Write a function that sums two numbers"
2. **Write Python Code** — Use the embedded editor
3. **Execute Spell** — Your code runs in real-time
4. **Combat Resolution:**
   - ✅ **Correct Output** → Deal damage + charge Focus + heal
   - ❌ **Wrong Output/Error** → Build Rage + take damage

**Pattern Detection Engine:**
```python
# Recursion detected → Fireball charges
def factorial(n):
    if n <= 1: return 1      # Base case → Mega Heal charges
    return n * factorial(n-1)

# Loop + break → Time Freeze charges
for i in range(10):
    if i == 5: break
```

**Meters:**
- 🔴 **Rage** — Builds when damaged; increases damage multiplier
- 🔵 **Focus** — Builds on correct code; enables ultimates
- 💚 **Health** — Player and boss HP bars

**Ultimate Hotbar:**
- 🔥 **Fireball** (25 Focus) — Massive AoE damage
- ⏰ **Time Freeze** (30 Focus) — Skip boss turn
- 💚 **Mega Heal** (20 Focus) — Restore 40% HP

**Boss Phases:**
```
Phase 1 (100-70% HP) → Standard attacks
Phase 2 (70-40% HP)  → Enrage mode, faster attacks
Phase 3 (40-0% HP)   → Ultimate abilities, regeneration
```

---

### 3️⃣ Dungeon Run
**Multi-stage progression challenges**

**Structure:**
- 5 stages per run
- Turn-based Python puzzles
- Increasing difficulty
- Loot + XP rewards
- Permadeath (run resets on death)

**Progression:**
```
Stage 1: Basic Functions     → 100 XP, Common Loot
Stage 2: Control Flow         → 200 XP, Uncommon Loot
Stage 3: Data Structures      → 300 XP, Rare Loot
Stage 4: Algorithms           → 500 XP, Epic Loot
Stage 5: Boss Encounter       → 1000 XP, Legendary Loot
```

---

### 4️⃣ World System (In Progress)
**Node-based exploration map**

**Planned Features:**
- 🗺️ **Region System** — Unlockable zones (Sventeit, Geerteit, Gerle)
- 🎯 **Node-Based Travel** — Story nodes, combat nodes, merchant nodes
- 📍 **Quest Chains** — Multi-node storylines
- 🌍 **Biome Modifiers** — Environmental effects on combat

**Current Status:** ⚠️ Prototype phase; routing logic in development

---

## 🧠 Core Systems Architecture

### PlayerContext (RPG Brain)
**Located:** `src/context/PlayerContext.jsx`

**State Management:**
```javascript
{
  // Identity
  level: 1,
  xp: 0,
  classType: "Loop Knight",
  
  // Resources
  hp: 100,
  maxHp: 100,
  skillPoints: 0,
  
  // Skills
  damageSkill: 0,
  critSkill: 0,
  healSkill: 0,
  
  // Combat Meters
  rage: 0,
  focus: 0,
  
  // Ultimates
  ultimates: {
    fireball: { unlocked: false, cooldown: 0 },
    timeFreeze: { unlocked: false, cooldown: 0 },
    megaHeal: { unlocked: false, cooldown: 0 }
  },
  
  // Inventory
  inventory: [],
  equippedWeapon: null,
  
  // Quests
  questsCompleted: [],
  activeQuest: null,
  
  // Analytics
  stats: {
    totalDamage: 0,
    bossesDefeated: 0,
    recursionsDetected: 0,
    loopsDetected: 0
  }
}
```

**Key Methods:**
- `gainXP(amount)` → Level up system
- `spendSkillPoint(skill)` → Allocate points
- `unlockUltimate(name)` → Enable abilities
- `equipWeapon(weaponId)` → Change gear
- `completeQuest(questId)` → Reward system

---

### Python Execution Engine
**Located:** `src/engine/pythonExecutor.js`

**Technology:** Pyodide (Python compiled to WebAssembly)

**Features:**
- ✅ Runs real Python in the browser
- ✅ Captures `stdout` for validation
- ✅ Handles runtime errors gracefully
- ✅ Detects code patterns (recursion, loops, base cases)
- ✅ Sandbox isolation

**Example Usage:**
```javascript
import { executePython, detectPatterns } from './engine/pythonExecutor';

const code = `
def add(a, b):
    return a + b
print(add(2, 3))
`;

const result = await executePython(code);
// result.output = "5"
// result.success = true

const patterns = detectPatterns(code);
// patterns.hasRecursion = false
// patterns.hasLoop = false
```

**Pattern Detection Logic:**
```javascript
function detectPatterns(code) {
  return {
    hasRecursion: /def \w+\([^)]*\):[\s\S]*\1\(/.test(code),
    hasBaseCase: /if .* return /.test(code),
    hasLoopBreak: /for .* break|while .* break/.test(code)
  };
}
```

---

### Data Layer
**Located:** `src/data/`

#### Weapons (`weapons.js`)
```javascript
export const WEAPONS = [
  {
    id: "steel_blade",
    name: "Steel Blade",
    damage: 10,
    critChance: 0.05,
    rarity: "Common"
  },
  {
    id: "recursion_staff",
    name: "Recursion Staff",
    damage: 15,
    critChance: 0.10,
    special: "recursionBonus",
    rarity: "Rare"
  }
];
```

#### Classes (`classes.js`)
```javascript
export const CLASSES = {
  "Loop Knight": {
    baseHp: 120,
    baseDamage: 15,
    ultimate: "Rage Strike",
    passive: "Tanky"
  },
  "Recursion Mage": {
    baseHp: 80,
    baseDamage: 20,
    ultimate: "Fireball",
    passive: "Fast Charge"
  },
  "Async Assassin": {
    baseHp: 90,
    baseDamage: 25,
    ultimate: "Critical Storm",
    passive: "High Crit"
  }
};
```

#### Dungeon Levels (`dungeonLevels.js`)
```javascript
export const LEVELS = [
  {
    stage: 1,
    title: "The Loop Initiation",
    challenge: "Print numbers 1-10",
    expectedOutput: "1\n2\n3\n4\n5\n6\n7\n8\n9\n10",
    xpReward: 100
  }
];
```

---

## 📁 Project Structure

```
python-warriors/
│
├── public/                      # Static assets
│   └── vite.svg
│
├── src/
│   ├── assets/                  # Images, icons, particle effects
│   │   ├── dragon.png
│   │   ├── fireball.gif
│   │   └── particle.svg
│   │
│   ├── components/              # Reusable UI blocks
│   │   ├── CodeEditor.jsx       # Monaco/CodeMirror integration
│   │   ├── SkillTree.jsx        # Visual skill allocation
│   │   ├── Inventory.jsx        # Weapon/item management
│   │   ├── UltimateHotbar.jsx   # Ability casting UI
│   │   ├── QuestLog.jsx         # Mission tracking
│   │   ├── CombatLog.jsx        # Turn-by-turn history
│   │   └── HealthBar.jsx        # Animated HP display
│   │
│   ├── context/                 # Global state management
│   │   ├── PlayerContext.jsx    # Player data + methods
│   │   └── WorldContext.jsx     # (Future) World state
│   │
│   ├── data/                    # Game configuration
│   │   ├── weapons.js
│   │   ├── dungeonLevels.js
│   │   ├── enemies.js
│   │   ├── classes.js
│   │   ├── quests.js
│   │   └── worldNodes.js
│   │
│   ├── engine/                  # Core game logic
│   │   ├── pythonExecutor.js    # Pyodide wrapper
│   │   ├── combatEngine.js      # Damage calculation
│   │   ├── patternDetector.js   # Code analysis
│   │   └── ultimateSystem.js    # Ability logic
│   │
│   ├── pages/                   # Main game screens
│   │   ├── WarRoom.jsx          # Hub/prep screen
│   │   ├── BattleArena.jsx      # Boss fight UI
│   │   ├── DungeonRun.jsx       # Multi-stage mode
│   │   └── World.jsx            # Exploration map
│   │
│   ├── App.jsx                  # Root component + routing
│   ├── main.jsx                 # React entry point
│   └── index.css                # Global styles + Tailwind
│
├── tailwind.config.js           # UI framework config
├── vite.config.ts               # Build tool settings
├── package.json                 # Dependencies
├── README.md                    # This file
└── GAME_MANUAL.md               # Player-facing guide
```

---

## 🚀 Local Setup

### Prerequisites
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** 9+ (comes with Node)
- **Git** ([Download](https://git-scm.com/))

### Installation Steps

```bash
# 1. Clone the repository
git clone https://github.com/your-username/python-warriors.git
cd python-warriors

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open browser
# Navigate to http://localhost:5173
```

### First-Time Setup Notes
- **Pyodide Loading:** The first run downloads ~30MB of WebAssembly files (Python runtime). This is cached after the first load.
- **Build Time:** Initial `npm install` may take 2-3 minutes due to Vite and React dependencies.
- **Hot Reload:** Code changes automatically refresh the browser.

### Production Build
```bash
npm run build    # Creates optimized build in dist/
npm run preview  # Preview production build locally
```

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | React 18 | UI components + state |
| **Build Tool** | Vite 5 | Fast dev server + bundling |
| **Styling** | Tailwind CSS | Utility-first styling |
| **Python Runtime** | Pyodide | In-browser Python execution |
| **State Management** | Context API | Global player data |
| **Routing** | React Router | Page navigation |
| **Code Editor** | Monaco Editor | Syntax highlighting |
| **Animations** | Framer Motion | UI transitions |
| **Icons** | Lucide React | Icon library |

### Key Dependencies
```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.22.0",
    "pyodide": "^0.25.0",
    "@monaco-editor/react": "^4.6.0",
    "framer-motion": "^11.0.0",
    "lucide-react": "^0.344.0"
  }
}
```

---

## ✅ Completion Status

### 🟢 Completed (Production-Ready)

#### Core Systems
- ✅ **PlayerContext** — Full RPG state management
- ✅ **Python Execution Engine** — Pyodide integration
- ✅ **Pattern Detection** — Recursion, loops, base cases
- ✅ **Combat Engine** — Damage calculation, crits, healing
- ✅ **Ultimate System** — Fireball, Time Freeze, Mega Heal
- ✅ **Rage/Focus Meters** — Dynamic combat resources
- ✅ **XP & Leveling** — Progression system
- ✅ **Skill Tree** — Damage/Crit/Heal allocation
- ✅ **Class System** — 3 classes with unique bonuses
- ✅ **Inventory** — Weapon equipping and stats
- ✅ **Quest Backend** — Journal, active quest tracking
- ✅ **Stats Tracking** — Combat analytics
- ✅ **LocalStorage Persistence** — Save/load player data

#### UI/UX
- ✅ **War Room** — Full command center UI
- ✅ **Battle Arena** — Boss fight interface
- ✅ **Code Editor** — Syntax highlighting + execution
- ✅ **Skill Tree Visualization** — Interactive node graph
- ✅ **Inventory UI** — Weapon cards + equip system
- ✅ **Ultimate Hotbar** — Ability buttons with cooldowns
- ✅ **Health Bars** — Animated player/boss HP
- ✅ **Combat Log** — Turn history feed
- ✅ **Quest Log** — Mission tracking panel
- ✅ **Glassmorphism Theme** — Cyber-fantasy aesthetics

#### Game Modes
- ✅ **Battle Arena** — Function Dragon boss fight
- ✅ **Dungeon Run** — Multi-stage progression
- ✅ **War Room** — Hub for all systems

---

### 🟡 In Progress (Active Development)

#### World System
- ⚠️ **World Map UI** — Node visualization exists
- ⚠️ **Node Routing** — Travel logic needs finalization
- ⚠️ **Region System** — Sventeit/Geerteit/Gerle defined but not functional
- ⚠️ **Node Interaction** — Entry/exit logic pending

#### Polish
- 🔨 **Sound Effects** — Attack/heal/ultimate audio
- 🔨 **Background Music** — Ambient combat tracks
- 🔨 **Skill Animations** — Visual FX for abilities
- 🔨 **Tutorial System** — First-time user onboarding

---

### 🔴 Planned (Future Releases)

#### Story & Content
- 📅 **NPC Dialog System** — Text adventure interactions
- 📅 **Story Campaign** — Multi-chapter narrative
- 📅 **Voice Narration** — Cinematic storytelling
- 📅 **Multiple Bosses** — Recursion Titan, Loop Hydra, etc.
- 📅 **Boss Lore Pages** — Backstory unlocks

#### Progression
- 📅 **Save Slots** — Multiple character profiles
- 📅 **Prestige System** — Post-max-level bonuses
- 📅 **Legendary Weapons** — Unique effects
- 📅 **Skill Evolution Trees** — Advanced ability branches
- 📅 **Passive Skill Grid** — Expanded options

#### Multiplayer
- 📅 **Raid Boss Mode** — Co-op battles
- 📅 **Leaderboards** — Global rankings
- 📅 **Daily Challenges** — Rotating missions

#### Advanced Features
- 📅 **Procedural Dungeons** — Infinite runs
- 📅 **AI Mentor Agent** — In-game coding hints
- 📅 **Code Review System** — Feedback on solutions
- 📅 **Achievement System** — Badges + rewards

---

## 🧩 How To Extend The Game

### Adding a New Boss

**Step 1:** Define boss in `src/data/enemies.js`
```javascript
export const BOSSES = {
  recursion_titan: {
    name: "Recursion Titan",
    hp: 500,
    damage: 30,
    abilities: ["Stack Overflow", "Tail Call Optimize"],
    weakness: "Base Cases"
  }
};
```

**Step 2:** Update `src/pages/BattleArena.jsx`
```javascript
import { BOSSES } from '../data/enemies';

const [currentBoss, setCurrentBoss] = useState(BOSSES.recursion_titan);
```

---

### Adding a New Quest

**Step 1:** Define quest in `src/data/quests.js`
```javascript
export const QUESTS = {
  dragon_slayer: {
    id: "dragon_slayer",
    title: "Slay the Function Dragon",
    description: "Defeat the boss in Battle Arena",
    reward: { xp: 500, item: "dragon_scale" }
  }
};
```

**Step 2:** Add to PlayerContext
```javascript
const addQuest = (questId) => {
  setPlayerData(prev => ({
    ...prev,
    activeQuest: QUESTS[questId]
  }));
};
```

---

### Adding a New Ultimate

**Step 1:** Define ability in `src/engine/ultimateSystem.js`
```javascript
export const ULTIMATES = {
  lightning_strike: {
    name: "Lightning Strike",
    focusCost: 35,
    effect: (player, boss) => ({
      damage: player.baseDamage * 3,
      stun: true
    })
  }
};
```

**Step 2:** Add to PlayerContext ultimates object
```javascript
ultimates: {
  fireball: { unlocked: false, cooldown: 0 },
  timeFreeze: { unlocked: false, cooldown: 0 },
  megaHeal: { unlocked: false, cooldown: 0 },
  lightningStrike: { unlocked: false, cooldown: 0 } // New
}
```

**Step 3:** Update UI in `src/components/UltimateHotbar.jsx`
```jsx
<button onClick={() => castUltimate('lightningStrike')}>
  ⚡ Lightning Strike
</button>
```

---

### Adding a New World Zone

**Step 1:** Define zone in `src/data/worldNodes.js`
```javascript
export const ZONES = {
  silicon_valley: {
    name: "Silicon Valley",
    nodes: [
      { id: "sv_1", type: "combat", enemy: "Bug Swarm" },
      { id: "sv_2", type: "merchant", npc: "Code Vendor" }
    ]
  }
};
```

**Step 2:** Update `src/pages/World.jsx`
```javascript
import { ZONES } from '../data/worldNodes';

const renderZone = (zoneName) => {
  return ZONES[zoneName].nodes.map(node => (
    <NodeIcon key={node.id} {...node} />
  ));
};
```

---

## 🐛 Known Issues & Pitfalls

### Critical Issues
1. **World Map Routing** ⚠️
   - **Problem:** Node traversal logic incomplete
   - **Impact:** Cannot navigate between nodes
   - **Workaround:** Use Battle Arena directly
   - **Fix ETA:** Next sprint

2. **Pyodide Load Time** ⏱️
   - **Problem:** 5-10 second initial load on slow connections
   - **Impact:** Poor first-time UX
   - **Workaround:** Add loading screen with progress bar
   - **Fix ETA:** Implemented in v1.1

### Minor Issues
3. **Mobile Responsiveness**
   - Some UI elements clip on screens <768px
   - Workaround: Use desktop for now
   - Fix: Add responsive breakpoints

4. **Code Editor Autocomplete**
   - No Python-specific autocompletion
   - Workaround: Manual typing
   - Fix: Integrate Monaco Python language server

5. **Ultimate Cooldowns Persist**
   - Cooldowns don't reset between runs
   - Workaround: Refresh page
   - Fix: Reset on dungeon/battle exit

---

## 🧪 Testing

### Run Tests
```bash
npm test                  # Run all tests
npm test -- --watch      # Watch mode
npm test -- --coverage   # Coverage report
```

### Test Structure
```
src/
├── __tests__/
│   ├── PlayerContext.test.js
│   ├── pythonExecutor.test.js
│   ├── combatEngine.test.js
│   └── ultimateSystem.test.js
```

### Writing Tests
```javascript
import { renderHook } from '@testing-library/react';
import { usePlayer } from '../context/PlayerContext';

test('gainXP levels up player', () => {
  const { result } = renderHook(() => usePlayer());
  result.current.gainXP(5000);
  expect(result.current.playerData.level).toBe(2);
});
```

---

## 📖 Contributing Guidelines

### Safe Changes (Won't Break Anything)
✅ Adding new weapons to `src/data/weapons.js`  
✅ Adding new quests to `src/data/quests.js`  
✅ Tweaking damage numbers in `src/engine/combatEngine.js`  
✅ Adding CSS animations to `src/index.css`  
✅ Creating new boss definitions in `src/data/enemies.js`

### Risky Changes (Test Thoroughly)
⚠️ Modifying PlayerContext methods  
⚠️ Changing Python execution logic  
⚠️ Altering combat calculation formulas  
⚠️ Refactoring component state management

### Forbidden Changes (Will Break Game)
🚫 Removing PlayerContext keys  
🚫 Changing localStorage schema without migration  
🚫 Modifying Pyodide initialization  
🚫 Deleting existing boss definitions

### Pull Request Checklist
- [ ] Tested locally with `npm run dev`
- [ ] No console errors
- [ ] Player data persists correctly
- [ ] Code follows existing patterns
- [ ] Comments added for complex logic

---

## 🎯 Roadmap

### Version 1.0 (Current)
- [x] Core combat system
- [x] Skill tree
- [x] Ultimate abilities
- [x] Battle Arena
- [x] Dungeon Run
- [ ] World Map (95% complete)

### Version 1.1 (Next)
- [ ] Complete World Map traversal
- [ ] Sound effects
- [ ] Tutorial system
- [ ] 3 additional bosses
- [ ] Achievement system

### Version 1.2
- [ ] NPC dialog system
- [ ] Story campaign (Chapter 1)
- [ ] Save slots
- [ ] Leaderboards

### Version 2.0 (Vision)
- [ ] Multiplayer raid boss
- [ ] Procedural dungeons
- [ ] AI mentor agent
- [ ] Voice narration
- [ ] Mobile app release

---

## 🌟 Design Philosophy

### Code as Combat
> "Your code quality directly impacts your survival. Elegant solutions are more powerful than brute force."

### Pattern Mastery
> "The game teaches advanced patterns naturally. Players learn recursion to unlock Fireball, not because a textbook told them to."

### Cinematic Experience
> "This is a Souls-like RPG that happens to teach programming, not a tutorial with a game wrapper."

### Respect Player Intelligence
> "No hand-holding. No 'type this exactly.' Real code, real execution, real consequences."

---

## 📜 Lore (In-Game)

### The Function Dragon
*"Born from infinite loops and stack overflows, the Function Dragon guards the Core Loop—the source code of reality itself. Legends say it was once a benevolent algorithm, but corruption from buggy code transformed it into a chaotic beast. Only a warrior who masters the Three Patterns (Recursion, Iteration, and Base Cases) can hope to defeat it."*

### The Loop Knight Prophecy
*"When the Compiler runs cold and the Stack grows deep, a coder shall rise who breaks not loops, but limits. They shall wield the sacred `return`, command the forbidden `break`, and in the final recursion, they shall find… the base case of salvation."*

---

## 🙏 Credits

### Development Team
- **Lead Developer:** [Your Name]
- **Game Design:** [Designer Name]
- **UI/UX:** [Designer Name]
- **Sound Design:** [Audio Engineer]

### Special Thanks
- **Pyodide Team** — Python in the browser
- **React Community** — UI framework
- **Vite Team** — Build tooling
- **Anthropic Claude** — Documentation assistance

### Open Source Libraries
- React (MIT License)
- Tailwind CSS (MIT License)
- Pyodide (Mozilla Public License)
- Monaco Editor (MIT License)
- Framer Motion (MIT License)

---

## 📧 Contact & Support

- **GitHub Issues:** [Report bugs](https://github.com/your-repo/issues)
- **Discord:** [Join community](https://discord.gg/your-server)
- **Email:** support@pythonwarriors.dev
- **Twitter:** [@PythonWarriors](https://twitter.com/pythonwarriors)

---

## 📄 License

This project is licensed under the **MIT License** — see [LICENSE.md](LICENSE.md) for details.

```
MIT License

Copyright (c) 2024 Python Warriors Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🔮 Vision Statement

**Python Warriors** aims to become the first full-scale **Programming Souls-like RPG**—a game where learning algorithms feels like slaying dragons, where debugging is a matter of life and death, and where every programmer can experience the thrill of turning code into combat.

We believe that:
- Programming education should be **epic**, not boring
- Code quality should have **tangible rewards**
- Mastery should feel like **power**, not just knowledge
- Games can teach **without compromising on fun**

Welcome, Loop Knight. Your stack frames await.

---

**[⬆ Back to Top](#-python-warriors--agentic-coding-rpg)**

---

*Last Updated: February 4, 2026*  
*Version: 1.0.0 (Loop Knight Edition)*  
*Status: Production-Ready Core | World Map in Final Testing*
