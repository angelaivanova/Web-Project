package org.example.repository;

import org.example.model.Subject;
import org.example.model.enumerations.SemesterType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, String> {
    List<Subject> findByNameContainingIgnoreCase(String name);

    List<Subject> findBySemesterType(SemesterType semesterType);

    List<Subject> findByNameContainingIgnoreCaseAndSemesterType(String name, SemesterType semesterType);
}
