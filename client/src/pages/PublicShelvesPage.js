import React, { useEffect, useState } from 'react';
import { Card, Alert, Spinner, Button, Row, Col, Form } from 'react-bootstrap';
import { shelfAPI } from '../api';
import { useNavigate } from 'react-router-dom';
import '../css/ShelvesPage.css';

export const PublicShelvesPage = () => {
  const [shelves, setShelves] = useState([]);
  const [filteredShelves, setFilteredShelves] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPublicShelves = async () => {
      try {
        const res = await shelfAPI.getPublicShelves();
        setShelves(res.data);
        setFilteredShelves(res.data);
      } catch (err) {
        setError('Не удалось загрузить публичные полки');
      } finally {
        setLoading(false);
      }
    };

    fetchPublicShelves();
  }, []);

  useEffect(() => {
    const lower = searchQuery.toLowerCase();
    const result = shelves.filter(shelf =>
      shelf.name.toLowerCase().includes(lower)
    );
    setFilteredShelves(result);
  }, [searchQuery, shelves]);

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="p-4">
      <h2 className="mb-4">Публичные полки</h2>

      <Form className="mb-4">
        <Form.Control
          type="text"
          placeholder="Поиск по названию"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Form>

      {filteredShelves.length === 0 ? (
        <Alert variant="info">Полки не найдены</Alert>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {filteredShelves.map((shelf) => (
            <Col key={shelf.id}>
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title className="d-flex justify-content-between align-items-center">
                    <span>{shelf.name}</span>
                  </Card.Title>
                  <button
                    className="shelf-btn mt-3"
                    onClick={() => navigate(`/shelves/${shelf.id}`)}>
                    Посмотреть
                  </button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};
