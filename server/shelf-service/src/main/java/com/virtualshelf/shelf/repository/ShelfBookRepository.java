package com.virtualshelf.shelf.repository;

import com.virtualshelf.shelf.entity.ShelfBook;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ShelfBookRepository extends JpaRepository<ShelfBook, Long> {
    List<ShelfBook> findByShelfId(Long shelfId);
    void deleteByShelfIdAndBookId(Long shelfId, Long bookId);
}

