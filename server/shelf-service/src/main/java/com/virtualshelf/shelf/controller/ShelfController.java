package com.virtualshelf.shelf.controller;

import com.virtualshelf.shelf.entity.Shelf;
import com.virtualshelf.shelf.service.ShelfService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/shelfs")
@RequiredArgsConstructor
public class ShelfController {
    private final ShelfService shelfService;

    @PostMapping
    public ResponseEntity<Shelf> addShelf(@RequestBody Shelf shelf) {
        Shelf savedShelf = shelfService.addShelf(shelf);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedShelf);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Shelf> getShelfById(@PathVariable Long id) {
        Shelf shelf = shelfService.getShelfById(id);
        return ResponseEntity.ok(shelf);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Shelf> updateShelf(@PathVariable Long id, @RequestBody Shelf updatedShelf) {
        Shelf shelf = shelfService.updateShelf(id, updatedShelf);
        return ResponseEntity.ok(shelf);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteShelf(@PathVariable Long id) {
        shelfService.deleteShelf(id);
        return ResponseEntity.noContent().build();
    }
}

