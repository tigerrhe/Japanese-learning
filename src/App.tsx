import { HashRouter, Route, Routes } from 'react-router-dom'
import { NavBar } from './components/NavBar'
import { LevelProvider } from './engine/LevelContext'
import { Dashboard } from './pages/Dashboard'
import { Keigo } from './pages/Keigo'
import { LessonDetail } from './pages/LessonDetail'
import { LessonList } from './pages/LessonList'
import { ParticleDrill } from './pages/ParticleDrill'
import { StarMap } from './pages/StarMap'

function App() {
  return (
    <LevelProvider>
      <HashRouter>
        <div className="min-h-screen bg-slate-950 text-slate-100">
          <NavBar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/starmap" element={<StarMap />} />
            <Route path="/particles" element={<ParticleDrill />} />
            <Route path="/keigo" element={<Keigo />} />
            <Route path="/textbook" element={<LessonList />} />
            <Route path="/textbook/:number" element={<LessonDetail />} />
          </Routes>
        </div>
      </HashRouter>
    </LevelProvider>
  )
}

export default App
