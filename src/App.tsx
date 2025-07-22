import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GameProvider } from '@/contexts/GameContext';
import { GamePage } from '@/pages/GamePage';
import { SettingsPage } from '@/pages/SettingsPage';
import { Layout } from '@/components/Layout';

function App() {
  return (
    <Router>
      <GameProvider>
        <div className="app">
          <Routes>
            <Route path="/" element={
              <Layout>
                <GamePage />
              </Layout>
            } />
            <Route path="/settings" element={
              <Layout>
                <SettingsPage />
              </Layout>
            } />
          </Routes>
        </div>
      </GameProvider>
    </Router>
  );
}

export default App;