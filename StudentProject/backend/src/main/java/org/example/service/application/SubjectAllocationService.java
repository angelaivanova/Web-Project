package org.example.service.application;

import org.example.model.DTOs.TeacherSubjectAllocationDTO.TeacherSubjectAllocationDTO;
import org.example.model.DTOs.topicDTO.CreateTopicDTO;
import org.example.model.DTOs.topicDTO.DisplayTopicDTO;
import org.example.model.TeacherSubjectAllocation;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;
import java.nio.file.AccessDeniedException;
import java.util.List;
import java.util.Optional;

public interface SubjectAllocationService {

    List<DisplayTopicDTO> getAllTopics();

    Optional<DisplayTopicDTO> getTopicById(String topicId);

    List<DisplayTopicDTO> getTopicsByProfessor(String professorId);

    List<DisplayTopicDTO> getTopicsBySubject(String subjectId);

    DisplayTopicDTO addTopic(String professorId, String subjectId, CreateTopicDTO topicDTO);

    DisplayTopicDTO updateTopic(String topicId, String professorId, String subjectId, CreateTopicDTO topicDTO);

    void deleteTopic(String topicId);

    void delete(Long id);

    Page<TeacherSubjectAllocation> findAll(Specification<TeacherSubjectAllocation> filter, Integer pageNum, Integer results);

    List<TeacherSubjectAllocationDTO> getTeacherSubjectAllocationsByProfessorId(String professorId);

    boolean isClosed(String topicId);

    Optional<DisplayTopicDTO> chooseTopic(String topicId, String username) throws AccessDeniedException;


}
