import { LazyMotion, MotionConfig, domAnimation } from 'framer-motion';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { StarField } from './components/effects/StarField';
import { Home } from './components/pages/Home';
import { VolumeSelector } from './components/pages/VolumeSelector';
import { ChapterReader } from './components/pages/ChapterReader';
import { CharacterBook } from './components/pages/CharacterBook';
import { WorldView } from './components/pages/WorldView';
import { Timeline } from './components/pages/Timeline';

function App() {
  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion="user">
        <BrowserRouter>
          <StarField />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/volumes" element={<VolumeSelector />} />
            <Route path="/read/:volumeIndex/:chapterIndex" element={<ChapterReader />} />
            <Route path="/characters" element={<CharacterBook />} />
            <Route path="/world" element={<WorldView />} />
            <Route path="/timeline" element={<Timeline />} />
          </Routes>
        </BrowserRouter>
      </MotionConfig>
    </LazyMotion>
  );
}

export default App;
