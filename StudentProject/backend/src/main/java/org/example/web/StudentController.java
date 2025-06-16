package org.example.web;

import org.example.model.DTOs.studentDTO.CreateStudentDTO;
import org.example.model.DTOs.studentDTO.DisplayStudentDTO;
import org.example.model.Student;
import org.example.service.application.StudentApplicationService;
import org.example.service.domain.StudentDomainService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/students")
public class StudentController {

    private final StudentApplicationService studentApplicationService;
    private final StudentDomainService studentDomainService;


    public StudentController(StudentApplicationService studentApplicationService, StudentDomainService studentDomainService) {
        this.studentApplicationService = studentApplicationService;
        this.studentDomainService = studentDomainService;
    }

    @GetMapping
    public ResponseEntity<List<DisplayStudentDTO>> findAll() {
        return ResponseEntity.ok(this.studentApplicationService.findAll());
    }

    @PostMapping("/add-student")
    public ResponseEntity<Optional<DisplayStudentDTO>> addStudent(@RequestBody CreateStudentDTO createStudentDTO) {
        return ResponseEntity.ok(this.studentApplicationService.create(createStudentDTO));
    }

    @PutMapping("/edit-student/{index}")
    public ResponseEntity<Optional<DisplayStudentDTO>> editStudent(@PathVariable String index,
                                                                   @RequestBody CreateStudentDTO createStudentDTO) {
        return ResponseEntity.ok(this.studentApplicationService.update(index, createStudentDTO));
    }

    @DeleteMapping("delete-student/{index}")
    public ResponseEntity<Void> deleteStudent(@PathVariable String index) {
        this.studentApplicationService.delete(index);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<DisplayStudentDTO>> searchStudentsByIndex(@RequestParam("q") String query) {
        List<Student> students = studentDomainService.searchStudentsByIndex(query);
        List<DisplayStudentDTO> result = students.stream()
                .map(DisplayStudentDTO::from)
                .toList();
        return ResponseEntity.ok(result);
    }
}
