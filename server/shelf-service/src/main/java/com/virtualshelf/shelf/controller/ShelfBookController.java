package com.virtualshelf.shelf.controller;

import com.virtualshelf.shelf.entity.ShelfBook;
import com.virtualshelf.shelf.service.ShelfBookService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/shelfs")
@RequiredArgsConstructor
public class ShelfBookController {

    private final ShelfBookService shelfBookService;

    @PostMapping("/{shelfId}/books/{bookId}")
    public ResponseEntity<ShelfBook> addBookToShelf(@PathVariable Long shelfId,
                                                    @PathVariable Long bookId,
                                                    @RequestHeader("X-User-Id") Long userId) {
        ShelfBook saved = shelfBookService.addBookToShelf(shelfId, bookId, userId);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/{shelfId}/books")
    public ResponseEntity<List<ShelfBook>> getBooksByShelf(@PathVariable Long shelfId) {
        return ResponseEntity.ok(shelfBookService.getBooksByShelf(shelfId));
    }

    @DeleteMapping("/{shelfId}/books/{bookId}")
    public ResponseEntity<Void> removeBookFromShelf(@PathVariable Long shelfId,
                                                    @PathVariable Long bookId,
                                                    @RequestHeader("X-User-Id") Long userId) {
        shelfBookService.removeBookFromShelf(shelfId, bookId, userId);
        return ResponseEntity.noContent().build();
    }
}


