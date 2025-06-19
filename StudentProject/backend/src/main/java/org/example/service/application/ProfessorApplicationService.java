package org.example.service.application;

import org.example.model.DTOs.professorDTO.DisplayProfessorDTO;
import java.util.List;
import java.util.Optional;

public interface ProfessorApplicationService {
    List<DisplayProfessorDTO> findAll();

    Optional<DisplayProfessorDTO> findByID(String id);

    List<DisplayProfessorDTO> findByName(String name);
}
