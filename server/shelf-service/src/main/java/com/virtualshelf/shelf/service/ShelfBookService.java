package com.virtualshelf.shelf.service;

import com.virtualshelf.shelf.entity.Shelf;
import com.virtualshelf.shelf.entity.ShelfBook;
import com.virtualshelf.shelf.exception.ForbiddenException;
import com.virtualshelf.shelf.repository.ShelfBookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ShelfBookService {

    private final ShelfBookRepository shelfBookRepository;
    private final ShelfService shelfService;

    public ShelfBook addBookToShelf(Long shelfId, Long bookId, Long userId) {
        Shelf shelf = shelfService.getShelfById(shelfId);
        if (!shelf.getUserId().equals(userId)) {
            throw new ForbiddenException("You don't own this shelf");
        }

        ShelfBook shelfBook = new ShelfBook();
        shelfBook.setShelfId(shelfId);
        shelfBook.setBookId(bookId);
        return shelfBookRepository.save(shelfBook);
    }

    public List<ShelfBook> getBooksByShelf(Long shelfId) {
        return shelfBookRepository.findByShelfId(shelfId);
    }

    public void removeBookFromShelf(Long shelfId, Long bookId) {
        shelfBookRepository.deleteByShelfIdAndBookId(shelfId, bookId);
    }
}

