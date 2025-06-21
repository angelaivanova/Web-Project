package org.example.repository;

import org.example.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, String> {

    List<Student> findByIndexContainingIgnoreCase(String indexPart);

    Student findByIndex(String index);
}
