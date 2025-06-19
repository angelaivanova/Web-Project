package org.example.web;

import org.example.model.DTOs.topicDTO.DisplayTopicDTO;
import org.example.service.application.SubjectAllocationService;
import org.example.service.application.TopicApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.nio.file.AccessDeniedException;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/topics")
public class TopicController {

    private final TopicApplicationService topicApplicationService;
    private final SubjectAllocationService subjectAllocationService;

    public TopicController(TopicApplicationService topicApplicationService, SubjectAllocationService subjectAllocationService) {
        this.topicApplicationService = topicApplicationService;
        this.subjectAllocationService = subjectAllocationService;
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<DisplayTopicDTO>> findAll() {
        return ResponseEntity.ok(this.topicApplicationService.findAll());
    }

    @GetMapping("/{topicId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<DisplayTopicDTO> getTopicById(@PathVariable("topicId") String topicId) {
        return subjectAllocationService.getTopicById(topicId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{topicId}/is-closed")
    @PreAuthorize("hasAnyRole('PROFESSOR', 'STUDENT')")
    public ResponseEntity<Boolean> isClosed(@PathVariable("topicId") String topicId) {
        return ResponseEntity.ok(subjectAllocationService.isClosed(topicId));
    }

    @GetMapping("/{topicId}/choose")
    @PreAuthorize("hasAnyRole('PROFESSOR', 'STUDENT')")
    public ResponseEntity<DisplayTopicDTO> chooseTopic(@PathVariable("topicId") String topicId) throws AccessDeniedException {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();

        return subjectAllocationService.chooseTopic(topicId, username)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
