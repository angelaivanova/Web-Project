package org.example.service.application;

import org.example.model.DTOs.studentDTO.CreateStudentDTO;
import org.example.model.DTOs.studentDTO.DisplayStudentDTO;
import java.util.List;
import java.util.Optional;

public interface StudentApplicationService {

    List<DisplayStudentDTO> findAll();

    DisplayStudentDTO get(String index);

    Optional<DisplayStudentDTO> create(CreateStudentDTO createStudentDTO);

    Optional<DisplayStudentDTO> update(String index, CreateStudentDTO createStudentDTO);

    void delete(String index);
}
