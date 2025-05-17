import React from 'react';
import { Navbar as BootstrapNavbar, Nav, Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import '../css/Navbar.css'

export const CustomNavbar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
      <BootstrapNavbar expand="lg" className="custom-navbar shadow-sm">
        <Container>
          <BootstrapNavbar.Brand href="/" className="navbar-brand-custom">
            📚 Virtual Bookshelf
          </BootstrapNavbar.Brand>
          <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
          <BootstrapNavbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
            <Nav.Link href="/shelves" className="nav-link-custom">Мои полки</Nav.Link>
              <Nav.Link href="/books" className="nav-link-custom">Каталог книг</Nav.Link>
              <Nav.Link href="/public-shelves" className="nav-link-custom">Публичные полки</Nav.Link>
            </Nav>
            <Button variant="custom" className="logout-button" onClick={handleLogout}>
              Выйти
            </Button>
          </BootstrapNavbar.Collapse>
        </Container>
      </BootstrapNavbar>
    );
};
