import { Routes, Route } from 'react-router'
import { IndexPage } from './pages/IndexPage'
import { ReparaturanfragePage } from './pages/ReparaturanfragePage'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<IndexPage />} />
      <Route path="/reparaturanfragen" element={<ReparaturanfragePage />} />
    </Routes>
  )
}

export default App
