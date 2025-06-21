package org.example.service.domain.Impl;

import org.example.model.DTOs.studentDTO.DisplayStudentDTO;
import org.example.model.Student;
import org.example.repository.StudentRepository;
import org.example.service.domain.StudentDomainService;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class StudentDomainServiceImpl implements StudentDomainService {

    private final StudentRepository studentRepository;

    public StudentDomainServiceImpl(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    @Override
    public List<Student> findAll() {
        return this.studentRepository.findAll();
    }

    @Override
    public Student get(String index) {
        return studentRepository.findByIndex(index);
    }

    @Override
    public Optional<Student> create(Student student) {
        Student student_obj = this.studentRepository.save(student);

        return Optional.of(student_obj);
    }

    @Override
    public Optional<Student> update(String index, Student student) {
        Optional<Student> student_obj = this.studentRepository.findById(index);

        if (student_obj.isPresent()) {
            Student existing_student = student_obj.get();

            existing_student.setName(student.getName());
            existing_student.setLastName(student.getLastName());
            existing_student.setEmail(student.getEmail());

            this.studentRepository.save(existing_student);

            return Optional.of(existing_student);
        }

        return Optional.empty();
    }

    @Override
    public void delete(String index) {
        this.studentRepository.deleteById(index);
    }

    @Override
    public List<Student> searchStudentsByIndex(String query) {
        return studentRepository.findByIndexContainingIgnoreCase(query);
    }
}
