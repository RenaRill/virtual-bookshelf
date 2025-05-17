import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Form as BootstrapForm, Modal, Alert, Pagination } from 'react-bootstrap';
import { bookAPI, shelfAPI } from '../api';
import { useAuth } from '../components/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import '../css/BooksPage.css';

const bookSchema = Yup.object().shape({
  title: Yup.string()
    .required('Название обязательно'),
  author: Yup.string()
    .required('Автор обязателен'),
  year: Yup.number()
    .typeError('Год должен быть числом')
    .required('Год обязателен')
    .min(1500, 'Год не может быть меньше 1500')
    .max(new Date().getFullYear(), 'Год не может быть в будущем'),
  isbn: Yup.string()
    .required('ISBN обязателен')
    .matches(
      /^(?:ISBN(?:-1[03])?:? )?(?=[-0-9X ]{10,17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/,
      'Введите корректный ISBN-10 или ISBN-13'
    ),
  coverImageUrl: Yup.string()
    .url('Введите корректный URL')
    .nullable()
    .notRequired(),
});

export const BooksPage = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showShelfModal, setShowShelfModal] = useState(false);
  const [error, setError] = useState('');
  const [shelfError, setShelfError] = useState('');
  const [shelves, setShelves] = useState([]);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [filters, setFilters] = useState({ title: '', author: '', year: '', isbn: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 8;
  const { token } = useAuth();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await bookAPI.getAll();
        setBooks(response.data);
        setFilteredBooks(response.data);
      } catch (err) {
        setError('Failed to fetch books');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [token]);

  useEffect(() => {
    const filtered = books.filter(book =>
      book.title.toLowerCase().includes(filters.title.toLowerCase()) &&
      book.author.toLowerCase().includes(filters.author.toLowerCase()) &&
      book.year.toString().includes(filters.year) &&
      book.isbn.includes(filters.isbn)
    );
    setFilteredBooks(filtered);
    setCurrentPage(1);
  }, [filters, books]);

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  const handleAddBook = async (values, { setSubmitting, resetForm }) => {
    try {
      const bookToCreate = { ...values, year: parseInt(values.year, 10) };
      const response = await bookAPI.create(bookToCreate);
      const updatedBooks = [...books, response.data];
      setBooks(updatedBooks);
      setShowModal(false);
      resetForm();
      setError('');
    } catch (err) {
      setError('Не получилось добавить книгу: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenShelfModal = async (bookId) => {
    try {
      setSelectedBookId(bookId);
      const res = await shelfAPI.getAll();
      setShelves(res.data);
      setShelfError('');
      setShowShelfModal(true);
    } catch (err) {
      setShelfError('Не получилось получить полки: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleAddBookToShelf = async (shelfId) => {
    try {
      const res = await shelfAPI.getBooks(shelfId);
      const bookIdsOnShelf = res.data.map(item => item.bookId);

      if (bookIdsOnShelf.includes(selectedBookId)) {
        setShelfError('Эта книга уже есть на полке!');
        return;
      }
      await shelfAPI.addBook(shelfId, selectedBookId);
      setShowShelfModal(false);
      setSelectedBookId(null);
      setShelfError('');
    } catch (err) {
      setShelfError('Не получилось поставить книгу на полку: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4 books-page">
      {error && <Alert variant="danger">{error}</Alert>}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Каталог книг</h2>
        <button className="pastel-btn" onClick={() => setShowModal(true)}>Добавить книгу</button>
      </div>

      <BootstrapForm className="mb-4">
        <Row className="g-2">
          <Col><BootstrapForm.Control placeholder="Поиск по названию" value={filters.title} onChange={e => setFilters({ ...filters, title: e.target.value })} /></Col>
          <Col><BootstrapForm.Control placeholder="Поиск по автору" value={filters.author} onChange={e => setFilters({ ...filters, author: e.target.value })} /></Col>
          <Col><BootstrapForm.Control placeholder="Поиск по году" value={filters.year} onChange={e => setFilters({ ...filters, year: e.target.value })} /></Col>
          <Col><BootstrapForm.Control placeholder="Поиск по ISBN" value={filters.isbn} onChange={e => setFilters({ ...filters, isbn: e.target.value })} /></Col>
        </Row>
      </BootstrapForm>

      {currentBooks.length === 0 ? (
        <div className="no-results text-center">
          <p>Книг по вашему запросу не найдено.</p>
          <p>Вы можете добавить свою книгу!</p>
        </div>
      ) : (
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {currentBooks.map(book => (
            <Col key={book.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <Card className="book-card">
                {book.coverImageUrl ? (
                  <Card.Img
                    variant="top"
                    src={book.coverImageUrl}
                    alt={book.title}
                    className="book-cover"
                  />
                ) : (
                  <div className="no-cover">Нет обложки</div>
                )}

                <div className="overlay">
                  <button
                    className="shelf-btn"
                    onClick={() => handleOpenShelfModal(book.id)}
                  >
                    Поставить на полку
                  </button>
                </div>

                <div className="book-info">
                  <div className="book-title">{book.title}</div>
                  <div className="book-author">{book.author}</div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {totalPages > 1 && (
        <Pagination className="justify-content-center mt-4">
          {[...Array(totalPages).keys()].map(page => (
            <Pagination.Item key={page + 1} active={page + 1 === currentPage} onClick={() => setCurrentPage(page + 1)}>
              {page + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton><Modal.Title>Добавить новую книгу</Modal.Title></Modal.Header>

        <Formik
          initialValues={{
            title: '',
            author: '',
            year: '',
            isbn: '',
            coverImageUrl: '',
          }}
          validationSchema={bookSchema}
          onSubmit={handleAddBook}
        >
          {({ isSubmitting, touched, errors }) => (
            <Form>
              <Modal.Body>
                <BootstrapForm.Group className="mb-3">
                  <BootstrapForm.Label>Название*</BootstrapForm.Label>
                  <Field
                    name="title"
                    as={BootstrapForm.Control}
                    isInvalid={touched.title && !!errors.title}
                  />
                  <BootstrapForm.Control.Feedback type="invalid">
                    <ErrorMessage name="title" />
                  </BootstrapForm.Control.Feedback>
                </BootstrapForm.Group>

                <BootstrapForm.Group className="mb-3">
                  <BootstrapForm.Label>Автор*</BootstrapForm.Label>
                  <Field
                    name="author"
                    as={BootstrapForm.Control}
                    isInvalid={touched.author && !!errors.author}
                  />
                  <BootstrapForm.Control.Feedback type="invalid">
                    <ErrorMessage name="author" />
                  </BootstrapForm.Control.Feedback>
                </BootstrapForm.Group>

                <BootstrapForm.Group className="mb-3">
                  <BootstrapForm.Label>Год*</BootstrapForm.Label>
                  <Field
                    name="year"
                    type="number"
                    as={BootstrapForm.Control}
                    isInvalid={touched.year && !!errors.year}
                  />
                  <BootstrapForm.Control.Feedback type="invalid">
                    <ErrorMessage name="year" />
                  </BootstrapForm.Control.Feedback>
                </BootstrapForm.Group>

                <BootstrapForm.Group className="mb-3">
                  <BootstrapForm.Label>ISBN*</BootstrapForm.Label>
                  <Field
                    name="isbn"
                    as={BootstrapForm.Control}
                    isInvalid={touched.isbn && !!errors.isbn}
                  />
                  <BootstrapForm.Control.Feedback type="invalid">
                    <ErrorMessage name="isbn" />
                  </BootstrapForm.Control.Feedback>
                </BootstrapForm.Group>

                <BootstrapForm.Group className="mb-3">
                  <BootstrapForm.Label>URL обложки</BootstrapForm.Label>
                  <Field
                    name="coverImageUrl"
                    type="url"
                    as={BootstrapForm.Control}
                    isInvalid={touched.coverImageUrl && !!errors.coverImageUrl}
                    placeholder="https://example.com/cover.jpg"
                  />
                  <BootstrapForm.Control.Feedback type="invalid">
                    <ErrorMessage name="coverImageUrl" />
                  </BootstrapForm.Control.Feedback>
                </BootstrapForm.Group>
              </Modal.Body>

              <Modal.Footer>
                <button className="pastel-btn" onClick={() => setShowModal(false)}>Отмена</button>
                <button type="submit" className="pastel-btn" disabled={isSubmitting}>Добавить книгу</button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal>

      <Modal show={showShelfModal} onHide={() => setShowShelfModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>Выберите полку</Modal.Title></Modal.Header>
        <Modal.Body>
          {shelfError && <Alert variant="danger">{shelfError}</Alert>}
          {shelves.length === 0 ? (
            <p>У вас нет доступных полок.</p>
          ) : (
            shelves.map(shelf => (
              <Button
                key={shelf.id}
                variant="outline-secondary"
                className="d-block mb-2 w-100 text-start"
                onClick={() => handleAddBookToShelf(shelf.id)}
              >
                {shelf.name}
              </Button>
            ))
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowShelfModal(false)}>Отмена</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
