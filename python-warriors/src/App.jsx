import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { PlayerProvider } from './context/PlayerContext';
import { SoundProvider } from './context/SoundContext';
import WarBackground from './components/layout/WarBackground';
import Home from './pages/Home';
import WarRoom from './pages/WarRoom';
import BattleArena from './pages/BattleArena';
import Dungeon from './pages/Dungeon';
import Rankings from './pages/Rankings';
import Academy from './pages/Academy';

import World from './pages/World';

function App() {
  return (
    <ThemeProvider>
      <SoundProvider>
        <PlayerProvider>
          <BrowserRouter>
            <WarBackground />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/war-room" element={<WarRoom />} />
              <Route path="/battle-arena" element={<BattleArena />} />
              <Route path="/dungeon" element={<Dungeon />} />
              <Route path="/world" element={<World />} />
              <Route path="/academy" element={<Academy />} />
              <Route path="/rankings" element={<Rankings />} />
            </Routes>
          </BrowserRouter>
        </PlayerProvider>
      </SoundProvider>
    </ThemeProvider>
  );
}

export default App;
