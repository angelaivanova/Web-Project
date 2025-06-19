package org.example.service.domain;

import org.example.model.Student;
import java.util.List;
import java.util.Optional;

public interface StudentDomainService {

    List<Student> findAll();

    Optional<Student> create(Student student);

    Optional<Student> update(String index, Student student);

    void delete(String index);

    List<Student> searchStudentsByIndex(String query);
}
