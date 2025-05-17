import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Modal, Alert, Badge, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { shelfAPI } from '../api';
import { useAuth } from '../components/AuthContext';
import { FiEdit, FiTrash } from 'react-icons/fi';
import '../css/ShelvesPage.css';

export const ShelvesPage = () => {
  const [shelves, setShelves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentShelf, setCurrentShelf] = useState(null);
  const [shelfForm, setShelfForm] = useState({ name: '', isPublic: false });

  const { isAuthenticated, userId } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchShelves = async () => {
      try {
        setLoading(true);
        const response = await shelfAPI.getAll({
          headers: { 'X-User-Id': userId }
        });
        setShelves(response.data);
        setError('');
      } catch (err) {
        setError('Не получилось получить полки: ' + (err.response?.data?.message || err.message));
        console.error('Ошибка получения полок:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchShelves();
  }, [isAuthenticated, userId]);

  const openCreateModal = () => {
    setEditMode(false);
    setShelfForm({ name: '', isPublic: false });
    setCurrentShelf(null);
    setShowModal(true);
  };

  const openEditModal = (shelf) => {
    setEditMode(true);
    setCurrentShelf(shelf);
    setShelfForm({ name: shelf.name, isPublic: shelf.isPublic });
    setShowModal(true);
  };

  const handleSaveShelf = async () => {
    if (!shelfForm.name.trim()) return;

    try {
      if (editMode && currentShelf) {
        const updated = await shelfAPI.update(currentShelf.id, shelfForm);
        setShelves(shelves.map(s => (s.id === currentShelf.id ? updated.data : s)));
      } else {
        const created = await shelfAPI.create(shelfForm, {
          headers: { 'X-User-Id': userId }
        });
        setShelves([...shelves, created.data]);
      }

      setShowModal(false);
      setShelfForm({ name: '', isPublic: false });
      setCurrentShelf(null);
      setEditMode(false);
      setError('');
    } catch (err) {
      setError('Не получилось сохранить полку: ' + (err.response?.data?.message || err.message));
      console.error('Ошибка сохранения полки:', err);
    }
  };

  const handleDeleteShelf = async (shelfId) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту полку?')) return;

    try {
      await shelfAPI.delete(shelfId);
      setShelves(shelves.filter(s => s.id !== shelfId));
      setError('');
    } catch (err) {
      setError('Не удалось удалить полку: ' + (err.response?.data?.message || err.message));
      console.error('Ошибка удаления полки:', err);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="p-4 text-center">
        <Alert variant="warning">Пожалуйста, войдите в аккаунт, чтобы увидеть свои полки</Alert>
      </div>
    );
  }

  return (
    <div className="p-4">
      {error && (
        <Alert variant="danger" onClose={() => setError('')} dismissible>
          {error}
        </Alert>
      )}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Мои полки</h2>
        <button className="shelf-btn" onClick={openCreateModal}>
          Добавить полку
        </button>
      </div>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" role="status" />
        </div>
      ) : shelves.length === 0 ? (
        <Card>
          <Card.Body className="text-center">
            <Card.Text>У вас пока нет ни одной полки</Card.Text>
            <button className="btn" onClick={openCreateModal}>
              Создать первую полку
            </button>
          </Card.Body>
        </Card>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {shelves.map((shelf) => (
            <div key={shelf.id} className="col">
              <Card
                className="shelf-card"
                onClick={() => navigate(`/shelves/${shelf.id}`)}
                style={{ cursor: 'pointer', height: '100%' }}
              >
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="shelf-card-title">{shelf.name}</div>
                    <div
                      className="shelf-card-icons"
                      onClick={(e) => e.stopPropagation()}
                      style={{ display: 'flex', gap: '8px' }}
                    >
                      <FiEdit
                        className="icon-btn"
                        onClick={() => openEditModal(shelf)}
                        title="Редактировать"
                        style={{ cursor: 'pointer' }}
                      />
                      <FiTrash
                        className="icon-btn"
                        onClick={() => handleDeleteShelf(shelf.id)}
                        title="Удалить"
                        style={{ cursor: 'pointer' }}
                      />
                    </div>
                  </div>
                  {shelf.isPublic && (
                    <span className="custom-badge">
                          Публичная
                    </span>
                  )}
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      )}

      {/* Модальное окно создания/редактирования */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? 'Редактировать полку' : 'Создать новую полку'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="shelfName">
              <Form.Label>Название полки*</Form.Label>
              <Form.Control
                type="text"
                placeholder="Введите название"
                value={shelfForm.name}
                onChange={(e) =>
                  setShelfForm({ ...shelfForm, name: e.target.value })
                }
                maxLength={50}
                required
                autoFocus
              />
            </Form.Group>
            <Form.Group controlId="isPublicCheckbox">
              <Form.Check
                type="checkbox"
                label="Сделать эту полку публичной"
                checked={shelfForm.isPublic}
                onChange={(e) =>
                  setShelfForm({ ...shelfForm, isPublic: e.target.checked })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="shelf-btn"
            onClick={() => setShowModal(false)}
          >
            Отмена
          </button>
          <button
            className="shelf-btn"
            onClick={handleSaveShelf}
            disabled={!shelfForm.name.trim()}
          >
            {editMode ? 'Сохранить' : 'Создать'}
          </button>
        </Modal.Footer>

      </Modal>
    </div>
  );
};
