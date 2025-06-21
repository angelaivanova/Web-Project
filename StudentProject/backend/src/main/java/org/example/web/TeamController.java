package org.example.web;

import jakarta.transaction.Transactional;
import org.example.model.DTOs.studentDTO.DisplayStudentDTO;
import org.example.service.application.TeamApplicationService;
import org.springframework.http.HttpStatus;
import org.example.model.DTOs.teamDTO.CreateTeamDTO;
import org.example.model.DTOs.teamDTO.DisplayTeamDTO;
import org.example.service.application.TopicApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/teams")
@CrossOrigin(origins = "http://localhost:3000")
public class TeamController {

    private final TopicApplicationService topicApplicationService;
    private final TeamApplicationService teamApplicationService;

    public TeamController(TopicApplicationService topicApplicationService, TeamApplicationService teamApplicationService) {
        this.topicApplicationService = topicApplicationService;
        this.teamApplicationService = teamApplicationService;
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<DisplayTeamDTO>> findAll() {
        return ResponseEntity.ok(this.teamApplicationService.findAll());
    }


    @PostMapping("/create-team/{topicId}")
    @PreAuthorize("hasAnyRole('PROFESSOR', 'STUDENT')")
    public ResponseEntity<DisplayTeamDTO> createTeam(
            @PathVariable("topicId") String topicId,
            @RequestBody CreateTeamDTO createTeamDTO) {

        try {
            System.out.println("Creating team for topic: " + topicId);
            System.out.println("Team data: " + createTeamDTO);

            DisplayTeamDTO createdTeam = topicApplicationService.createTeam(topicId, createTeamDTO, "anonymous");
            return ResponseEntity.status(HttpStatus.CREATED).body(createdTeam);

        } catch (IllegalArgumentException e) {
            System.err.println("Invalid argument: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            System.err.println("Unexpected error creating team: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    @GetMapping("/topic/{topicId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<DisplayTeamDTO>> getTeamsByTopic(@PathVariable("topicId") String topicId) {
        try {
            List<DisplayTeamDTO> teams = topicApplicationService.getTeamsByTopic(topicId);
            return ResponseEntity.ok(teams);
        } catch (Exception e) {
            System.err.println("Error fetching teams for topic: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{teamId}")
    @PreAuthorize("hasAnyRole('PROFESSOR','ADMIN')")
    public ResponseEntity<DisplayTeamDTO> getTeamById(@PathVariable("teamId") String teamId) {
        try {
            DisplayTeamDTO team = topicApplicationService.getTeamById(teamId);
            return ResponseEntity.ok(team);
        } catch (Exception e) {
            System.err.println("Error fetching team: " + e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/delete-team/{id}")
    @Transactional
    @PreAuthorize("hasRole('PROFESSOR')")
    public ResponseEntity<Void> delete(@PathVariable("id") String id) {
        this.teamApplicationService.delete(id);

        return ResponseEntity.noContent().build();
    }

}
