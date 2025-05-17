package com.virtualshelf.shelf.repository;

import com.virtualshelf.shelf.entity.ShelfBook;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ShelfBookRepository extends JpaRepository<ShelfBook, Long> {
    List<ShelfBook> findByShelfId(Long shelfId);

    Optional<ShelfBook> findByShelfIdAndBookId(Long shelfId, Long bookId);
}

