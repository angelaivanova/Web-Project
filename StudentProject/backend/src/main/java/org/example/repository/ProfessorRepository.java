package org.example.repository;

import org.example.model.Professor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProfessorRepository extends JpaRepository<Professor, String> {
    List<Professor> findByNameContainingIgnoreCase(String name);
    Optional<Professor> findById(String id);


}
