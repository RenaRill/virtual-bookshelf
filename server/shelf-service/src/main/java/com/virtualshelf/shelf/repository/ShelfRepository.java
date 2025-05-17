package com.virtualshelf.shelf.repository;

import com.virtualshelf.shelf.entity.Shelf;
import com.virtualshelf.shelf.entity.ShelfBook;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShelfRepository extends JpaRepository<Shelf, Long> {
    List<Shelf> findByUserId(Long userId);

    List<Shelf> findByIsPublicTrue();
}
