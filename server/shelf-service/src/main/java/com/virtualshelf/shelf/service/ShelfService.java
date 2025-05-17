package com.virtualshelf.shelf.service;

import com.virtualshelf.shelf.entity.Shelf;
import com.virtualshelf.shelf.exception.ForbiddenException;
import com.virtualshelf.shelf.repository.ShelfRepository;
import com.virtualshelf.shelf.dto.PublicShelfDto;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
public class ShelfService {

    private final ShelfRepository shelfRepository;

    public List<Shelf> getShelvesByUserId(Long userId) {
        return shelfRepository.findByUserId(userId);
    }

    public Shelf addShelf(Shelf shelf) {
        return shelfRepository.save(shelf);
    }

    public Shelf getShelfById(Long id, Long currentUserId) {
        Shelf shelf = shelfRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Shelf not found with id " + id));

        if (!shelf.getIsPublic() && !shelf.getUserId().equals(currentUserId)) {
            throw new ForbiddenException("You are not authorized to view this shelf");
        }

        return shelf;
    }

    public Shelf getShelfForEdit(Long id, Long currentUserId) {
        Shelf shelf = shelfRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Shelf not found with id " + id));

        if (!shelf.getUserId().equals(currentUserId)) {
            throw new ForbiddenException("You are not authorized to modify this shelf");
        }

        return shelf;
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
        Shelf existingShelf = getShelfById(id, currentUserId);

        if (!existingShelf.getUserId().equals(currentUserId)) {
            throw new ForbiddenException("You are not authorized to delete this shelf");
        }

        shelfRepository.delete(existingShelf);
    }

    public List<PublicShelfDto> getPublicShelves() {
        return shelfRepository.findByIsPublicTrue().stream()
                .map(shelf -> new PublicShelfDto(shelf.getId(), shelf.getName()))
                .toList();
    }
}

