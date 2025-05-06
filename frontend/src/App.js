import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ArticleListPage from './pages/ArticleListPage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import CategoryPage from './pages/CategoryPage';
import NotFoundPage from './pages/NotFoundPage';
import './App.css';

/**
 * Main application component.
 * Sets up routing and the main layout.
 */
function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main className="app-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/articles" element={<ArticleListPage />} />
            <Route path="/articles/:id" element={<ArticleDetailPage />} />
            <Route path="/categories/:id" element={<CategoryPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

