package com.virtualshelf.shelf.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "shelfs")
@Data
public class Shelf {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Boolean isPublic;
}

