package com.virtualshelf.shelf.service;

import com.virtualshelf.shelf.entity.Shelf;
import com.virtualshelf.shelf.exception.ForbiddenException;
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

    public Shelf updateShelf(Long id, Shelf updatedShelf, Long currentUserId) {
        Shelf existingShelf = shelfRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Shelf not found"));

        if (!existingShelf.getUserId().equals(currentUserId)) {
            throw new ForbiddenException("You are not authorized to update this shelf");
        }

        if (updatedShelf.getName() != null) existingShelf.setName(updatedShelf.getName());
        if (updatedShelf.getIsPublic() != null) existingShelf.setIsPublic(updatedShelf.getIsPublic());

        return shelfRepository.save(existingShelf);
    }


    public void deleteShelf(Long id, Long currentUserId) {
        Shelf existingShelf = getShelfById(id);

        if (!existingShelf.getUserId().equals(currentUserId)) {
            throw new ForbiddenException("You are not authorized to delete this shelf");
        }

        shelfRepository.delete(existingShelf);
    }
}

