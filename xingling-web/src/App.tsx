import { LazyMotion, MotionConfig, domAnimation } from 'framer-motion';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { StarField } from './components/effects/StarField';
import { AuroraBackground } from './components/effects/AuroraBackground';
import { ClickSpark } from './components/ui/ClickSpark';
import { AudioController } from './components/ui/AudioController';
import { Home } from './components/pages/Home';
import { VolumeSelector } from './components/pages/VolumeSelector';
import { ChapterReader } from './components/pages/ChapterReader';
import { CharacterBook } from './components/pages/CharacterBook';
import { WorldView } from './components/pages/WorldView';
import { Timeline } from './components/pages/Timeline';
import { OtherworldOverview } from './components/pages/OtherworldOverview';
import { OtherworldReader } from './components/pages/OtherworldReader';

function App() {
  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion="user">
        <BrowserRouter>
          <AuroraBackground />
          <StarField />
          <ClickSpark sparkColor="#a78bfa" sparkCount={9} sparkRadius={28} />
          <AudioController />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/volumes" element={<VolumeSelector />} />
            <Route path="/read/:volumeIndex/:chapterIndex" element={<ChapterReader />} />
            <Route path="/characters" element={<CharacterBook />} />
            <Route path="/world" element={<WorldView />} />
            <Route path="/timeline" element={<Timeline />} />
            <Route path="/otherworld" element={<OtherworldOverview />} />
            <Route path="/otherworld/read/:chapterIndex" element={<OtherworldReader />} />
          </Routes>
        </BrowserRouter>
      </MotionConfig>
    </LazyMotion>
  );
}

export default App;
