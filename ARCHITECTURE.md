# 🏗️ Python Warriors — Technical Architecture
## Developer Deep Dive

---

## Overview

This document provides **in-depth technical specifications** for the Python Warriors codebase, including:
- Architecture patterns
- Component APIs
- State management flow
- Engine implementation details
- Performance considerations
- Testing strategies

**Audience:** Intermediate to advanced developers contributing to the project.

---

## Table of Contents

1. [System Architecture](#system-architecture)
2. [State Management](#state-management)
3. [Component Architecture](#component-architecture)
4. [Python Execution Engine](#python-execution-engine)
5. [Combat Engine](#combat-engine)
6. [Pattern Detection System](#pattern-detection-system)
7. [Data Flow](#data-flow)
8. [Performance Optimization](#performance-optimization)
9. [Testing Strategy](#testing-strategy)
10. [Common Pitfalls](#common-pitfalls)

---

## System Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────┐
│                     React App                        │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐   │
│  │  War Room  │  │  Battle    │  │  Dungeon   │   │
│  │   (Hub)    │  │   Arena    │  │    Run     │   │
│  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘   │
│        │                │                │           │
│        └────────────────┼────────────────┘           │
│                         │                            │
│                 ┌───────▼───────┐                   │
│                 │ PlayerContext │                   │
│                 │  (Redux-like) │                   │
│                 └───────┬───────┘                   │
│                         │                            │
│         ┌───────────────┼───────────────┐           │
│         │               │               │           │
│   ┌─────▼────┐   ┌─────▼────┐   ┌─────▼────┐     │
│   │  Python  │   │  Combat  │   │  Pattern │     │
│   │  Engine  │   │  Engine  │   │ Detector │     │
│   └──────────┘   └──────────┘   └──────────┘     │
│         │               │               │           │
│         └───────────────┼───────────────┘           │
│                         │                            │
│                   ┌─────▼─────┐                     │
│                   │   Pyodide │                     │
│                   │ (WASM VM) │                     │
│                   └───────────┘                     │
└─────────────────────────────────────────────────────┘
```

### Technology Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Frontend Framework** | React | 18.3.1 | Component architecture |
| **Build Tool** | Vite | 5.x | Fast HMR, ESM-based bundling |
| **Styling** | Tailwind CSS | 3.x | Utility-first CSS |
| **State Management** | Context API | Built-in | Global player state |
| **Python Runtime** | Pyodide | 0.25.0 | WebAssembly Python interpreter |
| **Code Editor** | Monaco Editor | 4.6.0 | Syntax highlighting |
| **Animations** | Framer Motion | 11.x | UI transitions |
| **Routing** | React Router | 6.x | SPA navigation |

---

## State Management

### PlayerContext API

**Location:** `src/context/PlayerContext.jsx`

**Pattern:** Redux-like Context + Reducer

#### State Schema

```typescript
interface PlayerState {
  // Identity
  level: number;
  xp: number;
  classType: "Loop Knight" | "Recursion Mage" | "Async Assassin";
  
  // Resources
  hp: number;
  maxHp: number;
  skillPoints: number;
  
  // Skills (0-10 each)
  damageSkill: number;
  critSkill: number;
  healSkill: number;
  
  // Combat Meters
  rage: number;      // 0-100
  focus: number;     // 0-100
  
  // Ultimates
  ultimates: {
    [key: string]: {
      unlocked: boolean;
      cooldown: number;  // 0 = ready
    };
  };
  
  // Inventory
  inventory: Weapon[];
  equippedWeapon: Weapon | null;
  
  // Quests
  questsCompleted: string[];
  activeQuest: Quest | null;
  
  // Analytics
  stats: {
    totalDamage: number;
    bossesDefeated: number;
    recursionsDetected: number;
    loopsDetected: number;
    totalHealing: number;
    deaths: number;
  };
}
```

#### Core Actions

```javascript
// Progression
gainXP(amount: number): void
levelUp(): void
spendSkillPoint(skill: "damage" | "crit" | "heal"): void

// Combat
takeDamage(amount: number): void
heal(amount: number): void
buildRage(amount: number): void
buildFocus(amount: number): void
resetMeters(): void

// Ultimates
unlockUltimate(name: string): void
castUltimate(name: string): boolean
decrementCooldowns(): void

// Inventory
addItem(weapon: Weapon): void
equipWeapon(weaponId: string): void
unequipWeapon(): void

// Quests
startQuest(questId: string): void
completeQuest(questId: string): void
abandonQuest(): void

// Persistence
saveGame(): void
loadGame(): void
```

#### Example Usage

```jsx
import { usePlayer } from '../context/PlayerContext';

function WarRoom() {
  const { playerData, gainXP, spendSkillPoint } = usePlayer();
  
  const handleLevelUp = () => {
    if (playerData.xp >= 5000) {
      gainXP(-5000);  // Spend XP
      spendSkillPoint('damage');
    }
  };
  
  return (
    <div>
      <p>Level: {playerData.level}</p>
      <p>XP: {playerData.xp} / 5000</p>
      <button onClick={handleLevelUp}>Level Up</button>
    </div>
  );
}
```

---

### LocalStorage Persistence

**Schema:**
```javascript
{
  "pythonWarriors_playerData": {
    version: "1.0.0",
    timestamp: 1706918400000,
    data: PlayerState
  }
}
```

**Automatic Save Triggers:**
- Every 5 seconds (debounced)
- On XP gain
- On quest completion
- On weapon equip
- On page unload

**Migration Strategy:**
```javascript
function migratePlayerData(savedData) {
  const version = savedData.version;
  
  if (version === "0.9.0") {
    // Add new ultimates field
    savedData.data.ultimates = {
      fireball: { unlocked: false, cooldown: 0 },
      timeFreeze: { unlocked: false, cooldown: 0 },
      megaHeal: { unlocked: false, cooldown: 0 }
    };
  }
  
  return savedData;
}
```

---

## Component Architecture

### Component Hierarchy

```
App.jsx
├── Header
│   ├── Navigation
│   └── UserProfile
├── WarRoom
│   ├── TabNavigation
│   ├── SkillTree
│   ├── Inventory
│   ├── UltimatePanel
│   └── QuestLog
├── BattleArena
│   ├── BossDisplay
│   ├── CodeEditor
│   ├── CombatLog
│   ├── HealthBars
│   ├── MeterDisplay (Rage/Focus)
│   └── UltimateHotbar
└── DungeonRun
    ├── StageProgress
    ├── CodeEditor
    └── RewardDisplay
```

---

### Key Component APIs

#### CodeEditor Component

**Location:** `src/components/CodeEditor.jsx`

**Props:**
```typescript
interface CodeEditorProps {
  initialCode?: string;
  onExecute: (code: string, result: ExecutionResult) => void;
  language?: "python" | "javascript";
  theme?: "vs-dark" | "vs-light";
  readOnly?: boolean;
}
```

**Features:**
- Monaco Editor integration
- Syntax highlighting
- Autocomplete
- Error highlighting
- Execute button with `Ctrl+Enter` shortcut

**Example:**
```jsx
<CodeEditor
  initialCode="def add(a, b):\n    return a + b"
  onExecute={handleCodeExecution}
  language="python"
  theme="vs-dark"
/>
```

---

#### SkillTree Component

**Location:** `src/components/SkillTree.jsx`

**Props:**
```typescript
interface SkillTreeProps {
  currentSkills: {
    damage: number;
    crit: number;
    heal: number;
  };
  availablePoints: number;
  onAllocate: (skill: string) => void;
}
```

**Visual Layout:**
```
    ┌─────────┐
    │ DAMAGE  │
    │  [+5]   │
    └────┬────┘
         │
    ┌────┼────┐
    │         │
┌───▼───┐ ┌──▼────┐
│ CRIT  │ │ HEAL  │
│  [+3] │ │  [+2] │
└───────┘ └───────┘
```

---

#### UltimateHotbar Component

**Location:** `src/components/UltimateHotbar.jsx`

**Props:**
```typescript
interface UltimateHotbarProps {
  ultimates: {
    [key: string]: {
      unlocked: boolean;
      cooldown: number;
    };
  };
  focus: number;
  onCast: (ultimateName: string) => void;
}
```

**Render Logic:**
```jsx
{Object.entries(ultimates).map(([name, data]) => (
  <button
    key={name}
    disabled={!data.unlocked || data.cooldown > 0 || focus < COSTS[name]}
    onClick={() => onCast(name)}
    className={getButtonClass(name, data, focus)}
  >
    {ICONS[name]} {name}
    {data.cooldown > 0 && <span>({data.cooldown})</span>}
  </button>
))}
```

---

## Python Execution Engine

### Pyodide Integration

**Location:** `src/engine/pythonExecutor.js`

**Initialization:**
```javascript
import { loadPyodide } from "pyodide";

let pyodideInstance = null;

async function initPyodide() {
  if (!pyodideInstance) {
    pyodideInstance = await loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/"
    });
  }
  return pyodideInstance;
}
```

**Execution Function:**
```javascript
export async function executePython(code) {
  try {
    const pyodide = await initPyodide();
    
    // Capture stdout
    pyodide.runPython(`
      import sys
      from io import StringIO
      sys.stdout = StringIO()
    `);
    
    // Run user code
    pyodide.runPython(code);
    
    // Get output
    const output = pyodide.runPython(`
      sys.stdout.getvalue()
    `);
    
    return {
      success: true,
      output: output.trim(),
      error: null
    };
  } catch (error) {
    return {
      success: false,
      output: "",
      error: error.message
    };
  }
}
```

### Security Considerations

**Sandbox Limitations:**
- ✅ No file system access
- ✅ No network requests
- ✅ No subprocess execution
- ✅ Limited to Web APIs

**Additional Safeguards:**
```javascript
// Timeout execution after 5 seconds
const EXECUTION_TIMEOUT = 5000;

function executeWithTimeout(code) {
  return Promise.race([
    executePython(code),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), EXECUTION_TIMEOUT)
    )
  ]);
}
```

---

## Combat Engine

### Damage Calculation

**Location:** `src/engine/combatEngine.js`

**Formula:**
```javascript
export function calculateDamage(player, boss, codeResult) {
  const baseDamage = 10 + (player.damageSkill * 2);
  const weaponBonus = player.equippedWeapon?.damage || 0;
  const rageMultiplier = 1 + (player.rage * 0.01);
  
  // Crit calculation
  const critChance = 0.1 + (player.critSkill * 0.05);
  const isCrit = Math.random() < critChance;
  const critMultiplier = isCrit ? 2 : 1;
  
  // Pattern bonuses
  const patternBonus = codeResult.patterns.hasRecursion ? 1.2 : 1;
  
  const finalDamage = 
    (baseDamage + weaponBonus) * 
    rageMultiplier * 
    critMultiplier * 
    patternBonus;
  
  return {
    damage: Math.floor(finalDamage),
    isCrit,
    details: {
      baseDamage,
      weaponBonus,
      rageMultiplier,
      critMultiplier,
      patternBonus
    }
  };
}
```

### Healing Calculation

```javascript
export function calculateHealing(player) {
  const baseHeal = 20;
  const healSkillBonus = player.healSkill * 0.1; // +10% per point
  const focusBonus = player.focus > 50 ? 1.2 : 1;
  
  const finalHeal = baseHeal * (1 + healSkillBonus) * focusBonus;
  
  return Math.floor(finalHeal);
}
```

### Boss AI

**Phase-Based Logic:**
```javascript
export function getBossAction(boss, player) {
  const phase = getBossPhase(boss);
  
  switch (phase) {
    case 1:  // 100-70% HP
      return {
        action: "attack",
        damage: 5,
        message: "The dragon swipes its claw!"
      };
      
    case 2:  // 70-40% HP
      return {
        action: "enrage",
        damage: 10,
        message: "The dragon enters a rage!"
      };
      
    case 3:  // 40-0% HP
      return {
        action: "ultimate",
        damage: 15,
        message: "The dragon unleashes hellfire!"
      };
  }
}

function getBossPhase(boss) {
  const hpPercent = (boss.hp / boss.maxHp) * 100;
  if (hpPercent > 70) return 1;
  if (hpPercent > 40) return 2;
  return 3;
}
```

---

## Pattern Detection System

### Regex-Based Detection

**Location:** `src/engine/patternDetector.js`

**Implementation:**
```javascript
export function detectPatterns(code) {
  return {
    hasRecursion: detectRecursion(code),
    hasBaseCase: detectBaseCase(code),
    hasLoopBreak: detectLoopBreak(code),
    hasAsyncAwait: detectAsync(code)
  };
}

function detectRecursion(code) {
  // Match: function name appears inside its own definition
  const functionPattern = /def\s+(\w+)\s*\([^)]*\):/g;
  const matches = [...code.matchAll(functionPattern)];
  
  for (const match of matches) {
    const funcName = match[1];
    const funcBody = code.substring(match.index);
    const callPattern = new RegExp(`\\b${funcName}\\s*\\(`, 'g');
    
    if (funcBody.match(callPattern)?.length > 1) {
      return true;
    }
  }
  
  return false;
}

function detectBaseCase(code) {
  // Match: if statement with return inside function
  return /if\s+.*:\s*return/.test(code);
}

function detectLoopBreak(code) {
  // Match: for/while loop with break
  return /(for|while)\s+.*:\s*.*break/.test(code);
}
```

### Advanced Pattern Detection

**AST-Based Detection (Future):**
```javascript
import { parse } from '@babel/parser';

export function detectPatternsAST(code) {
  try {
    const ast = parse(code, {
      sourceType: 'module',
      plugins: ['python']
    });
    
    // Walk AST to detect patterns
    // More accurate than regex
  } catch {
    // Fallback to regex
    return detectPatterns(code);
  }
}
```

---

## Data Flow

### Execution Flow Diagram

```
┌──────────────────────────────────────────────────┐
│ 1. User writes code in CodeEditor                │
│    "def add(a, b): return a + b\nprint(add(2,3))"│
└────────────────┬─────────────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────────┐
│ 2. User clicks EXECUTE_SPELL()                 │
│    → onExecute(code) callback fires            │
└────────────────┬───────────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────────┐
│ 3. BattleArena.jsx calls executePython(code)   │
│    → Pyodide runs code                         │
│    → Returns { output: "5", success: true }    │
└────────────────┬───────────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────────┐
│ 4. Validate output against expected result     │
│    Expected: "5"                               │
│    Actual: "5"                                 │
│    Result: CORRECT                             │
└────────────────┬───────────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────────┐
│ 5. Detect patterns in code                     │
│    → detectPatterns(code)                      │
│    → Returns { hasRecursion: false, ... }      │
└────────────────┬───────────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────────┐
│ 6. Calculate damage                            │
│    → calculateDamage(player, boss, result)     │
│    → Returns { damage: 39, isCrit: false }     │
└────────────────┬───────────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────────┐
│ 7. Update PlayerContext state                  │
│    → buildFocus(5)                             │
│    → heal(20)                                  │
└────────────────┬───────────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────────┐
│ 8. Update boss HP                              │
│    → boss.hp -= 39                             │
│    → Check if boss defeated                    │
└────────────────┬───────────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────────┐
│ 9. Boss turn (if alive)                        │
│    → getBossAction(boss, player)               │
│    → player.takeDamage(10)                     │
└────────────────┬───────────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────────┐
│ 10. Render UI updates                          │
│     → HP bars animate                          │
│     → Combat log updates                       │
│     → Focus meter fills                        │
└────────────────────────────────────────────────┘
```

---

## Performance Optimization

### Pyodide Loading

**Problem:** 30MB WASM download on first load.

**Solution:** Lazy loading + caching
```javascript
let pyodidePromise = null;

export function getPyodide() {
  if (!pyodidePromise) {
    pyodidePromise = loadPyodide({ indexURL: CDN_URL });
  }
  return pyodidePromise;
}
```

**Service Worker Caching (Future):**
```javascript
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('pyodide-v1').then((cache) => {
      return cache.addAll([
        'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js',
        'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.asm.wasm'
      ]);
    })
  );
});
```

---

### React Performance

**Memoization:**
```jsx
import { memo, useMemo } from 'react';

const SkillTree = memo(({ skills, onAllocate }) => {
  const skillNodes = useMemo(() => {
    return generateSkillNodes(skills);
  }, [skills]);
  
  return <div>{skillNodes}</div>;
});
```

**Virtualization for Large Lists:**
```jsx
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={inventory.length}
  itemSize={100}
>
  {({ index, style }) => (
    <WeaponCard weapon={inventory[index]} style={style} />
  )}
</FixedSizeList>
```

---

## Testing Strategy

### Unit Tests

**PlayerContext Tests:**
```javascript
import { renderHook, act } from '@testing-library/react';
import { usePlayer } from '../context/PlayerContext';

describe('PlayerContext', () => {
  test('gainXP increases XP', () => {
    const { result } = renderHook(() => usePlayer());
    
    act(() => {
      result.current.gainXP(1000);
    });
    
    expect(result.current.playerData.xp).toBe(1000);
  });
  
  test('spendSkillPoint increases skill', () => {
    const { result } = renderHook(() => usePlayer());
    
    // Setup: give player skill points
    act(() => {
      result.current.levelUp();
    });
    
    act(() => {
      result.current.spendSkillPoint('damage');
    });
    
    expect(result.current.playerData.damageSkill).toBe(1);
    expect(result.current.playerData.skillPoints).toBe(0);
  });
});
```

**Combat Engine Tests:**
```javascript
import { calculateDamage } from '../engine/combatEngine';

describe('Combat Engine', () => {
  test('calculates base damage correctly', () => {
    const player = {
      damageSkill: 5,
      rage: 0,
      critSkill: 0,
      equippedWeapon: null
    };
    
    const result = calculateDamage(player, {}, { patterns: {} });
    
    expect(result.damage).toBe(20); // 10 + (5*2)
  });
  
  test('applies crit multiplier', () => {
    const player = {
      damageSkill: 0,
      rage: 0,
      critSkill: 10, // 100% crit
      equippedWeapon: null
    };
    
    const result = calculateDamage(player, {}, { patterns: {} });
    
    expect(result.damage).toBe(20); // 10 * 2 (crit)
    expect(result.isCrit).toBe(true);
  });
});
```

---

### Integration Tests

**BattleArena Flow:**
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import BattleArena from '../pages/BattleArena';

describe('BattleArena', () => {
  test('correct code deals damage', async () => {
    render(<BattleArena />);
    
    const editor = screen.getByRole('textbox');
    fireEvent.change(editor, {
      target: { value: 'print(5)' }
    });
    
    const executeButton = screen.getByText('EXECUTE_SPELL()');
    fireEvent.click(executeButton);
    
    await screen.findByText(/Dealt \d+ damage!/);
    
    const bossHp = screen.getByTestId('boss-hp');
    expect(bossHp.textContent).not.toBe('100');
  });
});
```

---

## Common Pitfalls

### 1. Pyodide Not Initialized

**Problem:**
```javascript
// This will fail!
const result = await pyodideInstance.runPython(code);
```

**Solution:**
```javascript
const pyodide = await getPyodide();
const result = await pyodide.runPython(code);
```

---

### 2. State Mutation

**Problem:**
```javascript
// This mutates state directly!
playerData.xp += 100;
```

**Solution:**
```javascript
setPlayerData(prev => ({
  ...prev,
  xp: prev.xp + 100
}));
```

---

### 3. Forgetting to Save

**Problem:** User loses progress on page refresh.

**Solution:**
```javascript
useEffect(() => {
  const saveInterval = setInterval(() => {
    localStorage.setItem('playerData', JSON.stringify(playerData));
  }, 5000);
  
  return () => clearInterval(saveInterval);
}, [playerData]);
```

---

### 4. Pattern Detection Edge Cases

**Problem:**
```python
# This is NOT recursion, but regex thinks it is
def factorial(n):
    print("factorial(5)")  # String contains function name
    return 1
```

**Solution:** Use AST-based detection (see [Pattern Detection System](#pattern-detection-system)).

---

## Conclusion

This architecture document should give you a comprehensive understanding of Python Warriors' technical implementation. For specific implementation details, refer to the source code files mentioned throughout this document.

**Next Steps:**
1. Set up local development environment
2. Read through key files in `src/`
3. Run tests with `npm test`
4. Try making a small change (e.g., add a new weapon)
5. Submit a pull request!

For questions, see the main [README.md](README.md) or open a GitHub issue.

---

*Last Updated: February 4, 2026*  
*Version: 1.0.0 — Loop Knight Edition*
