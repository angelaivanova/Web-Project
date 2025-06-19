package org.example.service.domain;

import org.example.model.Professor;
import java.util.List;
import java.util.Optional;

public interface ProfessorDomainService {

    List<Professor> findAll();

    Optional<Professor> findByID(String id);

    List<Professor> findByNameContainingIgnoreCase(String name);
}
