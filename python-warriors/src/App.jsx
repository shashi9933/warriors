import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { PlayerProvider } from './context/PlayerContext';
import { SoundProvider } from './context/SoundContext';
import WarBackground from './components/layout/WarBackground';

// Legacy / Internal Pages
import WarRoom from './pages/WarRoom';
import Dungeon from './pages/Dungeon';
import BossBattle from './pages/arena/BossBattle';
import LogicWars from './pages/arena/LogicWars';
import Onboarding from './pages/Onboarding';

// New Modular Structure
import Nexus from './pages/Nexus';          // 1. HQ
import Directives from './pages/Directives';// 2. Missions
import Arena from './pages/Arena';          // 3. Challenges
import Leaderboard from './pages/Leaderboard';// 4. Rank
import Honors from './pages/Honors';        // 5. Badges
import Academy from './pages/Academy';      // 6. Training
import Archives from './pages/Archives';    // 7. Codex
import Operations from './pages/Operations';// 8. Case Files
import World from './pages/World';          // 9. Map
import Terminal from './pages/Terminal';    // 10. Console

function App() {
  return (
    <ThemeProvider>
      <SoundProvider>
        <PlayerProvider>
          <BrowserRouter>
            <WarBackground />
            <Routes>
              {/* Gameplay Layer */}
              <Route path="/" element={<Nexus />} />
              <Route path="/directives" element={<Directives />} />
              <Route path="/arena" element={<Arena />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/honors" element={<Honors />} />

              {/* Learning Layer */}
              <Route path="/academy" element={<Academy />} />
              <Route path="/archives" element={<Archives />} />
              <Route path="/operations" element={<Operations />} />
              <Route path="/world" element={<World />} />

              {/* System Layer */}
              <Route path="/terminal" element={<Terminal />} />

              {/* Sub-Pages & Legacy Routes */}
              <Route path="/war-room" element={<WarRoom />} /> {/* Kept for internal access if needed */}
              <Route path="/battle-arena" element={<Arena />} /> {/* Redirect/Alias */}
              <Route path="/arena/boss" element={<BossBattle />} />
              <Route path="/arena/mcq" element={<LogicWars />} />
              <Route path="/dungeon" element={<Dungeon />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/rankings" element={<Leaderboard />} /> {/* Redirect/Alias */}
            </Routes>
          </BrowserRouter>
        </PlayerProvider>
      </SoundProvider>
    </ThemeProvider>
  );
}

export default App;
