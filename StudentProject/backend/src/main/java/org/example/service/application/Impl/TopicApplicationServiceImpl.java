package org.example.service.application.Impl;

import org.example.model.DTOs.teamDTO.CreateTeamDTO;
import org.example.model.DTOs.teamDTO.DisplayTeamDTO;
import org.example.model.DTOs.topicDTO.DisplayTopicDTO;
import org.example.model.Student;
import org.example.model.Team;
import org.example.model.Topic;
import org.example.repository.StudentRepository;
import org.example.repository.TeamRepository;
import org.example.repository.TopicRepository;
import org.example.service.application.TopicApplicationService;
import org.example.service.domain.TopicDomainService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TopicApplicationServiceImpl implements TopicApplicationService {

    private final TopicDomainService topicDomainService;
    private final TopicRepository topicRepository;
    private final StudentRepository studentRepository;
    private final TeamRepository teamRepository;

    public TopicApplicationServiceImpl(TopicDomainService topicDomainService, TopicRepository topicRepository, StudentRepository studentRepository, TeamRepository teamRepository) {
        this.topicDomainService = topicDomainService;
        this.topicRepository = topicRepository;
        this.studentRepository = studentRepository;
        this.teamRepository = teamRepository;
    }

    @Override
    public List<DisplayTopicDTO> findAll() {
        return this.topicDomainService.findAll().stream()
                .map(DisplayTopicDTO::from)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<DisplayTopicDTO> findByID(String id) {
        return this.topicDomainService.findByID(id)
                .map(DisplayTopicDTO::from);
    }

    @Override
    public boolean isClosed(String topicId) {
        return topicDomainService.isClosed(topicId);
    }

    @Override
    @Transactional
    public DisplayTeamDTO createTeam(String topicId, CreateTeamDTO createTeamDTO, String username) {
        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new IllegalArgumentException("Topic not found with id: " + topicId));

        List<Student> students = studentRepository.findAllById(createTeamDTO.studentIds());
        if (students.size() != createTeamDTO.studentIds().size()) {
            throw new IllegalArgumentException("One or more students not found");
        }

        if (students.size() > topic.getMembersPerGroup()) {
            throw new IllegalArgumentException("Team size exceeds topic limit of " + topic.getMembersPerGroup());
        }

        Team team = new Team();
        team.setId(UUID.randomUUID().toString());
        team.setName(createTeamDTO.name());
        team.setTopic(topic);
        team.setMembers(students);

        Team savedTeam = teamRepository.save(team);

        return DisplayTeamDTO.from(savedTeam);
    }

    @Override
    public List<DisplayTeamDTO> getTeamsByTopic(String topicId) {
        List<Team> teams = teamRepository.findByTopicId(topicId);
        return teams.stream()
                .map(DisplayTeamDTO::from)
                .collect(Collectors.toList());
    }

    @Override
    public DisplayTeamDTO getTeamById(String teamId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new IllegalArgumentException("Team not found with id: " + teamId));
        return DisplayTeamDTO.from(team);
    }

    @Override
    @Transactional
    public void deleteTeam(String teamId, String username) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new IllegalArgumentException("Team not found with id: " + teamId));

        teamRepository.delete(team);
    }

    @Override
    public Optional<DisplayTopicDTO> chooseTopic(String topicId, String username) {
        return topicDomainService.chooseTopic(topicId, username)
                .map(DisplayTopicDTO::from);
    }
}
