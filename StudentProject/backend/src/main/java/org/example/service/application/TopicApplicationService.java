package org.example.service.application;

import org.example.model.DTOs.teamDTO.CreateTeamDTO;
import org.example.model.DTOs.teamDTO.DisplayTeamDTO;
import org.example.model.DTOs.topicDTO.DisplayTopicDTO;
import java.nio.file.AccessDeniedException;
import java.util.List;
import java.util.Optional;

public interface TopicApplicationService {

    List<DisplayTopicDTO> findAll();

    Optional<DisplayTopicDTO> findByID(String id);

    boolean isClosed(String topicId);

    Optional<DisplayTopicDTO> chooseTopic(String topicId, String username) throws AccessDeniedException;

    DisplayTeamDTO createTeam(String topicId, CreateTeamDTO createTeamDTO, String username);

    List<DisplayTeamDTO> getTeamsByTopic(String topicId);

    DisplayTeamDTO getTeamById(String teamId);

    void deleteTeam(String teamId, String username);
}
