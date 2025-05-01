package com.virtualshelf.book.service;

import com.virtualshelf.book.entity.Book;
import com.virtualshelf.book.repository.BookRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BookService {
    private final BookRepository bookRepository;

    public Book addBook(Book book) {
        return bookRepository.save(book);
    }

    public Book getBookById(Long id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found with id " + id));
    }

    public Book updateBook(Long id, Book updatedBook) {
        Book existingBook = bookRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Book not found"));

        if (updatedBook.getTitle() != null) existingBook.setTitle(updatedBook.getTitle());
        if (updatedBook.getAuthor() != null) existingBook.setAuthor(updatedBook.getAuthor());
        if (updatedBook.getYear() != null) existingBook.setYear(updatedBook.getYear());
        if (updatedBook.getIsbn() != null) existingBook.setIsbn(updatedBook.getIsbn());
        if (updatedBook.getCoverImageUrl() != null) existingBook.setCoverImageUrl(updatedBook.getCoverImageUrl());

        return bookRepository.save(existingBook);
    }


    public void deleteBook(Long id) {
        Book existingBook = getBookById(id);
        bookRepository.delete(existingBook);
    }
}
