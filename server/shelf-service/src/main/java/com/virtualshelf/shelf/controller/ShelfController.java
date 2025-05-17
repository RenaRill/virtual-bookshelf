package com.virtualshelf.shelf.controller;

import com.virtualshelf.shelf.entity.Shelf;
import com.virtualshelf.shelf.service.ShelfService;
import com.virtualshelf.shelf.dto.PublicShelfDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/shelfs")
@RequiredArgsConstructor
public class ShelfController {

    private final ShelfService shelfService;

    @GetMapping
    public ResponseEntity<List<Shelf>> getUserShelves(@RequestHeader("X-User-Id") Long userId) {
        List<Shelf> shelves = shelfService.getShelvesByUserId(userId);
        return ResponseEntity.ok(shelves);
    }

    @PostMapping
    public ResponseEntity<Shelf> addShelf(@RequestBody Shelf shelf,
                                          @RequestHeader("X-User-Id") Long userId) {
        shelf.setUserId(userId);
        Shelf savedShelf = shelfService.addShelf(shelf);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedShelf);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Shelf> getShelfById(@PathVariable Long id, @RequestHeader("X-User-Id") Long userId) {
        Shelf shelf = shelfService.getShelfById(id, userId);
        return ResponseEntity.ok(shelf);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Shelf> updateShelf(@PathVariable Long id,
                                             @RequestBody Shelf updatedShelf,
                                             @RequestHeader("X-User-Id") Long userId) {
        Shelf shelf = shelfService.updateShelf(id, updatedShelf, userId);
        return ResponseEntity.ok(shelf);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteShelf(@PathVariable Long id,
                                            @RequestHeader("X-User-Id") Long userId) {
        shelfService.deleteShelf(id, userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/public")
    public ResponseEntity<List<PublicShelfDto>> getPublicShelves() {
        List<PublicShelfDto> publicShelves = shelfService.getPublicShelves();
        return ResponseEntity.ok(publicShelves);
    }
}



