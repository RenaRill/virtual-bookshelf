package com.virtualshelf.shelf.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "shelf_books")
@Data
public class ShelfBook {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long shelfId;

    @Column(nullable = false)
    private Long bookId;
}

