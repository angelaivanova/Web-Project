package org.example.service.application.Impl;

import jakarta.transaction.Transactional;
import org.example.model.DTOs.studentDTO.DisplayStudentDTO;
import org.example.model.DTOs.teamDTO.DisplayTeamDTO;
import org.example.model.Team;
import org.example.repository.TeamRepository;
import org.example.service.application.TeamApplicationService;
import org.example.service.domain.TeamDomainService;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TeamApplicationServiceImpl implements TeamApplicationService {

    private final TeamRepository teamRepository;
    private final TeamDomainService teamDomainService;

    public TeamApplicationServiceImpl(TeamRepository teamRepository, TeamDomainService teamDomainService) {
        this.teamRepository = teamRepository;
        this.teamDomainService = teamDomainService;
    }

    @Override
    public List<DisplayTeamDTO> findAll() {
        return this.teamDomainService.findAll().stream()
                .map(DisplayTeamDTO::from)
                .collect(Collectors.toList());
    }

    @Override
    public List<DisplayTeamDTO> getTeamsByTopicId(String topicId) {
        List<Team> teams = teamRepository.findByTopicId(topicId);
        return teams.stream()
                .map(DisplayTeamDTO::from)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void delete(String id) {
        this.teamDomainService.delete(id);
    }
}
