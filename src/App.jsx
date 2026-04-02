import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import PublicOnlyRoute from './components/PublicOnlyRoute';
import HomePage from './pages/HomePage';
import WordListPage from './pages/WordListPage';
import StudyPage from './pages/StudyPage';
import MistakesPage from './pages/MistakesPage';
import StatsPage from './pages/StatsPage';
import LoginPage from './pages/LoginPage';

export default function App() {
  return (
    <Routes>
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/words" element={<WordListPage />} />
        <Route path="/study" element={<StudyPage />} />
        <Route path="/mistakes" element={<MistakesPage />} />
        <Route path="/stats" element={<StatsPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
