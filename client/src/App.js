import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthPage } from './pages/AuthPage';
import { BooksPage } from './pages/BooksPage';
import { ShelvesPage } from './pages/ShelvesPage';
import { ShelfDetailPage } from './pages/ShelfDetailPage';
import { PublicShelvesPage } from './pages/PublicShelvesPage';
import { CustomNavbar } from './components/Navbar';
import { Container } from 'react-bootstrap';
import { useAuth } from './components/AuthContext';

function App() {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    console.log('Authenticated:', isAuthenticated);
  }, [isAuthenticated]);

  return (
    <BrowserRouter>
      {isAuthenticated && <CustomNavbar />} {/* Показываем Navbar только для авторизованных пользователей */}
      <Container className="mt-4">
        <Routes>
          {/* Главная страница */}
          <Route path="/" element={isAuthenticated ? <Navigate to="/books" /> : <Navigate to="/login" />} />

          {/* Страница входа */}
          <Route path="/login" element={isAuthenticated ? <Navigate to="/books" /> : <AuthPage />} />

          {/* Страница регистрации */}
          <Route path="/register" element={isAuthenticated ? <Navigate to="/books" /> : <AuthPage isRegister />} />

          {/* Страницы для авторизованных пользователей */}
          {isAuthenticated ? (
            <>
              <Route path="/books" element={<BooksPage />} />
              <Route path="/shelves" element={<ShelvesPage />} />
              <Route path="/shelves/:id" element={<ShelfDetailPage />} />
              <Route path="/public-shelves" element={<PublicShelvesPage />} />
            </>
          ) : (
            <Route path="*" element={<Navigate to="/login" />} />
          )}
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;

