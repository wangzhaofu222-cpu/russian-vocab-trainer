import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import WordListPage from './pages/WordListPage';
import StudyPage from './pages/StudyPage';
import MistakesPage from './pages/MistakesPage';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/words" element={<WordListPage />} />
        <Route path="/study" element={<StudyPage />} />
        <Route path="/mistakes" element={<MistakesPage />} />
      </Routes>
    </Layout>
  );
}
