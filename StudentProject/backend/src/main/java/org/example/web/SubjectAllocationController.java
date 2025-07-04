package org.example.web;

import org.example.model.DTOs.TeacherSubjectAllocationDTO.TeacherSubjectAllocationDTO;
import org.example.model.DTOs.topicDTO.CreateTopicDTO;
import org.example.model.DTOs.topicDTO.DisplayTopicDTO;
import org.example.service.application.Impl.SubjectAllocationServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.nio.file.AccessDeniedException;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/subject-allocations")
public class SubjectAllocationController {

    private final SubjectAllocationServiceImpl subjectAllocationService;

    public SubjectAllocationController(SubjectAllocationServiceImpl subjectAllocationService) {
        this.subjectAllocationService = subjectAllocationService;
    }

    @GetMapping("/topics")
    @PreAuthorize("isAuthenticated()")
    public List<DisplayTopicDTO> getAllTopics() {
        return subjectAllocationService.getAllTopics();
    }

    @GetMapping("/topics/{topicId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<DisplayTopicDTO> getTopicById(@PathVariable("topicId") String topicId) {
        return subjectAllocationService.getTopicById(topicId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/professors/{professorId}/topics")
    public List<DisplayTopicDTO> getTopicsByProfessor(@PathVariable("professorId") String professorId) {
        return subjectAllocationService.getTopicsByProfessor(professorId);
    }

    @GetMapping("/subjects/{subjectId}/topics")
    @PreAuthorize("isAuthenticated()")
    public List<DisplayTopicDTO> getTopicsBySubject(@PathVariable("subjectId") String subjectId) {
        return subjectAllocationService.getTopicsBySubject(subjectId);
    }

    @GetMapping("/{professorId}/subjects")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<TeacherSubjectAllocationDTO>> getSubjectsForProfessor(@PathVariable("professorId") String professorId) {
        System.out.println("Looking for allocations for professorId: " + professorId);
        try {
            List<TeacherSubjectAllocationDTO> subjects = subjectAllocationService.getTeacherSubjectAllocationsByProfessorId(professorId);
            return ResponseEntity.ok(subjects);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/professors/{professorId}/subjects/{subjectId}/topics")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<DisplayTopicDTO>> getTopicsForProfessorAndSubject(
            @PathVariable("professorId") String professorId,
            @PathVariable("subjectId") String subjectId
    ) {
        List<DisplayTopicDTO> topics = subjectAllocationService.getTopicsByProfessorAndSubject(professorId, subjectId);
        return ResponseEntity.ok(topics);
    }

    //    ========== CRUD FOR TOPIC ==========

    @PostMapping("/professors/{professorId}/subjects/{subjectId}/topics/add-topic")
    @PreAuthorize("hasRole('PROFESSOR')")
    public ResponseEntity<DisplayTopicDTO> addTopicForProfessorAndSubject(
            @PathVariable("professorId") String professorId,
            @PathVariable("subjectId") String subjectId,
            @RequestBody CreateTopicDTO topicDTO) {
        DisplayTopicDTO createdTopic = subjectAllocationService.addTopic(professorId, subjectId, topicDTO);
        return ResponseEntity.ok(createdTopic);
    }

    @PutMapping("/topics/{id}/professors/{professorId}/subjects/{subjectId}/edit-topic")
    @PreAuthorize("hasRole('PROFESSOR')")
    public ResponseEntity<DisplayTopicDTO> updateTopic(@PathVariable("id") String id,
                                                       @PathVariable("professorId") String professorId,
                                                       @PathVariable("subjectId") String subjectId,
                                                       @RequestBody CreateTopicDTO topicDTO) {
        DisplayTopicDTO updated = subjectAllocationService.updateTopic(id, professorId, subjectId, topicDTO);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/topics/delete-topic/{id}")
    @PreAuthorize("hasRole('PROFESSOR')")
    public ResponseEntity<Void> deleteTopic(@PathVariable("id") String id) {
        subjectAllocationService.deleteTopic(id);
        return ResponseEntity.noContent().build();
    }

//    ========== CHOOSE TOPIC ==========

    @GetMapping("/topics/{topicId}/choose")
    @PreAuthorize("hasAnyRole('STUDENT', 'PROFESSOR')")
    public ResponseEntity<DisplayTopicDTO> chooseTopic(@PathVariable("topicId") String topicId) throws AccessDeniedException {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();

        return subjectAllocationService.chooseTopic(topicId, username)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
