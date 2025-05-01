package com.virtualshelf.shelf.service;

import com.virtualshelf.shelf.entity.Shelf;
import com.virtualshelf.shelf.repository.ShelfRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ShelfService {
    private final ShelfRepository shelfRepository;

    public Shelf addShelf(Shelf shelf) {
        return shelfRepository.save(shelf);
    }

    public Shelf getShelfById(Long id) {
        return shelfRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Shelf not found with id " + id));
    }

    public Shelf updateShelf(Long id, Shelf updatedShelf) {
        Shelf existingShelf = shelfRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Shelf not found"));

        if (updatedShelf.getName() != null) existingShelf.setName(updatedShelf.getName());
        if (updatedShelf.getIsPublic() != null) existingShelf.setIsPublic(updatedShelf.getIsPublic());

        return shelfRepository.save(existingShelf);
    }


    public void deleteShelf(Long id) {
        Shelf existingShelf = getShelfById(id);
        shelfRepository.delete(existingShelf);
    }
}
