import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import QuizPage from './pages/QuizPage';

function Navigation() {
  const location = useLocation();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              한국 지리 데이터 시각화
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              다양한 베이스 맵으로 데이터를 시각화하세요
            </p>
          </div>
          <nav className="flex gap-4">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                location.pathname === '/'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              시각화
            </Link>
            <Link
              to="/quiz"
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                location.pathname === '/quiz'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              퀴즈
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

function AppContent() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/quiz" element={<QuizPage />} />
      </Routes>
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-gray-600">
          <p>
            데이터 출처:{' '}
            <a
              href="https://github.com/cubensys/Korea_District"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Korea_District
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
