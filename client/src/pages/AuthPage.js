import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { authAPI } from '../api';
import { useAuth } from '../components/AuthContext';

export const AuthPage = ({ isRegister }) => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isRegister) {
        await authAPI.register(formData);
        alert('Регистрация прошла успешно!');
        navigate('/login');
      } else {
        const { token } = await authAPI.login(formData.username, formData.password);
        login(token);
        navigate('/books');
      }
    } catch (err) {
      let errorMessage = 'Ошибка';

      if (err.response) {
        errorMessage = err.response.data.error ||
                      err.response.data.message ||
                      JSON.stringify(err.response.data);
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      console.error('Ошибка:', err);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Card style={{ width: '400px' }}>
        <Card.Body>
          <Card.Title>{isRegister ? 'Регистрация' : 'Вход'}</Card.Title>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Логин</Form.Label>
              <Form.Control
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
              />
            </Form.Group>

            {isRegister && (
              <Form.Group className="mb-3">
                <Form.Label>Почта</Form.Label>
                <Form.Control
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </Form.Group>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Пароль</Form.Label>
              <Form.Control
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              {isRegister ? 'Зарегистрироваться' : 'Войти'}
            </Button>
          </Form>
          <div className="mt-3 text-center">
            {isRegister ? (
              <span>Уже зарегистрированы? <Link to="/login">Войти</Link></span>
            ) : (
              <span>Ещё не зарегистрированы? <Link to="/register">Регистрация</Link></span>
            )}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};
