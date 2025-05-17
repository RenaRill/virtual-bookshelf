import React, { useState, useEffect } from 'react';
import { Card, Button, ListGroup, Alert, Image, Badge } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { shelfAPI, bookAPI } from '../api';
import '../css/ShelvesPage.css'

export const ShelfDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shelf, setShelf] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const shelfRes = await shelfAPI.getById(id);
        const bookLinksRes = await shelfAPI.getBooks(id);

        setShelf(shelfRes.data);

        const bookIds = bookLinksRes.data.map(item => item.bookId);

        const bookPromises = bookIds.map(bookId => bookAPI.getById(bookId));
        const bookResponses = await Promise.all(bookPromises);

        const books = bookResponses.map(res => res.data);
        setBooks(books);
      } catch (err) {
        setError('Failed to fetch shelf details: ' + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);


  const handleRemoveBook = async (bookId) => {
    try {
      await shelfAPI.removeBook(id, bookId);
      setBooks(books.filter(book => book.id !== bookId));
    } catch (err) {
      if (err.response?.status === 403) {
        setError('Вы не можете удалять книги с чужой полки!');
      } else {
        setError('Не получилось удалить книгу: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!shelf) return <div>Полка не найдена</div>;

  return (
    <div className="p-4">
      {error && <Alert variant="danger">{error}</Alert>}

      <Button
        variant="outline-secondary"
        onClick={() => navigate(-1)}
        className="mb-4"
      >
        Назад к полкам
      </Button>

      <Card className="mb-4">
        <Card.Body>
          <Card.Title>
            {shelf.name}
            {shelf.isPublic && (
              <span className="custom-badge" style={{ marginLeft: '8px' }}>Публичная</span>
            )}
          </Card.Title>
        </Card.Body>
      </Card>

      <h4 className="mb-3">Книги на этой полке ({books.length})</h4>
      <ListGroup>
        {books.length === 0 ? (
          <ListGroup.Item>На этой полке пока нет книг! Добавьте их на странице каталога книг.</ListGroup.Item>
        ) : (
          books.map(book => (
            <ListGroup.Item key={book.id} className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                {book.coverImageUrl ? (
                  <Image
                    src={book.coverImageUrl}
                    alt={book.title}
                    thumbnail
                    style={{ width: '50px', marginRight: '15px' }}
                  />
                ) : (
                  <div style={{ width: '50px', height: '75px', marginRight: '15px', backgroundColor: '#eaeaea' }} />
                )}
                <div>
                  <div><strong>{book.title || 'Untitled Book'}</strong></div>
                  <div>{book.author || 'Unknown Author'} ({book.year || 'N/A'})</div>
                  <small className="text-muted">ISBN: {book.isbn || '—'}</small>
                </div>
              </div>
              <button
                className="remove-btn"
                onClick={() => handleRemoveBook(book.id)}
              >
                Убрать с полки
              </button>
            </ListGroup.Item>
          ))
        )}
      </ListGroup>
    </div>
  );
};
